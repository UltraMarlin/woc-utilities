import cn from "classnames";

import indicator from "../../assets/layout/intermission-indicator.png";

type IntermissionIndicatorProps = {
  className?: string;
  active?: boolean;
};
export const IntermissionIndicator = ({
  className,
  active = false,
}: IntermissionIndicatorProps) => {
  return (
    <img
      className={cn(
        "transition-[filter] duration-[800ms]",
        { "grayscale-[0.8]": !active },
        className
      )}
      src={indicator}
      alt=""
    />
  );
};
