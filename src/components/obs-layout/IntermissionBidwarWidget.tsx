import cn from "classnames";
import { useEffect, useMemo, useState } from "react";
import { useBidwarResults } from "../../hooks/useBidwarResults";

import { formatEuro } from "../../utils/formatting/formatMoney";
import { LayoutBidwarOptionText } from "./LayoutBidwarWidget/LayoutBidwarOptionText";

export type IntermissionBidwarWidgetProps = {
  totalBidwarDuration: number;
  language?: "de" | "en";
  className?: string;
};

const MAX_BIDWAR_OPTION_AMOUNT = 6;

type PreparedBidwar = {
  name: string;
  options: {
    name: string;
    amount: number;
  }[];
};

export const IntermissionBidwarWidget = ({
  totalBidwarDuration,
  language,
  className,
}: IntermissionBidwarWidgetProps) => {
  const [currentBidwarIndex, setCurrentBidwarIndex] = useState<number>(0);
  const { data: bidwarResults, status: bidwarResultsStatus } =
    useBidwarResults();

  const preparedBidwars = useMemo(() => {
    const bidwars = bidwarResults?.results;
    const newPreparedBidwars: PreparedBidwar[] =
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
        }) || [];
    return newPreparedBidwars;
  }, [bidwarResults, language]);

  const individualBidwarDuration =
    preparedBidwars.length > 0
      ? (totalBidwarDuration - 5 * 1000) / preparedBidwars.length
      : totalBidwarDuration;

  const [prevRotation, setPrevRotation] = useState({
    length: preparedBidwars.length,
    duration: individualBidwarDuration,
  });
  if (
    prevRotation.length !== preparedBidwars.length ||
    prevRotation.duration !== individualBidwarDuration
  ) {
    setPrevRotation({
      length: preparedBidwars.length,
      duration: individualBidwarDuration,
    });
    setCurrentBidwarIndex(0);
  }

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (preparedBidwars.length === 0) return;

    const startBidwarRotation = () => {
      interval = setInterval(() => {
        setCurrentBidwarIndex((prev) => {
          if (prev < preparedBidwars.length - 1) return prev + 1;
          else return 0;
        });
      }, individualBidwarDuration);
    };

    startBidwarRotation();

    return () => clearInterval(interval);
  }, [preparedBidwars.length, individualBidwarDuration]);

  return (
    <div
      className={cn(
        "mt-6 grid w-full px-3 *:col-start-1 *:row-start-1",
        className
      )}
    >
      {bidwarResultsStatus === "success" &&
        currentBidwarIndex < preparedBidwars.length &&
        preparedBidwars.map((bidwar, index) => {
          const text = `!bidwar: ${bidwar.name}`;
          return (
            <div
              key={`${bidwar.name}-${index}`}
              className={cn(
                "flex size-full flex-col rounded-lg bg-purpleLight26 transition-opacity duration-[2000ms] ease-in",
                {
                  "opacity-0": index !== currentBidwarIndex,
                }
              )}
            >
              <div className="mb-1.5 mt-2 text-center text-[24px] uppercase italic tracking-[0.067em]">
                {text}
              </div>
              <div className="mb-2.5 grid w-full grid-cols-[max-content_1fr_max-content] gap-x-2 text-[23px]/[25px] font-semibold uppercase tracking-widest">
                {bidwar.options.map((option, optionIndex) => (
                  <div
                    key={option.name}
                    className={cn(
                      "col-span-full grid grid-rows-subgrid pl-11 pr-7",
                      {
                        "bg-purpleMuted26": optionIndex % 2 === 0,
                      }
                    )}
                  >
                    <div className="tracking-tight">{optionIndex + 1}.</div>
                    <div className="no-scrollbar ml-10 flex overflow-x-hidden text-nowrap text-left">
                      <LayoutBidwarOptionText
                        text={option.name}
                        maxWidth={494}
                      />
                    </div>
                    <div className="flex items-start justify-end tracking-wider">
                      {formatEuro(
                        option.amount !== null ? option.amount : null
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};
