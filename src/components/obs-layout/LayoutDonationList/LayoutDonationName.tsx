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
  const formattedName = name || (language === "en" ? "Anonymous" : "Anonym");

  const [isAnimating, setIsAnimating] = useState(animate);
  const [visibleName, setVisibleName] = useState({
    name: animate ? "" : formattedName,
  });
  const [animatedInput, setAnimatedInput] = useState({
    animate,
    formattedName,
  });
  const animationIntervalId = useRef<ReturnType<typeof setInterval>>(undefined);
  const animationTimeoutId = useRef<ReturnType<typeof setInterval>>(undefined);

  if (
    animatedInput.animate !== animate ||
    animatedInput.formattedName !== formattedName
  ) {
    setAnimatedInput({ animate, formattedName });
    setVisibleName({ name: animate ? "" : formattedName });
    setIsAnimating(animate);
  }

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
        "mb-1 flex max-w-[234px] items-center overflow-x-clip border-current pl-2 pr-0.5 leading-none",
        {
          "animate-blink": isAnimating,
        }
      )}
    >
      {visibleName.name}
    </div>
  );
};
