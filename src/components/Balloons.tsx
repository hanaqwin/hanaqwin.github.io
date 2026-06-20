const BALLOONS = [
  { c: '#ff8fab', left: '7%', top: '13%', delay: '0s', size: 96 },
  { c: '#9ee7d3', left: '85%', top: '11%', delay: '0.5s', size: 84 },
  { c: '#ffe08a', left: '15%', top: '47%', delay: '1s', size: 70 },
  { c: '#c8b6ff', left: '80%', top: '49%', delay: '0.25s', size: 88 },
  { c: '#a9e7ff', left: '92%', top: '67%', delay: '0.75s', size: 62 },
  { c: '#ffb5a7', left: '3%', top: '66%', delay: '1.2s', size: 72 },
];

/** Pastel balloons that drift gently behind the celebration. */
export default function Balloons() {
  return (
    <div className="balloons" aria-hidden="true">
      {BALLOONS.map((b, i) => (
        <div
          key={i}
          className="balloon"
          style={{ left: b.left, top: b.top, width: b.size, animationDelay: b.delay }}
        >
          <svg viewBox="0 0 70 116" width="100%" fill="none">
            <ellipse cx="35" cy="40" rx="30" ry="36" fill={b.c} />
            <path d="M35 75 l -6 9 h 12 Z" fill={b.c} />
            <path d="M35 84 q 9 14 -2 26" stroke={b.c} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.75" />
            <ellipse cx="25" cy="29" rx="7" ry="11" fill="#fff" opacity="0.45" />
          </svg>
        </div>
      ))}
    </div>
  );
}
