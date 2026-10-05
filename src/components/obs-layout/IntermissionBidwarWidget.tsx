import cn from "classnames";
import { useMemo } from "react";
import { useBidwarResults } from "../../hooks/useBidwarResults";

import { formatEuro } from "../../utils/formatting/formatMoney";
import { LayoutBidwarOptionText } from "./LayoutBidwarWidget/LayoutBidwarOptionText";

export type IntermissionBidwarWidgetProps = {
  currentBidwarId?: number;
  language?: "de" | "en";
  className?: string;
};

const MAX_BIDWAR_OPTION_AMOUNT = 6;

type PreparedBidwar = {
  id: number;
  name: string;
  options: {
    name: string;
    amount: number;
  }[];
};

export const IntermissionBidwarWidget = ({
  currentBidwarId,
  language,
  className,
}: IntermissionBidwarWidgetProps) => {
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
        }) || [];
    return newPreparedBidwars;
  }, [bidwarResults, language]);

  return (
    <div
      className={cn(
        "mt-6 grid w-full px-3 *:col-start-1 *:row-start-1",
        className
      )}
    >
      {bidwarResultsStatus === "success" &&
        preparedBidwars.map((bidwar) => {
          const text = `!bidwar: ${bidwar.name}`;
          return (
            <div
              key={bidwar.id}
              className={cn(
                "flex size-full flex-col rounded-lg bg-purpleLight26 transition-opacity duration-[2000ms] ease-in",
                {
                  "opacity-0": bidwar.id !== currentBidwarId,
                }
              )}
            >
              <div
                className={cn(
                  "mb-1.5 mt-2 text-center uppercase italic tracking-wide",
                  {
                    "text-[18px]/[32px]": text.length > 58,
                    "text-[20px]/[32px]": text.length > 48 && text.length <= 58,
                    "text-[22px]/[32px]": text.length <= 48,
                  }
                )}
              >
                {text}
              </div>
              <div className="mb-2.5 grid w-full grid-cols-[max-content_1fr_max-content] gap-x-2 text-[21px]/[25px] font-semibold uppercase tracking-widest">
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
