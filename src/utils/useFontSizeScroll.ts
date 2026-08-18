import { useCallback, useEffect, useRef } from "react";

const SHIFT_STEP = 10;
const ALT_STEP = 1;
const DEFAULT_STEP = 4;

export const useFontSizeScroll = (onScroll?: (delta: number) => void) => {
  const onScrollRef = useRef(onScroll);
  useEffect(() => {
    onScrollRef.current = onScroll;
  }, [onScroll]);

  const enabled = !!onScroll;

  return useCallback(
    (element: HTMLElement | null) => {
      if (!element || !enabled) return;

      const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        const step = event.shiftKey
          ? SHIFT_STEP
          : event.altKey
            ? ALT_STEP
            : DEFAULT_STEP;
        onScrollRef.current?.(event.deltaY < 0 ? step : -step);
      };

      const handleAltKey = (event: KeyboardEvent) => {
        if (event.key === "Alt") event.preventDefault();
      };
      const addAltKeyListeners = () => {
        window.addEventListener("keydown", handleAltKey);
        window.addEventListener("keyup", handleAltKey);
      };
      const removeAltKeyListeners = () => {
        window.removeEventListener("keydown", handleAltKey);
        window.removeEventListener("keyup", handleAltKey);
      };

      element.addEventListener("wheel", handleWheel, { passive: false });
      element.addEventListener("pointerenter", addAltKeyListeners);
      element.addEventListener("pointerleave", removeAltKeyListeners);
      return () => {
        element.removeEventListener("wheel", handleWheel);
        element.removeEventListener("pointerenter", addAltKeyListeners);
        element.removeEventListener("pointerleave", removeAltKeyListeners);
        removeAltKeyListeners();
      };
    },
    [enabled]
  );
};
