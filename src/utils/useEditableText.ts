import {
  FocusEventHandler,
  InputEventHandler,
  KeyboardEventHandler,
  RefCallback,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

type EditableTextProps = {
  ref: RefCallback<HTMLElement>;
  contentEditable?: "plaintext-only";
  suppressContentEditableWarning?: boolean;
  spellCheck?: boolean;
  onInput?: InputEventHandler<HTMLElement>;
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
  onFocus?: FocusEventHandler<HTMLElement>;
  onBlur?: FocusEventHandler<HTMLElement>;
  onPointerDownCapture?: () => void;
};

const POINTER_FOCUS_WINDOW_MS = 500;

export const setCaretToEnd = (element: HTMLElement) => {
  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
};

export const useEditableText = (
  value: string,
  onChange?: (value: string) => void,
  extraRef?: RefCallback<HTMLElement>
): EditableTextProps => {
  const elementRef = useRef<HTMLElement | null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const enabled = !!onChange;

  const pointerDownAtRef = useRef(0);

  const ref = useCallback<RefCallback<HTMLElement>>(
    (element) => {
      elementRef.current = element;
      const cleanup = extraRef?.(element);
      return () => {
        elementRef.current = null;
        cleanup?.();
      };
    },
    [extraRef]
  );

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!enabled || !element) return;
    if (element === document.activeElement) return;
    if (element.textContent === value) return;
    element.textContent = value;
  }, [value, enabled]);

  if (!enabled) return { ref };

  return {
    ref,
    contentEditable: "plaintext-only",
    suppressContentEditableWarning: true,
    spellCheck: false,
    onInput: (event) =>
      onChangeRef.current?.(
        (event.currentTarget.textContent ?? "").replace(/\s*\n\s*/g, " ")
      ),
    onKeyDown: (event) => {
      if (event.key === "Enter" || event.key === "Escape") {
        event.preventDefault();
        event.currentTarget.blur();
      }
    },
    onPointerDownCapture: () => {
      pointerDownAtRef.current = Date.now();
    },
    onFocus: (event) => {
      if (Date.now() - pointerDownAtRef.current < POINTER_FOCUS_WINDOW_MS)
        return;
      setCaretToEnd(event.currentTarget);
    },
    onBlur: (event) => {
      event.currentTarget.textContent = value;
    },
  };
};
