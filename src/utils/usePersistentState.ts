import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const WRITE_THROTTLE_MS = 500;

const readStoredValue = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return defaultValue;
    const parsed: unknown = JSON.parse(stored);
    return typeof parsed === typeof defaultValue ? (parsed as T) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const usePersistentState = <T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() =>
    readStoredValue(key, defaultValue)
  );
  const pendingRef = useRef<{ key: string; value: T } | null>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  const flush = useCallback(() => {
    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    const pending = pendingRef.current;
    if (!pending) return;
    pendingRef.current = null;
    try {
      localStorage.setItem(pending.key, JSON.stringify(pending.value));
    } catch {
      console.warn("Failed to persist state to local storage.");
    }
  }, []);

  const isInitialValueRef = useRef(true);
  useEffect(() => {
    if (isInitialValueRef.current) {
      isInitialValueRef.current = false;
      return;
    }
    pendingRef.current = { key, value };
    if (timeoutRef.current === undefined) {
      timeoutRef.current = window.setTimeout(flush, WRITE_THROTTLE_MS);
    }
  }, [key, value, flush]);

  return [value, setValue];
};
