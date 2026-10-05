import { useEffect, useRef, useState } from "react";

type LayoutBidwarOptionTextProps = {
  maxWidth?: number;
  text: string;
};

export const LayoutBidwarOptionText = ({
  maxWidth,
  text,
}: LayoutBidwarOptionTextProps) => {
  const [styles, setStyles] = useState<React.CSSProperties>();
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const span = spanRef.current;
    if (!span) return;
    const observer = new ResizeObserver(() => {
      const availableWidth = maxWidth ?? span.parentElement?.clientWidth ?? 0;
      const difference = span.getBoundingClientRect().width - availableWidth;
      setStyles(
        difference + 8 <= 0
          ? undefined
          : ({
              "--max-scroll-x": `-${difference + 14}px`,
            } as React.CSSProperties)
      );
    });
    observer.observe(span);
    if (span.parentElement) observer.observe(span.parentElement);
    return () => observer.disconnect();
  }, [maxWidth, text]);

  return (
    <span
      ref={spanRef}
      className="inline-block animate-scrollX whitespace-nowrap"
      style={styles}
    >
      {text}
    </span>
  );
};
