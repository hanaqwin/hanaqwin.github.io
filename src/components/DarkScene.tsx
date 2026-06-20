import { useCallback, useEffect, useState } from 'react';
import Candle from './Candle';
import LightSwitch from './LightSwitch';
import { config } from '../config';
import { useTypewriter, prefersReducedMotion } from '../lib/typewriter';

type Phase = 'black' | 'candle' | 'question' | 'switch';

interface DarkSceneProps {
  onTurnOn: () => void;
}

/** The typed "why is it so dark" line: types out, holds, then fades away. */
function IntroQuestion({ text, onDone }: { text: string; onDone: () => void }) {
  const { shown, done } = useTypewriter(text, 42, 150);
  const [leaving, setLeaving] = useState(false);

  // Once fully typed, hold for a beat then start fading.
  useEffect(() => {
    if (!done) return;
    const hold = window.setTimeout(() => setLeaving(true), 1000);
    return () => window.clearTimeout(hold);
  }, [done]);

  // When the fade-out finishes, hand control back to the parent.
  useEffect(() => {
    if (!leaving) return;
    const fade = window.setTimeout(onDone, 600); // matches the CSS fade duration
    return () => window.clearTimeout(fade);
  }, [leaving, onDone]);

  return (
    <p className={`intro-question ${leaving ? 'is-leaving' : ''}`} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
      <span className={`type-caret ${done ? 'is-done' : ''}`} aria-hidden="true" />
    </p>
  );
}

/**
 * The opening act. Plays a small cinematic before the light switch appears:
 *   black (2s) → a candle fades in unlit, then ignites → a typed line, then
 *   fades → the light switch invites you to turn the lights on.
 */
export default function DarkScene({ onTurnOn }: DarkSceneProps) {
  // Skip the whole intro for users who prefer reduced motion.
  const [phase, setPhase] = useState<Phase>(() =>
    prefersReducedMotion() ? 'switch' : 'black',
  );
  const [candleLit, setCandleLit] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const timers = [
      window.setTimeout(() => setPhase('candle'), 2000), // 2s of darkness
      window.setTimeout(() => setCandleLit(true), 2800), // candle ignites
      window.setTimeout(() => setPhase('question'), 3500), // the line types in
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  const revealSwitch = useCallback(() => setPhase('switch'), []);

  return (
    <section className="dark-scene">
      {phase !== 'black' && (
        <>
          <Candle
            className={`hero-candle intro-candle ${candleLit ? 'is-lit' : ''}`}
            lit={candleLit}
            showSmoke={false}
          />

          <div className="intro-slot">
            {phase === 'question' && (
              <IntroQuestion text={config.introText} onDone={revealSwitch} />
            )}

            {phase === 'switch' && (
              <div className="switch-wrap intro-enter">
                <LightSwitch on={false} onClick={onTurnOn} />
                <p className="switch-hint">{config.switchHint}</p>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
