import cn from "classnames";
import { useCallback, useEffect, useMemo } from "react";
import { useStreams } from "../hooks/useStreams";
import { DownloadableComponentProps } from "./DownloadWrapper";

import wocLogo from "../assets/images/logo-25.png";
import activityFrame from "../assets/images/stream-frame-25.png";

import { formatShortTime, formatTimeAlt } from "../utils/formatting/time";
import { formatDay, getWeekday } from "../utils/formatting/formatDay";
import { getTwitchUsername } from "../utils/formatting/twitch";
import { TwitchIcon } from "./icons/TwitchIcon";

export type ExampleComponentProps = DownloadableComponentProps & {
  minEndTimestampUTC: string;
  maxEndTimestampUTC: string;
  night: boolean;
  className?: string;
};

export const ScheduleLayout25 = ({
  className,
  minEndTimestampUTC,
  maxEndTimestampUTC,
  night,
  onLoad,
  hotReload = false,
}: ExampleComponentProps) => {
  const { data: streams, status: streamsStatus } = useStreams(
    minEndTimestampUTC,
    maxEndTimestampUTC
  );

  const groupedStreams = useMemo(
    () =>
      streams?.reduce(
        (acc, stream) => {
          const date = stream.start.split("T")[0];
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(stream);
          return acc;
        },
        {} as Record<string, typeof streams>
      ),
    [streams]
  );

  const getAltText = useCallback(() => {
    if (!streams || streams.length <= 0) return "";
    const startDate = new Date(streams[0].start);
    const endDate = new Date(streams[streams.length - 1].end);
    const startTimeText = `${getWeekday(startDate)} ${formatTimeAlt(startDate)}`;
    const endTimeText = `${getWeekday(endDate)} ${formatTimeAlt(endDate)}`;
    const timeRangeText = `${startTimeText} bis ${endTimeText}`;
    const streamInfo = streams
      .map(
        (stream) =>
          `${formatTimeAlt(new Date(stream.start))}: ${stream.activity.name} bei ${stream.streamer.name}`
      )
      .join("; ");
    return `Der Week of Charity Streamplan von ${timeRangeText}; ${streamInfo}; Mehr Infos gibt es auf weekofcharity.de`;
  }, [streams]);

  useEffect(() => {
    if (streamsStatus === "success") onLoad?.(getAltText());
  }, [
    streamsStatus,
    onLoad,
    minEndTimestampUTC,
    maxEndTimestampUTC,
    getAltText,
  ]);

  if (hotReload && streamsStatus === "success") {
    onLoad?.(getAltText());
  }

  return (
    <div
      className={cn(
        "bg-schedule-layout-25 relative flex size-[1584px] origin-top-left flex-col items-center font-pixel",
        className
      )}
    >
      <img src={wocLogo} alt="" className="absolute top-[60px] h-[182px]" />

      <div
        className={cn(
          "absolute left-[144px] top-[284px] mt-1 flex h-[1138px] w-[1298px] flex-col items-center p-3",
          {
            "text-night-highlight": night,
            "text-day-highlight": !night,
          }
        )}
      >
        <div className="w-full pl-3 text-left text-[32px] text-schedule25-dark">
          UpcomingStreams.exe
        </div>
        <div className="schedule-layout-25-text-shadow-dark flex size-full flex-col gap-8 px-11 pt-10 text-3xl text-schedule25-light">
          {Object.entries(groupedStreams || {}).map(([date, streams]) => {
            return (
              <div key={date}>
                <h2 className="mb-3 text-[30px] font-bold tracking-tighter">
                  {formatDay(date)}
                </h2>
                <div className="relative mb-3.5 h-[4px] w-[92%] bg-schedule25-light after:absolute after:bottom-[-4px] after:left-[4px] after:h-1 after:w-full after:bg-schedule25-dark" />
                <ul className="flex flex-col gap-2.5">
                  {streams.map(({ start, activity, streamer }) => {
                    const { name: activityName, icon: activityIcon } = activity;
                    const { stream_link } = streamer;
                    return (
                      <li
                        key={start}
                        className={cn("flex items-start gap-8 px-3", className)}
                      >
                        <div className="mt-12 flex w-[116px] flex-col items-center justify-center text-[36px] font-bold">
                          {formatShortTime(new Date(start + "+02:00"))}
                        </div>
                        <div className="custom-text-shadow-dark relative grid w-full grid-cols-[max-content_1fr] gap-6">
                          <div className="p-2">
                            <div className="size-[114px] shrink-0 overflow-hidden rounded-2xl bg-schedule25-dark">
                              {activityIcon && (
                                <img
                                  src={`${import.meta.env.VITE_API_BASE_URL}/assets/${activityIcon}?width=256&height=256&quality=75&fit=cover&format=webp`}
                                  alt=""
                                />
                              )}
                            </div>
                          </div>
                          <img
                            className="absolute size-[130px]"
                            src={activityFrame}
                            alt=""
                          />
                          <div className="flex flex-col justify-center gap-2">
                            {activityName && (
                              <div
                                className={cn("leading-snug", {
                                  "text-[41px] tracking-tighter":
                                    activityName.length <= 20,
                                  "text-[37px] tracking-tighter":
                                    activityName.length > 20 &&
                                    activityName.length <= 30,
                                  "text-[31px] tracking-tight":
                                    activityName.length > 30 &&
                                    activityName.length <= 40,
                                  "text-[27px] tracking-tight":
                                    activityName.length > 40,
                                })}
                              >
                                {activityName}
                              </div>
                            )}
                            {stream_link && (
                              <div className="flex items-center gap-3 text-[26px] tracking-tight">
                                <TwitchIcon className="size-[44px] drop-shadow-layout-dark" />{" "}
                                <span>{getTwitchUsername(stream_link)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute bottom-[68px] flex gap-3 text-[34px] font-bold text-schedule25-dark">
        Mehr Infos gibt es auf
        <span className="relative after:absolute after:bottom-[2px] after:left-0 after:h-1 after:w-full after:bg-schedule25-dark">
          www.weekofcharity.de
        </span>
      </div>
      <div className="bg-scan-lines pointer-events-none absolute inset-0" />
    </div>
  );
};
