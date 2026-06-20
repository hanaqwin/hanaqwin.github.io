interface LightSwitchProps {
  on: boolean;
  onClick: () => void;
}

/** A friendly wall switch with a vertical toggle that slides down when on. */
export default function LightSwitch({ on, onClick }: LightSwitchProps) {
  return (
    <button
      type="button"
      className={`light-switch ${on ? 'is-on' : ''}`}
      onClick={onClick}
      aria-pressed={on}
      aria-label={on ? 'Lights are on' : 'Turn on the lights'}
    >
      <svg viewBox="0 0 120 190" width="116" height="184" fill="none">
        <rect x="6" y="6" width="108" height="178" rx="24" fill="#fff7f0" stroke="#ecdcd3" strokeWidth="3" />
        <circle cx="60" cy="22" r="3.5" fill="#e3d2c9" />
        <circle cx="60" cy="168" r="3.5" fill="#e3d2c9" />
        <rect className="switch-track" x="42" y="44" width="36" height="102" rx="18" />
        <g className="switch-knob">
          <circle cx="60" cy="64" r="15" fill="#fff" stroke="#f0dfd6" strokeWidth="2" />
          <circle className="switch-knob-dot" cx="60" cy="64" r="6" />
        </g>
      </svg>
    </button>
  );
}
