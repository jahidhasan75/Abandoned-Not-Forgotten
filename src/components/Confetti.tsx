import React, { useMemo } from 'react';

const CONFETTI_COLOURS = ['var(--color-accent)', 'var(--color-ok)', 'var(--color-journey)', 'var(--color-state-bar)', 'var(--color-fg)'];

/** A one-off confetti burst over the result card (hidden with reduced motion). */
export const Confetti: React.FC = () => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        dx: `${Math.round((Math.random() - 0.5) * 160)}px`,
        r: `${Math.round(360 + Math.random() * 540)}deg`,
        d: `${(Math.random() * 0.35).toFixed(2)}s`,
        colour: CONFETTI_COLOURS[i % CONFETTI_COLOURS.length],
        round: i % 3 === 0,
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={
            {
              left: p.left,
              background: p.colour,
              borderRadius: p.round ? '9999px' : undefined,
              width: p.round ? 8 : undefined,
              height: p.round ? 8 : undefined,
              '--dx': p.dx,
              '--r': p.r,
              '--d': p.d,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};
