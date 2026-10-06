import { useCallback, useLayoutEffect, useRef, useState } from "react";

const TOP_EDGE = 6;
const SLIDE_DURATION = 300;
const SLIDE_EASING = "cubic-bezier(0.5, 1, 0.89, 1)";
const POP_DURATION = 1200;

export type Pop = {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
};

const translateY = (offset: number) => `translateY(${offset}px)`;

const getTranslateY = (element: Element) =>
  new DOMMatrixReadOnly(getComputedStyle(element).transform).m42;

const getTimeToProgress = (progress: number) =>
  SLIDE_DURATION * (1 - Math.sqrt(1 - progress));

const cancelSlide = (element: Element) =>
  element.getAnimations().forEach((animation) => animation.cancel());

const slide = (element: Element, keyframes: Keyframe[]) => {
  cancelSlide(element);
  element.animate(keyframes, {
    duration: SLIDE_DURATION,
    easing: SLIDE_EASING,
  });
};

export const useMessageStack = (
  messages: { id: string }[],
  dismiss: (id: string) => void
) => {
  const listRef = useRef<HTMLUListElement>(null);
  const lastTops = useRef(new Map<string, number>());
  const stoppedIds = useRef(new Set<string>());
  const [pops, setPops] = useState<Pop[]>([]);

  const pop = useCallback(
    (popped: Pop) => {
      setPops((current) => [...current, popped]);
      setTimeout(() => {
        dismiss(popped.id);
        stoppedIds.current.delete(popped.id);
        setPops((current) => current.filter(({ id }) => id !== popped.id));
      }, POP_DURATION);
    },
    [dismiss]
  );

  useLayoutEffect(() => {
    const list = listRef.current;
    const box = list?.parentElement?.getBoundingClientRect();
    if (!list || !box) return;

    const tops = new Map<string, number>();

    messages.forEach(({ id }, index) => {
      const element = list.children[index] as HTMLElement;
      const rect = element.getBoundingClientRect();
      const currentOffset = getTranslateY(element);
      const top = rect.top - currentOffset - box.top;
      tops.set(id, top);

      const lastTop = lastTops.current.get(id);
      const offset = (lastTop ?? top) - top + currentOffset;
      const hasMoved = lastTop !== undefined && Math.abs(lastTop - top) >= 0.5;

      if (stoppedIds.current.has(id)) {
        if (hasMoved) {
          cancelSlide(element);
          element.style.transform = translateY(offset);
        }
        return;
      }

      if (top < TOP_EDGE) {
        stoppedIds.current.add(id);
        const popAt = (popTop: number) =>
          pop({
            id,
            top: popTop,
            left: rect.left - box.left,
            width: rect.width,
            height: rect.height,
          });

        if (lastTop === undefined) {
          popAt(top);
          return;
        }

        const stopOffset = TOP_EDGE - top;
        const progress = Math.max(0, 1 - stopOffset / offset);
        element.style.transform = translateY(stopOffset);
        slide(element, [
          { transform: translateY(offset) },
          { transform: translateY(stopOffset), offset: progress },
          { transform: translateY(stopOffset) },
        ]);
        setTimeout(() => popAt(TOP_EDGE), getTimeToProgress(progress));
        return;
      }

      if (hasMoved) {
        slide(element, [
          { transform: translateY(offset) },
          { transform: "none" },
        ]);
      }
    });

    lastTops.current = tops;
  }, [messages, pop]);

  return { listRef, pops };
};
