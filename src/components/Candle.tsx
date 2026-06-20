import { useId } from 'react';

interface CandleProps {
  lit?: boolean;
  showSmoke?: boolean;
  className?: string;
}

/** A single chunky candle. Used as the lone light source in the dark scene. */
export default function Candle({ lit = true, showSmoke = true, className }: CandleProps) {
  const uid = useId().replace(/:/g, '');
  const flameGrad = `flame-${uid}`;
  const stripes = `stripes-${uid}`;

  return (
    <svg
      className={className}
      viewBox="0 0 80 180"
      width="80"
      height="180"
      fill="none"
      role="img"
      aria-label="A glowing candle"
    >
      <defs>
        <linearGradient id={flameGrad} x1="40" y1="12" x2="40" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff8a4c" />
          <stop offset="0.55" stopColor="#ffcf6b" />
          <stop offset="1" stopColor="#fff1c2" />
        </linearGradient>
        <pattern id={stripes} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="22" height="22" fill="#ffd0dd" />
          <rect width="11" height="22" fill="#ffe3ea" />
        </pattern>
      </defs>

      {lit && <circle className="candle-halo" cx="40" cy="36" r="30" fill="#ffce85" />}

      {lit ? (
        <g className="flame">
          <path d="M40 12 C 28 30, 30 46, 40 56 C 50 46, 52 30, 40 12 Z" fill={`url(#${flameGrad})`} />
          <path d="M40 30 C 35 38, 35 48, 40 54 C 45 48, 45 38, 40 30 Z" fill="#fff1c2" />
        </g>
      ) : showSmoke ? (
        <path
          className="smoke"
          d="M40 34 c 7 -7 -7 -13 0 -22"
          stroke="#b9aec0"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      ) : null}

      <rect x="38" y="54" width="4" height="12" rx="2" fill="#5b4660" />
      <rect x="22" y="64" width="36" height="104" rx="16" fill={`url(#${stripes})`} stroke="#ffbccc" strokeWidth="2" />
      <ellipse cx="40" cy="66" rx="17" ry="5" fill="#fff" opacity="0.55" />
    </svg>
  );
}
