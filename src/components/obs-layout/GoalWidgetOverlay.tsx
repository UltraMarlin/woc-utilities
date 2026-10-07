import { useEffect } from "react";
import cn from "classnames";

import { useAnimatedGoalBar } from "../../hooks/useAnimatedGoalBar";
import { customConfetti } from "../../utils/widgets/confettiEffect";
import { formatEuro } from "../../utils/formatting/formatMoney";
import { GoalWaveFill } from "./GoalWaveFill";

const GOAL_REACHED_ANNOUNCE_MS = 10000;

export type GoalWidgetOverlayProps = {
  language: "de" | "en";
  onDonationTextChange?: (donationGoalText: string) => void;
  onGoalReachedTextChange?: (announcingName: string | undefined) => void;
  className?: string;
  theme?: "dark" | "light";
};

export const GoalWidgetOverlay = ({
  language,
  onDonationTextChange,
  onGoalReachedTextChange,
  className,
  theme,
}: GoalWidgetOverlayProps) => {
  const {
    progress,
    fadedOut,
    announcingGoal,
    currentDonation,
    moneyTarget,
    donationGoalText,
  } = useAnimatedGoalBar(language, GOAL_REACHED_ANNOUNCE_MS);

  useEffect(() => {
    onDonationTextChange?.(donationGoalText);
  }, [donationGoalText, onDonationTextChange]);

  useEffect(() => {
    onGoalReachedTextChange?.(announcingGoal?.name);
    if (announcingGoal) void customConfetti();
  }, [announcingGoal, onGoalReachedTextChange]);

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="relative mt-auto h-9 overflow-hidden rounded-[18px]">
        <GoalWaveFill
          progress={progress}
          fadedOut={fadedOut}
          className="absolute"
          theme={theme}
        />
        <div className="absolute flex size-full items-center justify-center gap-1.5 text-[24px]/none font-bold">
          {formatEuro(currentDonation * 100)}
          <span>{language === "en" ? "of" : "von"}</span>
          {formatEuro(moneyTarget * 100)}
        </div>
      </div>
    </div>
  );
};
