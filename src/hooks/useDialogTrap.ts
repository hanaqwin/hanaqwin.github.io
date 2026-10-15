import { useEffect } from "react";
import type { RefObject } from "react";

const FOCUSABLE =
  'button:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex="-1"])';

/**
 * The keyboard contract every sketchbook overlay shares: focus something
 * sensible on open, close on Escape, and cycle Tab inside the container instead
 * of escaping into the party behind it.
 *
 * `active: false` stands the trap down while something on top of it — a sheet
 * — runs a trap of its own; otherwise Escape would close both.
 */
export function useDialogTrap(
  containerRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  initialFocusRef?: RefObject<HTMLElement | null>,
  active = true,
): void {
  useEffect(() => {
    if (!active) return;

    // preventScroll: the overlay is still animating in, and letting focus scroll
    // its button into view would jump the page.
    initialFocusRef?.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !containerRef.current) return;

      const focusable = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [containerRef, onClose, initialFocusRef, active]);
}
