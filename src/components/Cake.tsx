interface CakeProps {
  candleLit: boolean;
  onBlow: () => void;
}

const CANDLE_X = [62, 115, 168];

/** A two-tier cake. Tap it to blow out the candles (a little easter egg). */
export default function Cake({ candleLit, onBlow }: CakeProps) {
  return (
    <button
      type="button"
      className="cake"
      onClick={onBlow}
      aria-label={candleLit ? 'Blow out the candles' : 'The candles are out'}
    >
      <svg viewBox="0 0 230 212" width="100%" fill="none">
        {/* candles + flames */}
        {CANDLE_X.map((x) => (
          <g key={x}>
            {candleLit ? (
              <g className="flame">
                <path d={`M${x} 16 C ${x - 7} 28, ${x - 6} 38, ${x} 44 C ${x + 6} 38, ${x + 7} 28, ${x} 16 Z`} fill="#ffcf6b" />
                <path d={`M${x} 28 C ${x - 3} 33, ${x - 3} 39, ${x} 43 C ${x + 3} 39, ${x + 3} 33, ${x} 28 Z`} fill="#fff1c2" />
              </g>
            ) : (
              <path
                className="smoke"
                d={`M${x} 36 c 6 -6 -6 -11 0 -18`}
                stroke="#b9aec0"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            )}
            <rect x={x - 4} y="44" width="8" height="36" rx="3" fill="#fff" />
            <rect x={x - 4} y="44" width="3.5" height="36" fill="#ff8fab" opacity="0.55" />
          </g>
        ))}

        {/* top tier */}
        <rect x="42" y="84" width="146" height="46" rx="14" fill="#ffd0dd" />
        <path d="M42 96 q 12 -15 24 0 q 12 -15 24 0 q 12 -15 24 0 q 12 -15 24 0 q 12 -15 26 0 v 8 H42 Z" fill="#fff" />
        <circle cx="72" cy="113" r="3" fill="#9ee7d3" />
        <circle cx="104" cy="119" r="3" fill="#c8b6ff" />
        <circle cx="138" cy="113" r="3" fill="#ffe08a" />
        <circle cx="162" cy="119" r="3" fill="#a9e7ff" />

        {/* bottom tier */}
        <rect x="26" y="130" width="178" height="56" rx="16" fill="#9ee7d3" />
        <path d="M26 142 q 14 -16 29 0 q 14 -16 29 0 q 14 -16 29 0 q 14 -16 29 0 q 14 -16 30 0 v 10 H26 Z" fill="#fff" />
        <circle cx="64" cy="162" r="3.5" fill="#ff8fab" />
        <circle cx="104" cy="168" r="3.5" fill="#ffe08a" />
        <circle cx="150" cy="162" r="3.5" fill="#c8b6ff" />

        {/* plate */}
        <ellipse cx="115" cy="192" rx="106" ry="13" fill="#ffe08a" />
        <ellipse cx="115" cy="189" rx="106" ry="10" fill="#fff3c9" />
      </svg>
    </button>
  );
}
