import { useEffect, useState } from "react";
import cn from "classnames";

import { SmashText } from "../SmashText";
import { formatEuro } from "../../utils/formatting/formatMoney";
import { getAlertGifFromDonationAmount } from "../../utils/widgets/donationAlertGifs";
import { getAlertTimingFromDonationAmount } from "../../utils/widgets/donationAlertTiers";

import alertBackground from "../../assets/layout/donation_alert/alert-background.png";
import dynamicBox from "../../assets/layout/obs-overlay-dynamic-box.png";

export type DonationAlertProps = {
  name?: string | null;
  amount?: number | null;
  comment?: string | null;
  language: "de" | "en";
  active: boolean;
  theme?: "light" | "dark";
};

enum BubbleState {
  HIDDEN = "hidden",
  VISIBLE = "visible",
  HIDING = "hiding",
}

const BUBBLE_TRANSITION_DURATION = 1000;
const BUBBLE_EDGE_SOFTNESS = 10;

const BUBBLE_REVEAL: Record<BubbleState, { start: string; end: string }> = {
  [BubbleState.HIDDEN]: { start: "0%", end: "0%" },
  [BubbleState.VISIBLE]: {
    start: "0%",
    end: `${100 + BUBBLE_EDGE_SOFTNESS}%`,
  },
  [BubbleState.HIDING]: {
    start: `${100 + BUBBLE_EDGE_SOFTNESS}%`,
    end: `${100 + BUBBLE_EDGE_SOFTNESS}%`,
  },
};

const BUBBLE_MASK = `conic-gradient(from 90deg at 322px 239px, transparent calc(100% - var(--bubbleRevealEnd)), black calc(100% - var(--bubbleRevealEnd) + ${BUBBLE_EDGE_SOFTNESS}%), black calc(100% - var(--bubbleRevealStart)), transparent calc(100% - var(--bubbleRevealStart) + ${BUBBLE_EDGE_SOFTNESS}%))`;

const getDonationCommentFontSize = (comment: string | null | undefined) => {
  if (!comment) return 30;
  if (comment.length < 40) return 28;
  if (comment.length < 80) return 26;
  if (comment.length < 120) return 24;
  return 22;
};

export const DonationAlert = ({
  name,
  amount,
  comment,
  language,
  active,
  theme = "light",
}: DonationAlertProps) => {
  const [bubbleState, setBubbleState] = useState(BubbleState.HIDDEN);

  useEffect(() => {
    if (!active) return;

    const { bubblesIn, bubblesOut } = getAlertTimingFromDonationAmount(amount);

    const resetTimeout = setTimeout(() => setBubbleState(BubbleState.HIDDEN));
    const inTimeout = setTimeout(
      () => setBubbleState(BubbleState.VISIBLE),
      Math.max(bubblesIn, 50)
    );
    const outTimeout = setTimeout(
      () => setBubbleState(BubbleState.HIDING),
      bubblesOut
    );

    return () => {
      clearTimeout(resetTimeout);
      clearTimeout(inTimeout);
      clearTimeout(outTimeout);
      setBubbleState((state) =>
        state === BubbleState.VISIBLE ? BubbleState.HIDING : state
      );
    };
  }, [active, amount]);

  const bubbleReveal = BUBBLE_REVEAL[bubbleState];
  const bubbleStyle = {
    "--bubbleRevealStart": bubbleReveal.start,
    "--bubbleRevealEnd": bubbleReveal.end,
    transitionDuration:
      bubbleState === BubbleState.HIDDEN
        ? "0ms"
        : `${BUBBLE_TRANSITION_DURATION}ms`,
  };
  const gifSrc = getAlertGifFromDonationAmount(amount);
  const commentFontSize = getDonationCommentFontSize(comment);
  const headline = `${name || (language === "en" ? "Anonymous" : "Anonym")} ${
    language === "en" ? "donates" : "spendet"
  } ${formatEuro(amount)}`;

  return (
    <div
      className={cn("relative h-[752px] w-[706px] font-exo", {
        "text-white": theme === "dark",
        "text-purpleAccent26": theme === "light",
      })}
    >
      <img
        className="donation-alert-bubble-transition absolute left-0 top-[256px] h-[496px] w-[706px]"
        src={alertBackground}
        alt=""
        style={{ ...bubbleStyle, maskImage: BUBBLE_MASK }}
      />
      <div className="absolute left-[62px] top-[360px] h-[270px] w-[520px]">
        <div
          className={cn("absolute inset-[3px] rounded-[16px]", {
            "bg-yellow26": theme === "light",
            "bg-purpleDark26": theme === "dark",
          })}
        />
        <img className="absolute inset-0 size-full" src={dynamicBox} alt="" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-9 py-6 text-center">
          <SmashText
            className="break-words text-[36px]/[1.1] tracking-wider"
            shadowClassName="!top-[1px]"
            text={headline}
          />
          {comment && (
            <div
              className="font-semibold leading-[110%]"
              style={{ fontSize: `${commentFontSize}px` }}
            >
              &quot;
              {comment.length > 170 ? `${comment.slice(0, 167)}...` : comment}
              &quot;
            </div>
          )}
        </div>
      </div>
      <img
        className="absolute left-[130px] top-0 size-96 object-contain object-bottom"
        src={gifSrc}
        alt=""
      />
    </div>
  );
};
