import React, { useEffect, useRef } from 'react';
import { Compass, MapPin, ArrowDown } from 'lucide-react';
import { spaceAudio } from '../utils/audio';

interface HeroProps {
  onStartExploring: () => void;
  onOpenMap: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartExploring, onOpenMap }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subtle interactive starfield & orbital dust particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      velocity: Math.random() * 0.2 + 0.05,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render drifting stars
      stars.forEach((star) => {
        star.y -= star.velocity;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        ctx.fillStyle = `rgba(217, 221, 227, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 overflow-hidden bg-[#05070B]">
      {/* Background Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-80"
      />

      {/* Atmospheric Cinematic Backdrop with Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/src/assets/images/hero_space_archaeology_1790849307401.jpg"
          alt="Space archaeology landscape of planetary exploration on Mars and the Moon"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Layered cinematic radial scrims for 100% text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/75 to-[#05070B]/50" />
        <div className="absolute inset-0 space-radial-glow opacity-80" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-12">
        <div className="max-w-4xl space-y-6">
          {/* Scientific Archive Kicker */}
          <div className="flex items-center gap-3 text-xs sm:text-sm font-hud tracking-widest text-[#62D9FF]">
            <span className="w-2 h-2 rounded-full bg-[#62D9FF] animate-pulse" />
            <span>NASA SPACE APPS CHALLENGE 2026</span>
            <span className="text-white/20">|</span>
            <span className="text-[#8D98A8]">SPACE ARCHAEOLOGY EXPEDITION</span>
          </div>

          {/* Large Cinematic Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white uppercase leading-[0.95] font-hud text-balance">
            Abandoned <br />
            <span className="text-white/40">Not</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D9DDE3] via-[#62D9FF] to-[#B85C38]">
              Forgotten
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl md:text-3xl font-light text-[#D9DDE3] tracking-wide max-w-2xl leading-snug">
            “NASA’s machines may have stopped moving. <br className="hidden sm:inline" />
            Their stories never did.”
          </p>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-[#8D98A8] max-w-2xl font-light leading-relaxed">
            Explore the hardware left behind on the Moon and Mars—and discover the science,
            engineering, and human curiosity that made each extraterrestrial journey possible.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                spaceAudio.playTelemetryPing(880, 0.08);
                onStartExploring();
              }}
              className="px-6 sm:px-8 py-3.5 bg-gradient-to-r from-[#B85C38] to-[#9c4c2c] hover:from-[#c9653e] hover:to-[#B85C38] text-white font-hud font-semibold text-sm tracking-wider uppercase rounded-lg shadow-lg shadow-[#B85C38]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#62D9FF]"
            >
              <Compass className="w-4 h-4 text-[#62D9FF]" />
              Start Exploring
            </button>

            <button
              onClick={() => {
                spaceAudio.playTelemetryPing(1040, 0.06);
                onOpenMap();
              }}
              className="px-6 sm:px-8 py-3.5 bg-[#0B1018] hover:bg-[#111824] border border-white/20 hover:border-[#62D9FF]/50 text-white font-hud font-semibold text-sm tracking-wider uppercase rounded-lg transition-all cursor-pointer flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#62D9FF]"
            >
              <MapPin className="w-4 h-4 text-[#F3B562]" />
              Mission Map
            </button>
          </div>

          {/* Key Quick Stats Bar */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl text-xs sm:text-sm">
            <div>
              <span className="block font-mono-data text-xl sm:text-2xl font-bold text-white">55+ yrs</span>
              <span className="text-[#8D98A8] text-xs font-sans">Lunar Artifact Heritage</span>
            </div>
            <div>
              <span className="block font-mono-data text-xl sm:text-2xl font-bold text-[#B85C38]">45.16 km</span>
              <span className="text-[#8D98A8] text-xs font-sans">Opportunity Marathon Track</span>
            </div>
            <div>
              <span className="block font-mono-data text-xl sm:text-2xl font-bold text-[#62D9FF]">1,300+</span>
              <span className="text-[#8D98A8] text-xs font-sans">InSight Marsquakes Mapped</span>
            </div>
            <div>
              <span className="block font-mono-data text-xl sm:text-2xl font-bold text-[#F3B562]">100% Active</span>
              <span className="text-[#8D98A8] text-xs font-sans">Apollo Laser Reflectors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator & Tagline */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8D98A8]">
        <div className="flex items-center gap-2 font-hud tracking-wider">
          <span className="text-[#62D9FF]">●</span>
          <span>EVERY MACHINE LEFT A FOOTPRINT. EVERY FOOTPRINT TELLS A STORY.</span>
        </div>

        <button
          onClick={onStartExploring}
          className="flex items-center gap-2 text-[#D9DDE3] hover:text-[#62D9FF] transition-colors font-hud text-xs tracking-widest cursor-pointer group"
        >
          <span>DISCOVER THE MACHINES</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
