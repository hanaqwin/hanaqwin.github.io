interface MascotProps {
  jumping?: boolean;
}

/** A cheery little party blob that bobs along and jumps when the party starts. */
export default function Mascot({ jumping = false }: MascotProps) {
  return (
    <div className={`mascot ${jumping ? 'is-jumping' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 150 172" width="100%" fill="none">
        {/* party hat */}
        <path d="M75 8 L99 62 H51 Z" fill="#ff8fab" />
        <path d="M75 8 L87 34 H63 Z" fill="#ffe08a" />
        <circle cx="75" cy="8" r="7" fill="#c8b6ff" />
        {/* arms */}
        <path d="M32 116 q -16 -10 -19 -30" stroke="#7fdcc4" strokeWidth="11" strokeLinecap="round" fill="none" />
        <path d="M118 116 q 16 -10 19 -30" stroke="#7fdcc4" strokeWidth="11" strokeLinecap="round" fill="none" />
        {/* body */}
        <ellipse cx="75" cy="114" rx="50" ry="46" fill="#9ee7d3" />
        {/* cheeks */}
        <circle cx="52" cy="120" r="8" fill="#ff8fab" opacity="0.55" />
        <circle cx="98" cy="120" r="8" fill="#ff8fab" opacity="0.55" />
        {/* eyes */}
        <circle cx="60" cy="106" r="6" fill="#5b4660" />
        <circle cx="90" cy="106" r="6" fill="#5b4660" />
        <circle cx="62" cy="104" r="2" fill="#fff" />
        <circle cx="92" cy="104" r="2" fill="#fff" />
        {/* smile */}
        <path d="M62 126 q 13 14 26 0" stroke="#5b4660" strokeWidth="4" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}
