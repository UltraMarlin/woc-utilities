import cn from "classnames";
import { Fragment, useEffect, useMemo, useState } from "react";
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
    <div className={cn("grid *:col-start-1 *:row-start-1", className)}>
      {bidwarResultsStatus === "success" &&
        currentBidwarIndex < preparedBidwars.length &&
        preparedBidwars.map((bidwar, index) => {
          const text = `! bidwar: ${bidwar.name}`;
          return (
            <div
              key={`${bidwar.name}-${index}`}
              className={cn(
                "flex h-full flex-col transition-opacity duration-[2000ms] ease-in",
                {
                  "opacity-0": index !== currentBidwarIndex,
                }
              )}
            >
              <div className="relative grid text-center text-xl/7">
                <span className="font-bold">{text}</span>
              </div>
              <div className="relative h-full">
                <div
                  className={cn(
                    "absolute top-0 grid w-full grid-cols-[max-content_1fr_max-content] gap-x-2 pl-1 pr-3 *:-mb-1.5",
                    {
                      "text-[15px]/[30px]": bidwar.options.length > 3,
                      "text-[17px]/[35px]": bidwar.options.length <= 3,
                    }
                  )}
                >
                  {bidwar.options.map((option, optionIndex) => (
                    <Fragment key={option.name}>
                      <div>{optionIndex + 1}.</div>
                      <div className="no-scrollbar flex overflow-x-hidden text-nowrap text-left">
                        <LayoutBidwarOptionText
                          text={option.name}
                          maxWidth={494}
                        />
                      </div>
                      <div className="flex items-start justify-end">
                        {formatEuro(
                          option.amount !== null ? option.amount : null
                        )}
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};
