import cn from "classnames";
import { useEffect, useRef, useState } from "react";

export type LayoutDonationNameProps = {
  name: string | null;
  animate: boolean;
  language: "de" | "en";
};

export const LayoutDonationName = ({
  name,
  animate,
  language,
}: LayoutDonationNameProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [visibleName, setVisibleName] = useState({ name: "" });
  const animationIntervalId = useRef<ReturnType<typeof setInterval>>(undefined);
  const animationTimeoutId = useRef<ReturnType<typeof setInterval>>(undefined);

  const formattedName = name || (language === "en" ? "Anonymous" : "Anonym");

  useEffect(() => {
    if (animate) {
      setVisibleName({ name: "" });
    } else {
      setVisibleName({ name: formattedName });
    }
    setIsAnimating(animate);
  }, [animate, formattedName, language]);

  useEffect(() => {
    if (isAnimating) {
      animationIntervalId.current = setInterval(() => {
        if (visibleName.name === formattedName) {
          animationTimeoutId.current = setTimeout(
            () => setIsAnimating(false),
            (4 - (formattedName.length % 4)) * 250
          );
        } else
          setVisibleName((prev) => {
            if (!formattedName.startsWith(prev.name)) return { name: "" };
            return { name: prev.name + formattedName[prev.name.length] };
          });
      }, 249);
    }

    return () => {
      clearInterval(animationIntervalId.current);
      clearTimeout(animationTimeoutId.current);
    };
  }, [isAnimating, formattedName, visibleName]);

  return (
    <div
      className={cn(
        "flex h-5 max-w-[234px] items-center overflow-x-clip border-current pl-2 pt-1.5 tracking-[-0.06em]",
        {
          "animate-blink": isAnimating,
        }
      )}
    >
      {visibleName.name}
    </div>
  );
};
