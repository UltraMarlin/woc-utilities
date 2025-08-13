import cn from "classnames";
import { ChangeEventHandler, ReactNode, useId } from "react";

export type RangeSliderProps = {
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  children: ReactNode;
};

export const RangeSlider = ({
  className,
  min = 0,
  max = 100,
  step = 1,
  value = 50,
  onChange: onChangeFromProps,
  children,
}: RangeSliderProps) => {
  const id = useId();

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const stringValue = event.target.value;
    const numberValue = parseFloat(stringValue);
    onChangeFromProps?.(numberValue);
  };

  return (
    <label
      className={cn("flex flex-col items-start gap-2", className)}
      htmlFor={id}
    >
      {children} ({value})
      <input
        id={id}
        className="w-full"
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={onChange}
      />
    </label>
  );
};
