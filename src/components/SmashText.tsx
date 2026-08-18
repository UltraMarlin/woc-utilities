import { HTMLAttributes } from "react";
import cn from "classnames";

type SmashTextProps = {
  text: string;
} & HTMLAttributes<HTMLSpanElement>;

export const SmashText = ({ text, className, ...props }: SmashTextProps) => (
  <div className={cn("font-smash-layered", className)} {...props}>
    <div className="font-smash-layered-shadow" aria-hidden="true">
      {text}
    </div>
    {text}
  </div>
);
