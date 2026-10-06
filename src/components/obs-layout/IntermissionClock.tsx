import cn from "classnames";
import { useEffect, useState } from "react";
import { germanTimeFormatter } from "../../utils/formatting/time";

type IntermissionClockProps = {
  className?: string;
};

const UPDATE_RATE = 1000;

export const IntermissionClock = ({ className }: IntermissionClockProps) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setTime(germanTimeFormatter.format(date));
    };

    updateTime();
    const interval = setInterval(updateTime, UPDATE_RATE);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("font-smash text-[58px]/none", className)}>
      <div className="mt-[45px] text-center">
        {time.split("").map((char, i) =>
          char === ":" ? (
            <span
              key={i}
              className="ml-1 inline-block w-[0.4em] animate-[colonBlink_2s_step-end_infinite]"
            >
              :
            </span>
          ) : (
            <span key={i} className="inline-block w-[0.78em]">
              {char}
            </span>
          )
        )}
      </div>
    </div>
  );
};
