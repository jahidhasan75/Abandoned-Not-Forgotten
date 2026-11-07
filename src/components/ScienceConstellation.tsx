import React, { useState } from 'react';
import { CONSTELLATION_NODES, CONSTELLATION_LINKS } from '../data/missionsData';
import { ConstellationNode } from '../types/mission';
import { spaceAudio } from '../utils/audio';
import { useI18n } from '../i18n/I18nProvider';

export const ScienceConstellation: React.FC = () => {
  const { t } = useI18n();
  const [selectedNode, setSelectedNode] = useState<ConstellationNode | null>(CONSTELLATION_NODES[0]);
  const [hoveredNode, setHoveredNode] = useState<ConstellationNode | null>(null);

  // SVG dimensions
  const width = 1100;
  const height = 460;

  const activeNode = hoveredNode || selectedNode;

  const isLinkActive = (sourceId: string, targetId: string) => {
    if (!activeNode) return false;
    return sourceId === activeNode.id || targetId === activeNode.id;
  };

  // Neutral graph: machines are filled dots, discoveries are open rings. The selected node and
  // its links take the one accent.
  const ACCENT = '#d0704a';
  const getNodeColor = (node: ConstellationNode) => {
    if (activeNode?.id === node.id) return ACCENT;
    if (node.category === 'machine') return '#a3a9b8';
    if (node.category === 'breakthrough') return '#eef0f5';
    return '#a3a9b8';
  };

  return (
    <section id="science" className="relative py-12 sm:py-20 lg:py-24 bg-page border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="section-label">{t('constellation.kicker')}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl text-fg">
              {t('constellation.title')}
            </h2>
            <p className="mt-3 text-base text-fg-2 max-w-xl">
              {t('constellation.intro')}
            </p>
          </div>

          <div className="flex items-center gap-5 text-xs text-fg-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-fg-2" />
              <span>Machine</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full border border-fg" />
              <span>Discovery</span>
            </div>
          </div>
        </div>

        {/* Constellation Canvas Viewport */}
        <div className="relative rounded-2xl border border-line bg-ink overflow-hidden p-4 sm:p-6">
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto min-w-192 select-none"
            >

              {/* Connecting Lines */}
              {CONSTELLATION_LINKS.map((link, idx) => {
                const source = CONSTELLATION_NODES.find((n) => n.id === link.source);
                const target = CONSTELLATION_NODES.find((n) => n.id === link.target);
                if (!source || !target) return null;

                const active = isLinkActive(link.source, link.target);

                return (
                  <g key={idx}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={active ? ACCENT : 'rgba(238,240,245,0.12)'}
                      strokeWidth={active ? 1.5 : 1}
                    />
                  </g>
                );
              })}

              {/* Nodes */}
              {CONSTELLATION_NODES.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isHovered = hoveredNode?.id === node.id;
                const color = getNodeColor(node);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer"
                    onClick={() => {
                      spaceAudio.playTelemetryPing(1000, 0.05);
                      setSelectedNode(node);
                    }}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Generous invisible hit area */}
                    <circle r="16" fill="transparent" />
                    {node.category === 'machine' ? (
                      <circle r={6} fill={color} />
                    ) : (
                      <circle r={6} fill="#07080d" stroke={color} strokeWidth={1.5} />
                    )}

                    {/* Node Label */}
                    <text
                      y={node.category === 'machine' ? 24 : -16}
                      textAnchor="middle"
                      fill={isSelected || isHovered ? '#eef0f5' : '#a3a9b8'}
                      fontSize="12"
                      fontFamily="Inter, 'Hind Siliguri', sans-serif"
                      fontWeight={isSelected || isHovered ? 500 : 400}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Active Node Detail Callout Bar */}
          {activeNode && (
            <div className="mt-4 pt-4 border-t border-line flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-2 h-2 rounded-full shrink-0 bg-accent" />
                <div>
                  <h4 className="text-base text-fg">
                    {activeNode.label}
                  </h4>
                  <p className="text-xs text-fg-2 mt-0.5">
                    {activeNode.description}
                  </p>
                </div>
              </div>

              <div className="text-xs font-mono-data text-fg-2 shrink-0">
                {CONSTELLATION_LINKS.filter((l) => l.source === activeNode.id || l.target === activeNode.id).length} links
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
