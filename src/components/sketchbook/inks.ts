import type { DrawingTool } from "../../drawings.types";

/**
 * The pencil case. The first row is inks dark enough to write with; the second
 * is the party itself — the balloons, the cake, the envelope — a shade deeper
 * than the decorations so it still shows on white paper. Anything else is one
 * tap away in the custom picker.
 */
export const INKS = [
  { name: "Plum", hex: "#5b4660" },
  { name: "Cocoa", hex: "#7b5544" },
  { name: "Berry", hex: "#c2456b" },
  { name: "Tomato", hex: "#ef5a4c" },
  { name: "Tangerine", hex: "#f28a3c" },
  { name: "Honey", hex: "#e8b023" },
  { name: "Leaf", hex: "#4f9a6b" },
  { name: "Lagoon", hex: "#2a9d8f" },
  { name: "Ocean", hex: "#3f7cc4" },
  { name: "Grape", hex: "#8a63c9" },
  { name: "Bubblegum", hex: "#ff8fab" },
  { name: "Peach", hex: "#ffab95" },
  { name: "Butter", hex: "#ffd25e" },
  { name: "Mint", hex: "#5fccb0" },
  { name: "Sky", hex: "#7cc8f2" },
  { name: "Lilac", hex: "#b9a3f5" },
] as const;

const PRESETS: ReadonlySet<string> = new Set(INKS.map((ink) => ink.hex));

export function isPreset(hex: string): boolean {
  return PRESETS.has(hex.toLowerCase());
}

/** Fine, medium, bold — in page units, so a page looks the same on any screen. */
export const NIBS: Record<DrawingTool, readonly [number, number, number]> = {
  pen: [5, 11, 22],
  marker: [16, 30, 54],
  eraser: [18, 42, 84],
};

export const NIB_NAMES = ["Fine", "Medium", "Bold"] as const;
