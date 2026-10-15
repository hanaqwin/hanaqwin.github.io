import { useRef, useState } from "react";
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import { hexToHsv, hsvToHex, parseHex } from "../../lib/color";
import type { Hsv } from "../../lib/color";
import { colorStore } from "../../lib/sketchStore";
import { Sheet } from "./Sheets";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
/** One arrow-key press on the shade square; Shift moves five times as far. */
const KEY_STEP = 0.02;

interface ColorSheetProps {
  /** The ink in the pen right now — mixing starts from there. */
  initial: string;
  onPick: (hex: string) => void;
  onCancel: () => void;
}

/**
 * Mixing any ink at all: a shade square (saturation across, brightness up),
 * a hue slider under it, and a hex box for a colour copied from elsewhere.
 * The last few mixed colours wait at the bottom, one tap each.
 */
export default function ColorSheet({ initial, onPick, onCancel }: ColorSheetProps) {
  const recent = colorStore.use();
  const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(initial));
  /** The hex box while it's being typed in, before it is a whole colour. */
  const [typed, setTyped] = useState<string | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<number | null>(null);

  const hex = hsvToHex(hsv);

  const shadeAt = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const s = clamp01((e.clientX - rect.left) / rect.width);
    const v = 1 - clamp01((e.clientY - rect.top) / rect.height);
    setHsv((prev) => ({ ...prev, s, v }));
    setTyped(null);
  };

  const onFieldDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.focus({ preventScroll: true });
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Already gone; the tap still picks a shade.
    }
    dragging.current = e.pointerId;
    shadeAt(e);
  };

  const onFieldMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragging.current === e.pointerId) shadeAt(e);
  };

  const onFieldUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragging.current === e.pointerId) dragging.current = null;
  };

  const onFieldKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? KEY_STEP * 5 : KEY_STEP;
    const move: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
    };
    const delta = move[e.key];
    if (!delta) return;
    e.preventDefault();
    setHsv((prev) => ({ ...prev, s: clamp01(prev.s + delta[0]), v: clamp01(prev.v + delta[1]) }));
    setTyped(null);
  };

  const onHexChange = (value: string) => {
    setTyped(value);
    const parsed = parseHex(value);
    if (parsed) setHsv((prev) => hexToHsv(parsed, prev.h));
  };

  /** The hue at full strength: the shade square's backdrop and the slider's thumb. */
  const pure = hsvToHex({ h: hsv.h, s: 1, v: 1 });
  const thumbStyle = {
    left: `${hsv.s * 100}%`,
    top: `${(1 - hsv.v) * 100}%`,
    background: hex,
  } as CSSProperties;

  return (
    <Sheet
      title="mix a colour"
      onCancel={onCancel}
      initialFocusRef={fieldRef}
      className="color-sheet"
    >
      <div
        className="color-sheet__field"
        ref={fieldRef}
        style={{ "--hue": pure } as CSSProperties}
        role="slider"
        tabIndex={0}
        aria-label="Shade — left and right for how vivid, up and down for how bright"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(hsv.s * 100)}
        aria-valuetext={`${Math.round(hsv.s * 100)}% vivid, ${Math.round(hsv.v * 100)}% bright`}
        onPointerDown={onFieldDown}
        onPointerMove={onFieldMove}
        onPointerUp={onFieldUp}
        onPointerCancel={onFieldUp}
        onKeyDown={onFieldKey}
      >
        <span className="color-sheet__thumb" style={thumbStyle} aria-hidden="true" />
      </div>

      <input
        className="color-sheet__hue"
        type="range"
        min={0}
        max={359}
        step={1}
        value={Math.round(hsv.h) % 360}
        onChange={(e) => {
          setHsv((prev) => ({ ...prev, h: Number(e.target.value) }));
          setTyped(null);
        }}
        aria-label="Hue"
        style={{ "--thumb": pure } as CSSProperties}
      />

      <div className="color-sheet__row">
        <span className="color-sheet__preview" style={{ "--swatch": hex } as CSSProperties}>
          <svg viewBox="0 0 120 40" aria-hidden="true">
            <path d="M8 28 C 28 4, 44 4, 58 20 S 92 38, 112 12" />
          </svg>
        </span>
        <label className="color-sheet__hex">
          <span className="visually-hidden">Hex colour</span>
          <input
            type="text"
            value={typed ?? hex}
            onChange={(e) => onHexChange(e.target.value)}
            onBlur={() => setTyped(null)}
            maxLength={7}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-invalid={typed !== null && parseHex(typed) === null}
          />
        </label>
      </div>

      {recent.length > 0 && (
        <div className="color-sheet__recent" role="group" aria-label="Colours you mixed lately">
          {recent.map((color) => (
            <button
              key={color}
              type="button"
              className="color-sheet__chip"
              style={{ "--swatch": color } as CSSProperties}
              aria-label={`Use ${color}`}
              title={color}
              onClick={() => onPick(color)}
            />
          ))}
        </div>
      )}

      <div className="sketch-sheet__actions">
        <button type="button" className="sketch-sheet__quiet" onClick={onCancel}>
          cancel
        </button>
        <button type="button" className="sketch-sheet__go" onClick={() => onPick(hex)}>
          use this
        </button>
      </div>
    </Sheet>
  );
}
