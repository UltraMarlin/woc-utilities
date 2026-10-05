import cn from "classnames";

const WAVE_EDGE_MASK = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="47"><path d="M0 0H6Q12 11.75 6 23.5Q0 35.25 6 47H0Z"/></svg>'
)}`;

export type GoalWaveFillProps = {
  progress: number;
  theme?: "dark" | "light";
  className?: string;
};

export const GoalWaveFill = ({
  progress,
  theme = "light",
  className,
}: GoalWaveFillProps) => (
  <div
    className={cn(
      "goal-widget-overlay-progress-transition h-full animate-goalWave bg-gradient-to-t",
      {
        "from-[#74fee4] via-[#72dcd4] via-60% to-[#6c86ac]": theme === "light",
        "from-[#31a9b8] via-[#307f95] via-60% to-[#304c8d]": theme === "dark",
      },
      className
    )}
    style={{
      "--goalProgress": `${progress}%`,
      width: "calc(100% + 12px)",
      transform: "translateX(calc(var(--goalProgress) - 100%))",
      maskImage: `linear-gradient(black, black), url("${WAVE_EDGE_MASK}")`,
      maskSize: "calc(100% - 9px) 100%, 12px 47px",
      maskPosition: "0 0, 100% 0",
      maskRepeat: "no-repeat, repeat-y",
    }}
  />
);
