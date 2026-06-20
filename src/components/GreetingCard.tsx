import { config } from "../config";
import { useTypewriter } from "../lib/typewriter";

interface GreetingCardProps {
  onClose: () => void;
}

/** The heartfelt card that flies out once the envelope is opened. */
export default function GreetingCard({ onClose }: GreetingCardProps) {
  const { shown, done } = useTypewriter(config.greeting);

  return (
    <div className="card-overlay" role="dialog" aria-modal="true" aria-label="Birthday card">
      <div className="card-backdrop" onClick={onClose} />
      <div className="greeting-card">
        <button type="button" className="card-close" onClick={onClose} aria-label="Close card">
          ×
        </button>
        <p className="card-eyebrow">🎉 Happy Birthday 🎉</p>
        <h2 className="card-name">{config.recipientName}</h2>

        {/* The ghost reserves the full height so the card never reflows while typing. */}
        <p className="card-message" aria-label={config.greeting}>
          <span className="card-message-ghost" aria-hidden="true">
            {config.greeting}
          </span>
          <span className="card-message-typed" aria-hidden="true">
            {shown}
            <span className={`type-caret ${done ? "is-done" : ""}`} />
          </span>
        </p>

        <div className={`card-signoff ${done ? "is-visible" : ""}`}>
          <p className="card-sign">From your biggest Fan,</p>
          <p className="card-sender">{config.senderName}</p>
          <div className="card-deco" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((n) => (
              <img key={n} className="card-sticker" src={`${import.meta.env.BASE_URL}sticker-${n}.png`} alt="" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
