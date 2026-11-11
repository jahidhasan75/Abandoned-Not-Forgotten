import React, { useState } from 'react';
import { CONSTELLATION_NODES, CONSTELLATION_LINKS } from '../data/missionsData';
import { ConstellationNode } from '../types/mission';
import { spaceAudio } from '../utils/audio';
import { useI18n } from '../i18n/I18nProvider';

interface ScienceConstellationProps {
  onOpenMachine: (id: string) => void;
}

// The stage is always dark (bg-ink), so the graph uses the dark-theme values directly.
const ACCENT = '#d0704a';
const FG = '#eef0f5';
const FG2 = '#a3a9b8';

export const ScienceConstellation: React.FC<ScienceConstellationProps> = ({ onOpenMachine }) => {
  const { t, lang } = useI18n();
  const [selectedNode, setSelectedNode] = useState<ConstellationNode | null>(CONSTELLATION_NODES[0]);
  const [hoveredNode, setHoveredNode] = useState<ConstellationNode | null>(null);
  const num = (n: number) => n.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US');

  const width = 1100;
  const height = 460;
  const activeNode = hoveredNode || selectedNode;

  const labelOf = (n: ConstellationNode) => (lang === 'bn' && n.bn?.label) || n.label;
  const descOf = (n: ConstellationNode) => (lang === 'bn' && n.bn?.description) || n.description || '';
  const linksOf = (n: ConstellationNode) => CONSTELLATION_LINKS.filter((l) => l.source === n.id || l.target === n.id);
  const isLinkActive = (sourceId: string, targetId: string) =>
    !!activeNode && (sourceId === activeNode.id || targetId === activeNode.id);
  const isNeighbour = (n: ConstellationNode) =>
    !!activeNode && linksOf(activeNode).some((l) => l.source === n.id || l.target === n.id);

  const select = (node: ConstellationNode) => {
    spaceAudio.playTelemetryPing(1000, 0.05);
    setSelectedNode(node);
  };

  return (
    <section id="science" className="relative py-12 sm:py-20 lg:py-24 bg-page border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="section-label">{t('constellation.kicker')}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl text-fg">{t('constellation.title')}</h2>
            <p className="mt-3 text-base text-fg-2 max-w-xl">{t('constellation.intro')}</p>
          </div>

          <div className="flex items-center gap-5 text-xs text-fg-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-fg-2" aria-hidden="true" />
              <span>{t('constellation.legend.machine')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full border border-fg" aria-hidden="true" />
              <span>{t('constellation.legend.discovery')}</span>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl border border-line bg-ink overflow-hidden p-4 sm:p-6">
          <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-192 select-none" role="group" aria-label={t('constellation.title')}>
              {CONSTELLATION_LINKS.map((link, idx) => {
                const source = CONSTELLATION_NODES.find((n) => n.id === link.source);
                const target = CONSTELLATION_NODES.find((n) => n.id === link.target);
                if (!source || !target) return null;
                const active = isLinkActive(link.source, link.target);
                return (
                  <line
                    key={idx}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={active ? ACCENT : 'rgba(238,240,245,0.12)'}
                    strokeWidth={active ? 1.5 : 1}
                  />
                );
              })}

              {CONSTELLATION_NODES.map((node) => {
                const isActive = activeNode?.id === node.id;
                const lit = isActive || isNeighbour(node);
                const color = isActive ? ACCENT : node.category === 'breakthrough' ? FG : FG2;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer outline-none [&:focus-visible>circle:first-child]:stroke-fg"
                    role="button"
                    tabIndex={0}
                    aria-pressed={selectedNode?.id === node.id}
                    aria-label={`${labelOf(node)}: ${descOf(node)}`}
                    onClick={() => select(node)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        select(node);
                      }
                    }}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onFocus={() => setHoveredNode(node)}
                    onBlur={() => setHoveredNode(null)}
                  >
                    {/* Generous hit area; it also shows the keyboard focus ring */}
                    <circle r="16" fill="transparent" strokeWidth={1.5} />
                    {node.category === 'machine' ? (
                      <circle r={6} fill={color} />
                    ) : (
                      <circle r={6} fill="#07080d" stroke={color} strokeWidth={1.5} />
                    )}
                    <text
                      y={node.category === 'machine' ? 24 : -16}
                      textAnchor="middle"
                      fill={lit ? FG : FG2}
                      fontSize="12"
                      fontFamily="'Public Sans', 'Hind Siliguri', sans-serif"
                      fontWeight={isActive ? 500 : 400}
                    >
                      {labelOf(node)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {activeNode && (
            <div className="mt-4 pt-4 border-t border-line flex flex-col sm:flex-row sm:items-start justify-between gap-4" aria-live="polite">
              <div className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full shrink-0 bg-accent" aria-hidden="true" />
                <div>
                  <h3 className="text-base text-fg">{labelOf(activeNode)}</h3>
                  <p className="text-sm text-fg-2 mt-0.5">{descOf(activeNode)}</p>
                  {activeNode.category !== 'machine' && (
                    <p className="text-xs text-fg-2 mt-2">
                      {linksOf(activeNode)
                        .map((l) => CONSTELLATION_NODES.find((n) => n.id === (l.source === activeNode.id ? l.target : l.source)))
                        .filter(Boolean)
                        .map((n) => labelOf(n as ConstellationNode))
                        .join(' · ')}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-xs font-mono-data text-fg-2">
                  {t('constellation.links', { n: num(linksOf(activeNode).length) })}
                </span>
                {activeNode.artifactId && (
                  <button
                    type="button"
                    onClick={() => {
                      spaceAudio.playTelemetryPing(1080, 0.07);
                      onOpenMachine(activeNode.artifactId as string);
                    }}
                    className="btn-secondary"
                  >
                    {t('quiz.dossier')}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
