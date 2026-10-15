import { useId, useRef, useState } from "react";
import type { FormEvent, ReactNode, RefObject } from "react";
import type { DrawingData, DrawingStroke } from "../../drawings.types";
import { useDialogTrap } from "../../hooks/useDialogTrap";
import { useVisibleViewport } from "../../hooks/useVisibleViewport";
import { LIMITS, PAGE_H, PAGE_W, cleanText } from "../../lib/drawingFormat";
import type { SendFailure } from "../../lib/github";
import { SKETCH_LABEL, checkKey, sendDrawing, sketchDate, sketchRepo } from "../../lib/github";
import { looksLikeGithubKey, nameForKey } from "../../lib/sketchKeys";
import { keyStore } from "../../lib/sketchStore";
import type { SentPage } from "../../lib/sketchStore";

/** What went wrong, in words — and, whenever it's true, that the drawing is safe. */
function failureMessage(failure: SendFailure): string {
  const owner = sketchRepo?.owner ?? "the site owner";
  switch (failure.kind) {
    case "bad-key":
      return "That key doesn’t work any more — it may have expired or been cancelled.";
    case "wrong-account":
      return `That key belongs to @${failure.login}. Keys for this sketchbook have to be made on the @${owner} account.`;
    case "no-access":
      return "This key isn’t allowed to post here. It needs “Issues: Read and write” on this repo.";
    case "too-big":
      return "This page is too detailed to send in one go. Undo a few strokes and try again.";
    case "no-label":
      return `It reached GitHub as issue #${failure.issue}, but without its “${SKETCH_LABEL}” label, so it won’t be pinned up. Add the label to that issue by hand.`;
    case "offline":
      return "Couldn’t reach GitHub. Your drawing is still here — try again in a moment.";
    case "other":
      return `GitHub said no (${failure.status || "not set up"}). Your drawing is still here — try again in a bit.`;
  }
}

interface SheetProps {
  title: string;
  children: ReactNode;
  onCancel: () => void;
  initialFocusRef: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * A card that slides up over whatever is behind it — the page being drawn, or
 * the book. It runs its own focus trap; the parent stands its trap down and
 * marks itself inert while a sheet is open, so Escape and Tab belong here.
 *
 * It rides on top of the on-screen keyboard rather than under it, and stays on
 * screen however far down the book has been scrolled.
 */
export function Sheet({ title, children, onCancel, initialFocusRef, className = "" }: SheetProps) {
  const titleId = useId();
  const scrimRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  useDialogTrap(sheetRef, onCancel, initialFocusRef);
  useVisibleViewport(scrimRef);

  return (
    <div
      className="sketch-sheet-scrim"
      ref={scrimRef}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className={`sketch-sheet ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={sheetRef}
      >
        <h2 className="sketch-sheet__title" id={titleId}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

interface KeySheetProps {
  /** Called with the name the key is registered under. */
  onDone: (name: string) => void;
  onCancel: () => void;
}

/**
 * Unlocking this device — the only thing that lets it send drawings.
 *
 * Each of you pastes your own key. Its SHA-256 is looked up in
 * src/sketchbook-keys.json, which says whose it is, so nobody types a name and
 * every page is signed by the key that sent it.
 */
export function KeySheet({ onDone, onCancel }: KeySheetProps) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldId = useId();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const token = value.trim();
    if (!looksLikeGithubKey(token)) {
      setError("That doesn’t look like a sketchbook key. It starts with github_pat_.");
      return;
    }

    setBusy(true);
    const name = await nameForKey(token);
    if (!name) {
      setBusy(false);
      setError(
        "That key isn’t registered with this sketchbook yet (bun run add-key). Try again once the site has deployed with it.",
      );
      return;
    }

    const result = await checkKey(token);
    setBusy(false);
    if ("ok" in result) {
      keyStore.set({ token, name });
      onDone(name);
    } else {
      setError(failureMessage(result));
    }
  };

  return (
    <Sheet title="unlock drawing" onCancel={onCancel} initialFocusRef={inputRef}>
      <p className="sketch-sheet__lede">
        Paste your sketchbook key. It stays on this device, and you won’t be asked again here.
      </p>
      <form className="sketch-sheet__form" onSubmit={submit}>
        <div className="sketch-sheet__field">
          <label htmlFor={fieldId}>Your key</label>
          <input
            id={fieldId}
            ref={inputRef}
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="github_pat_…"
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
          />
        </div>

        {error && (
          <p className="sketch-sheet__error" role="alert">
            {error}
          </p>
        )}
        <div className="sketch-sheet__actions">
          <button type="button" className="sketch-sheet__quiet" onClick={onCancel}>
            not now
          </button>
          <button type="submit" className="sketch-sheet__go" disabled={busy}>
            {busy ? "checking…" : "unlock"}
          </button>
        </div>
      </form>
    </Sheet>
  );
}

interface SendSheetProps {
  strokes: DrawingStroke[];
  onSent: (page: SentPage) => void;
  onNeedKey: () => void;
  onCancel: () => void;
}

/** Naming the page, then sending it off to be pinned up. */
export function SendSheet({ strokes, onSent, onNeedKey, onCancel }: SendSheetProps) {
  const key = keyStore.use();
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<SendFailure | null>(null);
  const captionRef = useRef<HTMLInputElement>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!key) return;
    setBusy(true);
    setFailure(null);
    const page: DrawingData = {
      v: 1,
      width: PAGE_W,
      height: PAGE_H,
      by: key.name,
      caption: cleanText(caption, LIMITS.caption),
      strokes,
    };
    const result = await sendDrawing(key.token, page);
    setBusy(false);
    if ("ok" in result) {
      onSent({
        issue: result.issue,
        date: sketchDate(result.createdAt),
        sentAt: Date.now(),
        drawing: page,
      });
    } else {
      setFailure(result);
    }
  };

  const keyTrouble = failure?.kind === "bad-key" || failure?.kind === "wrong-account";

  return (
    <Sheet title="pin it up" onCancel={onCancel} initialFocusRef={captionRef}>
      <p className="sketch-sheet__lede">
        It goes up in the sketchbook for everyone, about a minute after you send it.
      </p>
      <form className="sketch-sheet__form" onSubmit={submit}>
        <label className="sketch-sheet__field">
          <span>Give it a name (optional)</span>
          <input
            ref={captionRef}
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="untitled"
            maxLength={LIMITS.caption}
            enterKeyHint="send"
          />
        </label>
        {key && (
          <p className="sketch-sheet__signed">
            — {key.name}{" "}
            <button type="button" className="sketch-sheet__link" onClick={onNeedKey}>
              not you?
            </button>
          </p>
        )}
        {failure && (
          <p className="sketch-sheet__error" role="alert">
            {failureMessage(failure)}
          </p>
        )}
        <div className="sketch-sheet__actions">
          <button type="button" className="sketch-sheet__quiet" onClick={onCancel}>
            keep drawing
          </button>
          {keyTrouble || !key ? (
            <button type="button" className="sketch-sheet__go" onClick={onNeedKey}>
              use another key
            </button>
          ) : (
            <button type="submit" className="sketch-sheet__go" disabled={busy}>
              {busy ? "sending…" : "send it"}
            </button>
          )}
        </div>
      </form>
    </Sheet>
  );
}
