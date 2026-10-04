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
      <div className="rotate3 ml-[35px] mr-[24px] mt-[45px] text-center tabular-nums tracking-widest">
        {time}
      </div>
    </div>
  );
};
