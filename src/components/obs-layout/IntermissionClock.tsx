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
    <div className={cn("flex w-[90px] flex-col items-center", className)}>
      <div className="text-[22px]">{time}</div>
      <div className="pb-0.5 text-[16px]/5">UTC+2</div>
    </div>
  );
};
