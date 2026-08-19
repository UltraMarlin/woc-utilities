import { HTMLAttributes } from "react";
import cn from "classnames";

type SmashTextProps = {
  text: string;
  shadowClassName?: string;
} & HTMLAttributes<HTMLSpanElement>;

export const SmashText = ({
  text,
  shadowClassName,
  className,
  ...props
}: SmashTextProps) => (
  <div
    className={cn(
      "font-smash-layered text-white smash-shadow-purpleShadow26",
      className
    )}
    {...props}
  >
    <div
      className={cn("font-smash-layered-shadow", shadowClassName)}
      aria-hidden="true"
    >
      {text}
    </div>
    {text}
  </div>
);
