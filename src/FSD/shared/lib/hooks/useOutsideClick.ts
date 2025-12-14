import React from "react";

interface UseOutsideClickOptions {
  enabled?: boolean;
  stopPropagation?: boolean;
  ref: React.RefObject<HTMLElement | null>;
  /** Must be memoized! */
  handler: () => void;
}

function getListener(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void,
  event: MouseEvent | TouchEvent,
  stopPropagation?: boolean
): void {
  if (stopPropagation) {
    event.stopPropagation();
  }
  const el = ref?.current;

  if (!el || el.contains(event.target as Node)) {
    return;
  }

  handler();
}

function cleanUpListeners(listener: (localEvent: MouseEvent | TouchEvent) => void) {
  document.removeEventListener("mousedown", listener);
  document.removeEventListener("touchstart", listener);
}

export function useOutsideClick({ ref, handler, enabled = true, stopPropagation }: UseOutsideClickOptions): void {
  React.useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const listener = (localEvent: MouseEvent | TouchEvent) => getListener(ref, handler, localEvent, stopPropagation);

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => cleanUpListeners(listener);
  }, [ref, handler, enabled, stopPropagation]);
}
