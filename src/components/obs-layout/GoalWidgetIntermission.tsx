import { useMemo } from "react";
import cn from "classnames";

import { DonationGoal, useDonationGoals } from "../../hooks/useDonationGoals";
import { useExternalDonationTotal } from "../../hooks/useExternalDonationTotal";
import { formatEuro } from "../../utils/formatting/formatMoney";
import { GoalWaveFill } from "./GoalWaveFill";

import donationBar from "../../assets/layout/donation-bar.png";

export type GoalWidgetProps = {
  language?: "de" | "en";
  className?: string;
};

const getHighestDonationGoalAmount = (goals: DonationGoal[] | undefined) => {
  if (!goals || goals.length === 0) return undefined;
  return goals[goals.length - 1].reached_at;
};

export const GoalWidgetIntermission = ({
  language = "de",
  className,
}: GoalWidgetProps) => {
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

  const donationGoalText = getDonationGoalsText();
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
            <GoalWaveFill progress={targetProgress} />
          </div>
        </div>
        <img className="absolute" src={donationBar} alt="" />
        <div className="absolute flex size-full items-center justify-center gap-1.5 text-[30px]/none font-bold text-purpleAccent26">
          {formatEuro((currentDonation || 0) * 100)}
          <span>{language === "en" ? "of" : "von"}</span>
          {formatEuro((moneyTarget || 0) * 100, true)}
        </div>
      </div>
    </div>
  );
};
