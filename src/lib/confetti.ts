import confetti from 'canvas-confetti';

const PASTEL = ['#ffb5a7', '#ff8fab', '#9ee7d3', '#ffe08a', '#c8b6ff', '#a9e7ff'];

/** A single cheerful pop of confetti from a given screen position (0–1). */
export function burst(x = 0.5, y = 0.55): void {
  confetti({
    particleCount: 130,
    spread: 90,
    startVelocity: 48,
    origin: { x, y },
    colors: PASTEL,
    scalar: 1.15,
    ticks: 240,
    disableForReducedMotion: true,
  });
}

/**
 * The big "petasan" celebration: one large center pop, then a couple of
 * seconds of side cannons firing inward. Self-stops; no cleanup needed.
 */
export function fireworks(durationMs = 2200): void {
  // Opening blast from the middle of the screen.
  confetti({
    particleCount: 180,
    spread: 110,
    startVelocity: 58,
    origin: { x: 0.5, y: 0.5 },
    colors: PASTEL,
    scalar: 1.25,
    ticks: 260,
    disableForReducedMotion: true,
  });

  const end = Date.now() + durationMs;
  const frame = () => {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 70,
      startVelocity: 50,
      origin: { x: 0, y: 0.7 },
      colors: PASTEL,
      scalar: 1.1,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 70,
      startVelocity: 50,
      origin: { x: 1, y: 0.7 },
      colors: PASTEL,
      scalar: 1.1,
      disableForReducedMotion: true,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}
