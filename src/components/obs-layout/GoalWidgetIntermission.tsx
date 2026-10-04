import { useMemo } from "react";
import cn from "classnames";

import { DonationGoal, useDonationGoals } from "../../hooks/useDonationGoals";
import { useExternalDonationTotal } from "../../hooks/useExternalDonationTotal";
import { formatEuro } from "../../utils/formatting/formatMoney";

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
        "flex h-full flex-col items-center justify-center gap-6",
        className
      )}
    >
      <div
        className={cn("text-balance text-center", {
          "text-2xl/9": donationGoalText.length <= 40,
          "text-lg": donationGoalText.length > 40,
        })}
      >
        {donationGoalText}
      </div>
      <div className="relative h-[63px] w-[576px]">
        <div className="absolute size-full overflow-hidden rounded-[32px] bg-[#2d056873]">
          <div
            className="goal-widget-overlay-progress-transition size-full bg-[length:300%_100%] bg-repeat"
            style={{
              "--goalProgress": `${targetProgress}%`,
              maskImage:
                "linear-gradient(to right, black var(--goalProgress), transparent var(--goalProgress))",
            }}
          />
        </div>
        <div className="absolute flex size-full items-center justify-center gap-1.5 text-[24px]/none font-bold">
          {formatEuro((currentDonation || 0) * 100)}
          <span>{language === "en" ? "of" : "von"}</span>
          {formatEuro((moneyTarget || 0) * 100)}
        </div>
      </div>
    </div>
  );
};
