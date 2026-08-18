import { HTMLAttributes } from "react";
import cn from "classnames";

type SmashTextProps = {
  text: string;
} & HTMLAttributes<HTMLSpanElement>;

export const SmashText = ({ text, className, ...props }: SmashTextProps) => (
  <span className={cn("font-smash-layered", className)} {...props}>
    <span className="font-smash-layered-shadow" aria-hidden="true">
      {text}
    </span>
    {text}
  </span>
);
