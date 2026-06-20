interface PhotoFrameProps {
  photoUrl: string;
  name: string;
}

/** A tilted polaroid holding the birthday person's photo (or a placeholder). */
export default function PhotoFrame({ photoUrl, name }: PhotoFrameProps) {
  const src = photoUrl ? `${import.meta.env.BASE_URL}${photoUrl}` : "";

  return (
    <div className="photo-frame">
      <span className="photo-tape tl" />
      <span className="photo-tape tr" />
      <div className="photo-img">
        {src ? (
          <img src={src} alt={`${name} smiling`} />
        ) : (
          <svg viewBox="0 0 200 200" width="100%" fill="none" role="img" aria-label="Photo placeholder">
            <rect width="200" height="200" fill="#ffeaf0" />
            <circle cx="100" cy="84" r="40" fill="#ffd0dd" />
            <circle cx="86" cy="78" r="5" fill="#5b4660" />
            <circle cx="114" cy="78" r="5" fill="#5b4660" />
            <path d="M84 98 q 16 16 32 0" stroke="#5b4660" strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="74" cy="90" r="6" fill="#ff8fab" opacity="0.5" />
            <circle cx="126" cy="90" r="6" fill="#ff8fab" opacity="0.5" />
            <text x="100" y="162" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontSize="15" fill="#9385a0">
              Your photo here
            </text>
          </svg>
        )}
      </div>
      <p className="photo-caption">{name}</p>
    </div>
  );
}
