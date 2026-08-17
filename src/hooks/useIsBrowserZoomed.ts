import { useSyncExternalStore } from "react";

const subscribe = (callback: () => void) => {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
};

const getSnapshot = () => window.devicePixelRatio !== 1;

export const useIsBrowserZoomed = () =>
  useSyncExternalStore(subscribe, getSnapshot);
