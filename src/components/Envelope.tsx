interface EnvelopeProps {
  open: boolean;
  onClick: () => void;
}

/** A blush-pink envelope with a heart seal. Click to open the card. */
export default function Envelope({ open, onClick }: EnvelopeProps) {
  return (
    <button
      type="button"
      className={`envelope ${open ? 'is-open' : ''}`}
      onClick={onClick}
      aria-label="Open the birthday card"
    >
      <svg viewBox="0 0 230 178" width="100%" fill="none">
        {/* letter peeking out */}
        <g className="env-letter">
          <rect x="40" y="18" width="150" height="112" rx="8" fill="#fffdf7" stroke="#ffe3ea" strokeWidth="2" />
          <line x1="58" y1="44" x2="172" y2="44" stroke="#ffd0dd" strokeWidth="4" strokeLinecap="round" />
          <line x1="58" y1="62" x2="150" y2="62" stroke="#cfeee4" strokeWidth="4" strokeLinecap="round" />
          <line x1="58" y1="80" x2="162" y2="80" stroke="#e7dbf6" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* body */}
        <rect x="20" y="60" width="190" height="100" rx="16" fill="#ffb5a7" />
        <path d="M20 152 L115 100 L210 152 Z" fill="#ff9f8e" />
        <path d="M20 68 L115 122 L210 68 Z" fill="#ffc4b8" />

        {/* flap (lifts up when open) */}
        <path className="env-flap" d="M22 62 L115 118 L208 62 Q 208 60 206 60 L24 60 Q 22 60 22 62 Z" fill="#ffa593" />

        {/* heart wax seal */}
        <g className="env-seal">
          <circle cx="115" cy="94" r="16" fill="#ff8fab" />
          <path d="M115 101 c -6 -5 -10 -8 -10 -13 a 4 4 0 0 1 10 -2 a 4 4 0 0 1 10 2 c 0 5 -4 8 -10 13 Z" fill="#fff" />
        </g>
      </svg>
      <span className="env-hint">open me 💌</span>
    </button>
  );
}
