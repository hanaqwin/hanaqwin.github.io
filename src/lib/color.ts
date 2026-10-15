// Colour maths for the custom ink picker: hue/saturation/brightness, the
// model the picker's square and slider are drawn in, to and from #rrggbb.

export interface Hsv {
  /** 0–360 */
  h: number;
  /** 0–1 */
  s: number;
  /** 0–1 */
  v: number;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function hsvToHex({ h, s, v }: Hsv): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  const hex = (x: number) =>
    Math.round(clamp01(x) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${hex(f(5))}${hex(f(3))}${hex(f(1))}`;
}

/** Hue is left at `fallbackHue` for greys, which have none of their own. */
export function hexToHsv(hex: string, fallbackHue = 0): Hsv {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let h = fallbackHue;
  if (d > 0) {
    if (max === r) h = 60 * (((g - b) / d + 6) % 6);
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

/** "#AbC", "abc123", " #abc123 " → "#aabbcc" / "#abc123"; anything else → null. */
export function parseHex(input: string): string | null {
  const bare = input.trim().replace(/^#/, "").toLowerCase();
  if (/^[0-9a-f]{6}$/.test(bare)) return `#${bare}`;
  if (/^[0-9a-f]{3}$/.test(bare)) return `#${bare.replace(/./g, (c) => c + c)}`;
  return null;
}
