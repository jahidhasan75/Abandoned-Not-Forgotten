import React, { useState } from 'react';
import { CONSTELLATION_NODES, CONSTELLATION_LINKS } from '../data/missionsData';
import { ConstellationNode } from '../types/mission';
import { spaceAudio } from '../utils/audio';
import { Network, Sparkles, Info } from 'lucide-react';

export const ScienceConstellation: React.FC = () => {
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

  const getNodeColor = (node: ConstellationNode) => {
    if (node.category === 'machine') {
      return node.destination === 'MARS' ? '#B85C38' : '#D9DDE3';
    }
    if (node.category === 'breakthrough') {
      return '#62D9FF';
    }
    return '#F3B562';
  };

  return (
    <section className="relative py-24 bg-[#05070B] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-hud tracking-widest text-[#62D9FF] mb-2">
              <Network className="w-3.5 h-3.5" />
              <span>DISCOVERY TOPOLOGY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-hud uppercase tracking-tight text-white">
              Science Impact Constellation
            </h2>
            <p className="mt-2 text-base text-[#8D98A8] max-w-xl font-light">
              Connect the discarded hardware to the scientific breakthroughs they forged. Click or hover any
              node to illuminate its research genealogy.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono-data text-[#8D98A8]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B85C38]" />
              <span>Mars Hardware</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D9DDE3]" />
              <span>Moon Hardware</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#62D9FF]" />
              <span>Breakthrough</span>
            </div>
          </div>
        </div>

        {/* Constellation Canvas Viewport */}
        <div className="relative rounded-2xl border border-white/15 bg-[#0B1018] overflow-hidden shadow-2xl p-4 sm:p-6">
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto min-w-[750px] select-none"
            >
              {/* Subtle background grid pattern */}
              <defs>
                <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#62D9FF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#62D9FF" stopOpacity="0" />
                </radialGradient>
              </defs>

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
                      stroke={active ? '#62D9FF' : 'rgba(255,255,255,0.1)'}
                      strokeWidth={active ? 2 : 1}
                      strokeDasharray={active ? 'none' : '4 4'}
                      className="transition-all duration-300"
                    />
                    {active && (
                      <circle
                        cx={(source.x + target.x) / 2}
                        cy={(source.y + target.y) / 2}
                        r="3"
                        fill="#62D9FF"
                        className="animate-ping"
                      />
                    )}
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
                    {/* Glowing outer aura if active */}
                    {(isSelected || isHovered) && (
                      <circle r="22" fill="url(#nodeGlow)" className="animate-pulse" />
                    )}

                    {/* Node Core */}
                    <circle
                      r={node.category === 'machine' ? 10 : 8}
                      fill="#05070B"
                      stroke={color}
                      strokeWidth={isSelected || isHovered ? 3 : 1.5}
                      className="transition-all duration-200"
                    />

                    {/* Inner pinpoint */}
                    <circle
                      r={node.category === 'machine' ? 4 : 3}
                      fill={color}
                    />

                    {/* Node Label */}
                    <text
                      y={node.category === 'machine' ? 24 : -16}
                      textAnchor="middle"
                      fill={isSelected || isHovered ? '#FFFFFF' : '#8D98A8'}
                      fontSize="11"
                      fontFamily="Space Grotesk, sans-serif"
                      fontWeight={isSelected || isHovered ? '700' : '500'}
                      className="transition-all duration-200"
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
            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: getNodeColor(activeNode) }}
                />
                <div>
                  <h4 className="text-base font-bold font-hud text-white">
                    {activeNode.label}
                  </h4>
                  <p className="text-xs text-[#8D98A8] mt-0.5">
                    {activeNode.description || 'Scientific impact node in the space exploration matrix.'}
                  </p>
                </div>
              </div>

              <div className="text-xs font-mono-data text-[#62D9FF] shrink-0 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {CONSTELLATION_LINKS.filter((l) => l.source === activeNode.id || l.target === activeNode.id).length}{' '}
                  Direct Connections
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
