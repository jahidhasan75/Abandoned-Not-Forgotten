import React, { useState } from 'react';
import { WHY_LEAVE_IT_REASONS } from '../data/missionsData';
import { spaceAudio } from '../utils/audio';
import { HelpCircle, ChevronRight, Scale, Clock, ShieldCheck, ShieldAlert } from 'lucide-react';

export const WhyLeaveItBehind: React.FC = () => {
  const [selectedReasonId, setSelectedReasonId] = useState<string>(WHY_LEAVE_IT_REASONS[0].id);

  const selectedReason =
    WHY_LEAVE_IT_REASONS.find((r) => r.id === selectedReasonId) || WHY_LEAVE_IT_REASONS[0];

  const getReasonIcon = (id: string) => {
    switch (id) {
      case 'rocket-equation':
        return <Scale className="w-5 h-5 text-[#62D9FF]" />;
      case 'extended-science':
        return <Clock className="w-5 h-5 text-[#F3B562]" />;
      case 'space-archaeology':
        return <ShieldCheck className="w-5 h-5 text-[#D9DDE3]" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-[#B85C38]" />;
    }
  };

  return (
    <section className="relative py-24 bg-[#05070B] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-hud tracking-widest text-[#62D9FF] mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>ETHICS & ASTRODYNAMICS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-hud uppercase tracking-tight text-white">
            Why Leave It Behind?
          </h2>
          <p className="mt-2 text-base text-[#8D98A8] font-light">
            To the untrained eye, left-behind hardware looks like cosmic litter. To space scientists and
            archaeologists, every machine was designed intentionally to remain on site.
          </p>
        </div>

        {/* 2-Column Interactive Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Reason List Tabs (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {WHY_LEAVE_IT_REASONS.map((reason) => {
              const isSelected = selectedReasonId === reason.id;
              return (
                <div
                  key={reason.id}
                  onClick={() => {
                    spaceAudio.playTelemetryPing(880, 0.04);
                    setSelectedReasonId(reason.id);
                  }}
                  className={`p-5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#0B1018] border-white/40 shadow-xl ring-1 ring-white/20'
                      : 'bg-[#0B1018]/40 border-white/10 hover:border-white/20 hover:bg-[#0B1018]/70'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 shrink-0">
                      {getReasonIcon(reason.id)}
                    </div>
                    <div>
                      <h3 className="font-hud font-bold text-sm text-white">
                        {reason.title}
                      </h3>
                      <p className="text-xs text-[#8D98A8] mt-0.5">{reason.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-[#62D9FF] translate-x-1' : 'text-[#8D98A8]'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Right Column: Deep Dive Display Card (7 cols) */}
          <div className="lg:col-span-7 bg-[#0B1018] rounded-2xl border border-white/15 p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono-data text-[#62D9FF] tracking-wider uppercase">
                ANALYSIS // {selectedReason.subtitle}
              </span>
              <div className="text-right">
                <span className="text-2xl font-mono-data font-bold text-white block">
                  {selectedReason.metric}
                </span>
                <span className="text-[10px] uppercase font-mono-data text-[#8D98A8]">
                  {selectedReason.metricLabel}
                </span>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-hud text-white leading-tight">
              {selectedReason.title}
            </h3>

            <p className="text-base text-[#D9DDE3] leading-relaxed font-light">
              {selectedReason.summary}
            </p>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#8D98A8] leading-relaxed space-y-2">
              <span className="text-white font-hud uppercase tracking-wider block font-semibold">
                In-Depth Technical Context:
              </span>
              <p>{selectedReason.detail}</p>
            </div>

            {/* Core Epigram */}
            <div className="pt-4 border-t border-white/10 text-xs text-white/90 italic font-light flex items-center gap-2">
              <span className="text-[#62D9FF]">“</span>
              <span>
                Discarded does not mean useless or forgotten. Every kilogram saved on Earth return was a
                kilogram dedicated to discovery.
              </span>
              <span className="text-[#62D9FF]">”</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
