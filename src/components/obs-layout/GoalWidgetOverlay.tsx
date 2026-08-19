import { useEffect, useMemo, useRef, useState } from "react";
import cn from "classnames";

import { DonationGoal, useDonationGoals } from "../../hooks/useDonationGoals";
import { useExternalDonationTotal } from "../../hooks/useExternalDonationTotal";
import { customConfetti } from "../../utils/widgets/confettiEffect";

export type GoalWidgetOverlayProps = {
  language: "de" | "en";
  onDonationTextChange?: (donationGoalText: string) => void;
  onGoalReachedTextChange?: (announcingName: string | undefined) => void;
  className?: string;
};

const getHighestDonationGoalAmount = (goals: DonationGoal[] | undefined) => {
  if (!goals || goals.length === 0) return undefined;
  return goals[goals.length - 1].reached_at;
};

export const GoalWidgetOverlay = ({
  language,
  onDonationTextChange,
  onGoalReachedTextChange,
  className,
}: GoalWidgetOverlayProps) => {
  const [announcingGoalReached, setAnnouncingGoalReached] = useState(false);

  const skipReachedQueue = useRef<boolean>(true);
  const goalReachedQueue = useRef<DonationGoal[]>([]);
  const alreadyQueuedIds = useRef<number[]>([]);

  const { data: donations, status: donationsStatus } =
    useExternalDonationTotal();

  const { data: donationGoals, status: donationGoalsStatus } =
    useDonationGoals(language);

  const { currentDonation, lastReachedGoalAmount, nextDonationGoalEntry } =
    useMemo(() => {
      if (!donations || !donationGoals)
        return {
          currentDonation: 0,
          lastReachedGoalAmount: 0,
          nextDonationGoalEntry: undefined,
        };

      const current = donations.donated_amount_in_cents / 100;

      let lastIndex = -1;
      donationGoals.forEach((goal, index) => {
        if (goal.reached_at <= current) {
          lastIndex = index;
        }
      });

      return {
        currentDonation: current,
        lastReachedGoalAmount:
          lastIndex >= 0 ? donationGoals[lastIndex].reached_at : 0,
        nextDonationGoalEntry: donationGoals[lastIndex + 1],
      };
    }, [donations, donationGoals]);

  const nextDonationGoal = nextDonationGoalEntry?.reached_at;
  const nextDonationGoalText = nextDonationGoalEntry?.name;

  const moneyTarget =
    nextDonationGoal || getHighestDonationGoalAmount(donationGoals);

  const targetProgress =
    moneyTarget && moneyTarget - lastReachedGoalAmount !== 0
      ? ((currentDonation - lastReachedGoalAmount) * 100) /
        (moneyTarget - lastReachedGoalAmount)
      : 0;

  useEffect(() => {
    const getDonationGoalsText = () => {
      if (typeof nextDonationGoal !== "undefined")
        return nextDonationGoalText || "";
      if (donationsStatus !== "success" || donationGoalsStatus !== "success")
        return "";
      return donationGoals && donationGoals.length > 0
        ? language === "en"
          ? "All goals have been met!"
          : "Alle Goals wurden erreicht!"
        : language === "en"
          ? "Currently there are no goals!"
          : "Es gibt aktuell keine Goals!";
    };

    setTimeout(() => onDonationTextChange?.(getDonationGoalsText()), 2000);
  }, [
    donationGoals,
    donationGoalsStatus,
    donationsStatus,
    language,
    nextDonationGoal,
    nextDonationGoalText,
    onDonationTextChange,
  ]);

  useEffect(() => {
    if (
      !donationGoals ||
      donationGoalsStatus !== "success" ||
      typeof donations === "undefined" ||
      donations === null ||
      donationsStatus !== "success"
    )
      return;

    const current = donations.donated_amount_in_cents / 100;

    if (skipReachedQueue.current) {
      donationGoals.forEach((goal) => {
        if (goal.reached_at <= current) alreadyQueuedIds.current.push(goal.id);
      });

      skipReachedQueue.current = false;
      return;
    }

    donationGoals.forEach((goal) => {
      if (
        goal.reached_at <= current &&
        !alreadyQueuedIds.current.some((id) => id === goal.id)
      )
        goalReachedQueue.current.unshift(goal);
    });

    if (goalReachedQueue.current.length > 0) {
      setTimeout(() => setAnnouncingGoalReached(true), 1000);
    }
  }, [donationGoals, donationGoalsStatus, donations, donationsStatus]);

  useEffect(() => {
    if (skipReachedQueue.current) return;
    if (!announcingGoalReached) {
      if (goalReachedQueue.current.length > 0) {
        setAnnouncingGoalReached(true);
        return;
      }
    }

    const currentGoalReached = goalReachedQueue.current.pop();
    alreadyQueuedIds.current.push(currentGoalReached?.id || -1);
    if (!currentGoalReached) return;
    const { name } = currentGoalReached;

    onGoalReachedTextChange?.(name);
    void customConfetti();

    const timeout = setTimeout(() => {
      setAnnouncingGoalReached(false);
      onGoalReachedTextChange?.(undefined);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [announcingGoalReached, onGoalReachedTextChange]);

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="relative mx-4 mt-auto h-10 overflow-hidden rounded-[18px]">
        <div
          className={cn(
            "goal-widget-overlay-progress-transition absolute size-full animate-bgGoalsWidgetOverlay bg-[length:200%_100%] bg-repeat"
          )}
          style={{
            "--goalProgress": `${targetProgress}%`,
            maskImage:
              "linear-gradient(to right, black var(--goalProgress), transparent var(--goalProgress))",
          }}
        />
        <div className="absolute flex size-full items-center justify-center gap-2.5 pb-px text-[19px]">
          {currentDonation || 0}
          <span>{language === "en" ? "of" : "von"}</span>
          {moneyTarget}
        </div>
      </div>
    </div>
  );
};
