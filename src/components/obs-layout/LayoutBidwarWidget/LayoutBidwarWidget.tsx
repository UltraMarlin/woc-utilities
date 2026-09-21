import cn from "classnames";
import { useEffect, useMemo, useState } from "react";

import { useBidwarResults } from "../../../hooks/useBidwarResults";

import { LayoutBidwarOptionText } from "./LayoutBidwarOptionText";

export type LayoutBidwarWidgetProps = {
  language: "de" | "en";
  donationGoalsText?: string;
  className?: string;
};

const TOTAL_CYCLE_DURATION = 15 * 60 * 1000;
const SINGLE_BIDWAR_DURATION = 1 * 60 * 1000;

const MAX_BIDWAR_OPTION_AMOUNT = 6;

type PreparedBidwar = {
  name: string;
  options: {
    name: string;
    amount: number;
  }[];
};

export const LayoutBidwarWidget = ({
  language,
  donationGoalsText,
  className,
}: LayoutBidwarWidgetProps) => {
  const [showBidwars, setShowBidwars] = useState(false);
  const [currentBidwarIndex, setCurrentBidwarIndex] = useState<number>(0);

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
        const difference = 10 + 26 * bidwar.options.length - 88;
        return {
          "--max-scroll-y": difference <= 0 ? "0px" : `-${difference}px`,
        };
      }),
    [preparedBidwars]
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (preparedBidwars.length === 0) return;

    const startBidwarRotation = () => {
      clearInterval(interval);
      interval = setInterval(() => {
        setCurrentBidwarIndex((prev) => {
          if (prev < preparedBidwars.length - 1) return prev + 1;
          else {
            setShowBidwars(false);
            clearInterval(interval);
            return prev;
          }
        });
      }, SINGLE_BIDWAR_DURATION);
    };

    if (showBidwars) {
      startBidwarRotation();
      return;
    }

    const timeout = setTimeout(
      () => {
        setCurrentBidwarIndex(0);
        setShowBidwars(true);
      },
      TOTAL_CYCLE_DURATION - preparedBidwars.length * SINGLE_BIDWAR_DURATION
    );

    return () => clearTimeout(timeout);
  }, [preparedBidwars.length, showBidwars]);

  return (
    <div className={className}>
      <div
        className={cn(
          "absolute flex size-full items-center justify-center px-4 text-[26px]/none font-bold transition-opacity duration-[2000ms] ease-in",
          { "opacity-0": showBidwars }
        )}
      >
        {donationGoalsText}
      </div>
      {bidwarResultsStatus === "success" &&
        currentBidwarIndex < preparedBidwars.length && (
          <div
            className={cn(
              "absolute flex size-full items-center justify-center transition-opacity duration-[2000ms] ease-in",
              { "opacity-0": !showBidwars }
            )}
          >
            <div className="relative top-0 h-full w-[44%] text-base">
              {preparedBidwars.map((bidwar, index) => (
                <span
                  key={`${bidwar.name}-${index}`}
                  className={cn(
                    "absolute left-0 flex size-full items-center justify-center px-3 transition-opacity duration-[2000ms] ease-in",
                    { "opacity-0": index !== currentBidwarIndex }
                  )}
                >
                  ! bidwar: {bidwar.name}
                </span>
              ))}
            </div>
            <div className="relative h-full w-[56%] animate-scrollY text-[15px]">
              <div className="grid w-full">
                {preparedBidwars.map((bidwar, index) => (
                  <div
                    key={`${bidwar.name}-${index}`}
                    className={cn(
                      "top-0 col-start-1 row-start-1 h-fit w-full animate-scrollY py-[5px] pl-3 pr-4 transition-opacity duration-[2000ms] ease-in",
                      { "opacity-0": index !== currentBidwarIndex }
                    )}
                    style={styleList[index]}
                  >
                    {bidwar.options.map((option, optionIndex) => (
                      <span
                        key={option.name}
                        className="relative flex h-[26px] w-full justify-between"
                      >
                        <span className="flex items-center">
                          {optionIndex + 1}.
                          <div className="no-scrollbar absolute flex h-full w-[230px] translate-x-5 items-center overflow-x-hidden text-nowrap px-2 text-left">
                            <LayoutBidwarOptionText
                              text={option.name}
                              maxWidth={236}
                            />
                          </div>
                        </span>
                        {option.amount !== null ? option.amount / 100 : null}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};
