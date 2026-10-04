import cn from "classnames";

import { getTwitchUsername } from "../../utils/formatting/twitch";
import { formatTimestampInGermany } from "../../utils/formatting/time";

type UpcomingStreamItemProps = {
  activityIcon?: string;
  activityName?: string;
  streamerLink?: string;
  start?: string;
  end?: string;
  className?: string;
};

export const UpcomingStreamItem = ({
  activityIcon,
  activityName,
  streamerLink,
  start = "",
  end,
  className,
}: UpcomingStreamItemProps) => {
  const startDate = start ? new Date(start + "+02:00") : undefined;
  const timeUntilStart = (startDate?.getTime() || 0) - new Date().getTime();
  const startString =
    timeUntilStart < 0 ? "NOW!" : formatTimestampInGermany(start);

  return (
    <div
      className={cn(
        "relative flex h-[90px] items-center gap-2.5 rounded-lg bg-purpleLight26 p-1.5 pr-3.5",
        className
      )}
    >
      <div className="h-[76px] w-[84px] shrink-0 overflow-hidden rounded-md">
        {activityIcon && (
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/assets/${activityIcon}?width=128&height=128&quality=100&fit=cover&format=webp`}
            alt=""
          />
        )}
      </div>
      <div className="grid w-full grid-cols-[1fr_max-content] gap-3 py-2">
        <div className="relative">
          {activityName && (
            <div
              className={cn(
                "absolute flex h-[50px] items-center text-balance",
                {
                  "text-[36px]/[1.2]": activityName.length <= 20,
                  "text-[32px]/[1.2]":
                    activityName.length > 20 && activityName.length <= 30,
                  "text-[28px]/[1.15]":
                    activityName.length > 30 && activityName.length <= 48,
                  "text-[24px]/none": activityName.length > 48,
                }
              )}
            >
              {activityName}
            </div>
          )}
          {streamerLink && (
            <div className="absolute bottom-1 text-[23px]/none italic tracking-wider opacity-70">
              twitch.tv/{getTwitchUsername(streamerLink)}
            </div>
          )}
        </div>
        <div className="mt-1 flex flex-col items-center justify-center text-[24px]/none tabular-nums tracking-wide">
          <div className={cn({ "font-bold": startString === "NOW!" })}>
            {startString}
          </div>
          <div className="mb-2.5 translate-y-1 text-[22px]/4 font-extrabold">
            -
          </div>
          <div>{formatTimestampInGermany(end)}</div>
        </div>
      </div>
    </div>
  );
};
