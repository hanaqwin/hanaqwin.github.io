import { useEffect, useMemo, useState } from 'react';

/** Split into grapheme clusters so emoji (e.g. 🎉) are typed as one piece. */
export function splitGraphemes(text: string): string[] {
  const Segmenter = (
    Intl as unknown as {
      Segmenter?: new (
        locales?: string | string[],
        options?: { granularity?: string },
      ) => { segment(input: string): Iterable<{ segment: string }> };
    }
  ).Segmenter;
  if (Segmenter) {
    const seg = new Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return Array.from(text); // fallback: split by code point
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Reveals `text` one character at a time, like it's being written live. */
export function useTypewriter(text: string, speed = 30, startDelay = 350) {
  const graphemes = useMemo(() => splitGraphemes(text), [text]);
  // Lazy init: reveal everything at once when the user prefers reduced motion.
  const [count, setCount] = useState(() =>
    prefersReducedMotion() ? graphemes.length : 0,
  );

  useEffect(() => {
    if (prefersReducedMotion()) return; // already fully shown
    let i = 0;
    let typer = 0;
    const starter = window.setTimeout(() => {
      typer = window.setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= graphemes.length) window.clearInterval(typer);
      }, speed);
    }, startDelay);
    return () => {
      window.clearTimeout(starter);
      window.clearInterval(typer);
    };
  }, [graphemes, speed, startDelay]);

  const shown = useMemo(() => graphemes.slice(0, count).join(''), [graphemes, count]);
  return { shown, done: count >= graphemes.length };
}
