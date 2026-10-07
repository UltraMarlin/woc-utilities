import { useEffect, useState } from "react";

import {
  GOAL_FADE_TRANSITION_MS,
  GOAL_FILL_TRANSITION_MS,
} from "../components/obs-layout/GoalWaveFill";
import { DonationGoal, useDonationGoals } from "./useDonationGoals";
import { useExternalDonationTotal } from "./useExternalDonationTotal";

export type GoalBar = {
  floor: number;
  progress: number;
  announcing?: DonationGoal;
  fadedOut?: boolean;
};

type GoalStep = { bar: GoalBar; holdMs: number };

const percent = (amount: number, from: number, to: number) =>
  Math.min(100, ((amount - from) * 100) / (to - from));

const getGoalAbove = (goals: DonationGoal[], amount: number) =>
  goals.find((goal) => goal.reached_at > amount);

export const getInitialBar = (
  goals: DonationGoal[],
  amount: number
): GoalBar => {
  const floor = goals.reduce(
    (floor, goal) => (goal.reached_at <= amount ? goal.reached_at : floor),
    0
  );
  const goal = getGoalAbove(goals, floor);
  return {
    floor,
    progress: goal
      ? percent(amount, floor, goal.reached_at)
      : goals.length > 0
        ? 100
        : 0,
  };
};

export const getNextStep = (
  bar: GoalBar,
  goals: DonationGoal[],
  amount: number,
  announceMs: number
): GoalStep | undefined => {
  if (amount < bar.floor || goals.length === 0) {
    const reset = getInitialBar(goals, amount);
    const unchanged =
      reset.floor === bar.floor &&
      reset.progress === bar.progress &&
      !bar.announcing &&
      !bar.fadedOut;

    if (unchanged) return;

    return { bar: reset, holdMs: GOAL_FILL_TRANSITION_MS };
  }

  if (bar.announcing) {
    const floor = bar.announcing.reached_at;
    return getGoalAbove(goals, floor)
      ? {
          bar: { floor, progress: 100, fadedOut: true },
          holdMs: GOAL_FADE_TRANSITION_MS,
        }
      : { bar: { floor, progress: 100 }, holdMs: 0 };
  }

  if (bar.fadedOut && bar.progress > 0)
    return {
      bar: { floor: bar.floor, progress: 0, fadedOut: true },
      holdMs: 0,
    };

  const goal = getGoalAbove(goals, bar.floor);
  if (!goal)
    return bar.fadedOut
      ? {
          bar: { floor: bar.floor, progress: 100 },
          holdMs: GOAL_FILL_TRANSITION_MS,
        }
      : undefined;

  const reached = amount >= goal.reached_at;
  const progress = reached ? 100 : percent(amount, bar.floor, goal.reached_at);

  if (progress !== bar.progress || bar.fadedOut)
    return {
      bar: { floor: bar.floor, progress },
      holdMs: GOAL_FILL_TRANSITION_MS,
    };

  if (reached) return { bar: { ...bar, announcing: goal }, holdMs: announceMs };
};

export const useAnimatedGoalBar = (
  language: "de" | "en",
  announceMs: number
) => {
  const { data: donations, status: donationsStatus } =
    useExternalDonationTotal();

  const { data: donationGoals, status: donationGoalsStatus } =
    useDonationGoals(language);

  const currentDonation = donations
    ? donations.donated_amount_in_cents / 100
    : undefined;

  const [step, setStep] = useState<GoalStep>();
  const [heldStep, setHeldStep] = useState<GoalStep>();

  if (donationGoals && typeof currentDonation !== "undefined") {
    if (!step) {
      setStep({
        bar: getInitialBar(donationGoals, currentDonation),
        holdMs: 0,
      });
    } else if (heldStep === step) {
      const next = getNextStep(
        step.bar,
        donationGoals,
        currentDonation,
        announceMs
      );
      if (next) setStep(next);
    }
  }

  useEffect(() => {
    if (!step) return;
    let frame = 0;
    const timeout = setTimeout(() => {
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => setHeldStep(step));
      });
    }, step.holdMs);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [step]);

  const bar = step?.bar;

  const barGoal =
    bar && donationGoals && getGoalAbove(donationGoals, bar.floor);

  const moneyTarget =
    barGoal?.reached_at ??
    donationGoals?.[donationGoals.length - 1]?.reached_at;

  const getDonationGoalText = () => {
    if (barGoal) return barGoal.name;
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

  return {
    progress: bar?.progress ?? 0,
    fadedOut: bar?.fadedOut ?? false,
    announcingGoal: bar?.announcing,
    currentDonation: currentDonation ?? 0,
    moneyTarget: moneyTarget ?? 0,
    donationGoalText: getDonationGoalText(),
  };
};
