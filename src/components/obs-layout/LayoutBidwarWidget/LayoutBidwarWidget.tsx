import cn from "classnames";
import { useEffect, useMemo, useRef } from "react";

import { useBidwarResults } from "../../../hooks/useBidwarResults";
import type { WidgetRotationWindow } from "../../../hooks/useWidgetRotation";

import { formatEuro } from "../../../utils/formatting/formatMoney";
import { LayoutBidwarOptionText } from "./LayoutBidwarOptionText";

export type LayoutBidwarWidgetProps = {
  language: "de" | "en";
  donationGoalsText?: string;
  activeWindow: WidgetRotationWindow | null;
  currentBidwarId?: number;
  className?: string;
};

const MAX_BIDWAR_OPTION_AMOUNT = 6;
// keep in sync with the h-[22px] rows and pt-[3px] pb-[7px] of the option list
const OPTION_ROW_HEIGHT = 22;
const OPTION_LIST_TOTAL_PADDING_Y = 3 + 7;
const OPTION_LIST_VISIBLE_HEIGHT = 76;

type PreparedBidwar = {
  id: number;
  name: string;
  options: {
    name: string;
    amount: number;
  }[];
};

export const LayoutBidwarWidget = ({
  language,
  donationGoalsText,
  activeWindow,
  currentBidwarId,
  className,
}: LayoutBidwarWidgetProps) => {
  const optionListRefs = useRef(new Map<number, HTMLDivElement>());

  const { data: bidwarResults, status: bidwarResultsStatus } =
    useBidwarResults();

  const preparedBidwars = useMemo<PreparedBidwar[]>(() => {
    const bidwars = bidwarResults?.results;
    return (
      bidwars
        ?.filter((bidwar) => bidwar.status === "active")
        ?.map((bidwar) => {
          const optionNames = Object.keys(bidwar.options);
          return {
            id: bidwar.id,
            name:
              language === "en" && bidwar.bidwar_name_en
                ? bidwar.bidwar_name_en
                : bidwar.bidwar_name,
            options: optionNames
              .map((optionName) => ({
                name: optionName,
                amount: bidwar.options[optionName],
              }))
              .sort((a, b) => b.amount - a.amount)
              .slice(0, MAX_BIDWAR_OPTION_AMOUNT),
          };
        }) || []
    );
  }, [bidwarResults, language]);

  const styleList = useMemo<React.CSSProperties[]>(
    () =>
      preparedBidwars.map((bidwar) => {
        const difference =
          OPTION_ROW_HEIGHT * bidwar.options.length +
          OPTION_LIST_TOTAL_PADDING_Y -
          OPTION_LIST_VISIBLE_HEIGHT;
        return {
          "--max-scroll-y": difference <= 0 ? "0px" : `-${difference}px`,
        };
      }),
    [preparedBidwars]
  );

  useEffect(() => {
    if (activeWindow !== "bidwars" || currentBidwarId === undefined) return;
    optionListRefs.current
      .get(currentBidwarId)
      ?.getAnimations()
      .forEach((animation) => {
        if (animation instanceof CSSAnimation) animation.currentTime = 0;
      });
  }, [activeWindow, currentBidwarId]);

  return (
    <div className={className}>
      <div
        className={cn(
          "absolute flex size-full items-center justify-center px-4 text-[26px]/none font-bold transition-opacity duration-[2000ms] ease-in",
          { "opacity-0": activeWindow !== "donationGoals" }
        )}
      >
        {donationGoalsText}
      </div>
      {bidwarResultsStatus === "success" && (
        <div
          className={cn(
            "absolute flex size-full items-stretch gap-3 pl-[14px] pr-[7px] transition-opacity duration-[2000ms] ease-in",
            { "opacity-0": activeWindow !== "bidwars" }
          )}
        >
          <div className="relative flex w-[232px] shrink-0 flex-col items-center py-1.5">
            <div className="text-[21px]/[1.15] font-bold tracking-wide">
              !bidwar
            </div>
            <div className="relative w-full grow">
              {preparedBidwars.map((bidwar) => (
                <div
                  key={bidwar.id}
                  className={cn(
                    "absolute inset-0 flex items-center justify-center text-balance text-center font-bold transition-opacity duration-[2000ms] ease-in",
                    {
                      "opacity-0": bidwar.id !== currentBidwarId,
                      "text-[19px]/[1.05]": bidwar.name.length <= 30,
                      "text-[17px]/[1.05]": bidwar.name.length > 30,
                    }
                  )}
                >
                  {bidwar.name}
                </div>
              ))}
            </div>
          </div>
          <div className="relative grid grow overflow-hidden">
            {preparedBidwars.map((bidwar, index) => (
              <div
                key={bidwar.id}
                ref={(element) => {
                  if (element) optionListRefs.current.set(bidwar.id, element);
                  return () => {
                    optionListRefs.current.delete(bidwar.id);
                  };
                }}
                className={cn(
                  "col-start-1 row-start-1 grid h-fit animate-scrollY grid-cols-[max-content_1fr_max-content] pb-[7px] pt-[3px] text-[19px] font-bold transition-opacity duration-[2000ms] ease-in",
                  { "opacity-0": bidwar.id !== currentBidwarId }
                )}
                style={styleList[index]}
              >
                {bidwar.options.map((option, optionIndex) => (
                  <div
                    key={option.name}
                    className="col-span-full grid h-[22px] grid-cols-subgrid items-center gap-x-2 px-1"
                  >
                    <span>{optionIndex + 1}.</span>
                    <span className="no-scrollbar flex overflow-x-hidden whitespace-nowrap">
                      <LayoutBidwarOptionText text={option.name} />
                    </span>
                    <span className="text-right">
                      {formatEuro(option.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
