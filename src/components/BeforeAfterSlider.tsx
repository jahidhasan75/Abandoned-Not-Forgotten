import React, { useState, useRef, useCallback } from 'react';
import { Sliders, Sparkles, Clock } from 'lucide-react';
import { spaceAudio } from '../utils/audio';

export const BeforeAfterSlider: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pct);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <section className="relative py-24 bg-[#05070B] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-hud tracking-widest text-[#62D9FF] mb-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>TEMPORAL MORPHOLOGY COMPARISON</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-hud uppercase tracking-tight text-white">
              Before & After
            </h2>
            <p className="mt-2 text-base text-[#8D98A8] max-w-xl font-light">
              Drag the dividing line to inspect how the harsh extraterrestrial environment transforms
              gleaming human engineering into an archaeological monument.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono-data text-[#F3B562] block">
              SLIDER POSITION: {Math.round(sliderPosition)}% DAY 1 / {100 - Math.round(sliderPosition)}% YEARS LATER
            </span>
            <span className="text-xs text-[#8D98A8]">Drag cursor or touch to slide</span>
          </div>
        </div>

        {/* Draggable Stage Container */}
        <div
          ref={containerRef}
          onMouseDown={() => {
            setIsDragging(true);
            spaceAudio.playTelemetryPing(850, 0.03);
          }}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative w-full h-[380px] sm:h-[480px] md:h-[560px] rounded-2xl overflow-hidden border border-white/20 select-none shadow-2xl cursor-ew-resize bg-[#0B1018]"
        >
          {/* Base Layer: YEARS LATER (Right side / background) */}
          <div className="absolute inset-0">
            <img
              src="/src/assets/images/rover_years_later_1790849363552.jpg"
              alt="Weathered robotic Mars rover years later covered in dust"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover pointer-events-none"
            />
            {/* Dark Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070B]/80 via-transparent to-black/30 pointer-events-none" />

            {/* Right Side Annotation Label */}
            <div className="absolute bottom-6 right-6 z-10 text-right pointer-events-none bg-[#05070B]/80 p-4 rounded-xl border border-white/10 backdrop-blur-md max-w-xs">
              <div className="flex items-center justify-end gap-1.5 text-xs font-hud font-bold text-[#B85C38] tracking-widest uppercase mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>YEARS LATER</span>
              </div>
              <p className="text-xs text-[#D9DDE3] font-light">
                Solar arrays coated in Martian iron oxide dust, joints cold-welded in vacuum, silent
                monument to human exploration.
              </p>
            </div>
          </div>

          {/* Top Layer: MISSION DAY 1 (Clipped to sliderPosition) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <div
              className="relative h-full"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw',
              }}
            >
              <img
                src="/src/assets/images/rover_mission_day_one_1790849350841.jpg"
                alt="Pristine robotic explorer on landing day"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070B]/80 via-transparent to-black/30 pointer-events-none" />

              {/* Left Side Annotation Label */}
              <div className="absolute bottom-6 left-6 z-10 pointer-events-none bg-[#05070B]/80 p-4 rounded-xl border border-white/10 backdrop-blur-md max-w-xs">
                <div className="flex items-center gap-1.5 text-xs font-hud font-bold text-[#62D9FF] tracking-widest uppercase mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>MISSION DAY 1</span>
                </div>
                <p className="text-xs text-[#D9DDE3] font-light">
                  Spotless gallium arsenide solar cells, pristine gold Kapton thermal foil, and sharp
                  aluminum wheel treads.
                </p>
              </div>
            </div>
          </div>

          {/* Dividing Draggable Handle Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.7)] z-20 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#05070B] border-2 border-white flex items-center justify-center text-white shadow-2xl">
              <Sliders className="w-4 h-4 text-[#62D9FF]" />
            </div>
          </div>

          {/* Top Center Pill-free Badge */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-[#05070B]/80 px-4 py-1.5 rounded-full border border-white/15 text-xs font-mono-data text-[#8D98A8] backdrop-blur-sm pointer-events-none">
            DRAG TO INSPECT SURVIVAL ARTIFACTS
          </div>
        </div>

        {/* Poetic Center Caption */}
        <div className="mt-8 text-center max-w-xl mx-auto space-y-1">
          <p className="text-lg font-light text-white italic">
            “Technology changes. The scientific legacy remains.”
          </p>
          <p className="text-xs text-[#8D98A8] font-mono-data">
            ARTIFACT FORENSICS · NASA SPACE APPS CHALLENGE 2026
          </p>
        </div>
      </div>
    </section>
  );
};
