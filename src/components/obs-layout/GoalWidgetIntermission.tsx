import cn from "classnames";

import { useAnimatedGoalBar } from "../../hooks/useAnimatedGoalBar";
import { formatEuro } from "../../utils/formatting/formatMoney";
import { GoalWaveFill } from "./GoalWaveFill";

import donationBar from "../../assets/layout/donation-bar.png";

export type GoalWidgetProps = {
  language?: "de" | "en";
  className?: string;
};

const GOAL_REACHED_PAUSE_MS = 1000;

export const GoalWidgetIntermission = ({
  language = "de",
  className,
}: GoalWidgetProps) => {
  const { progress, fadedOut, currentDonation, moneyTarget, donationGoalText } =
    useAnimatedGoalBar(language, GOAL_REACHED_PAUSE_MS);

  return (
    <div
      className={cn(
        "absolute mt-1 flex h-full flex-col justify-center gap-6 px-4",
        className
      )}
    >
      <div
        className={cn(
          "flex h-[120px] w-full items-center justify-center text-balance rounded-lg bg-gradient-to-b from-purpleAccent26 to-purpleLight26 px-4 text-center font-semibold tracking-wide",
          {
            "text-[32px]/[1.05]": donationGoalText.length <= 80,
            "text-[26px]/[1.2]": donationGoalText.length > 80,
          }
        )}
      >
        {donationGoalText}
      </div>
      <div className="relative h-[49px] w-[695px]">
        <div className="absolute flex size-full items-stretch p-1.5">
          <div className="w-full overflow-hidden rounded-full">
            <GoalWaveFill
              progress={progress}
              fadedOut={fadedOut}
              theme="light"
            />
          </div>
        </div>
        <img className="absolute" src={donationBar} alt="" />
        <div className="absolute flex size-full items-center justify-center gap-1.5 text-[30px]/none font-bold text-purpleAccent26">
          {formatEuro(currentDonation * 100)}
          <span>{language === "en" ? "of" : "von"}</span>
          {formatEuro(moneyTarget * 100, true)}
        </div>
      </div>
    </div>
  );
};
