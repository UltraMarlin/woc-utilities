import cn from "classnames";
import { useCallback, useEffect, useMemo } from "react";
import { useStreams } from "../hooks/useStreams";
import { DownloadableComponentProps } from "./DownloadWrapper";

import wocLogo from "../assets/images/logo-25.png";
import windowBg from "../assets/images/window-25.png";

import { formatShortTime, formatTimeAlt } from "../utils/formatting/time";
import { getWeekday } from "../utils/formatting/formatDay";
import { getShortTwitchUrl } from "../utils/formatting/twitch";

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
        "bg-schedule-layout-25 relative flex size-[1584px] origin-top-left flex-col items-center",
        className
      )}
    >
      <img src={wocLogo} alt="" className="mb-20 mt-20 h-48" />

      <div
        className={cn(
          "flex h-[992px] w-[1008px] flex-col items-center gap-2 p-3 font-pixel",
          {
            "text-night-highlight": night,
            "text-day-highlight": !night,
          }
        )}
        style={{ backgroundImage: `url(${windowBg})` }}
      >
        <div className="text-schedule25-dark w-full pl-3 text-left text-[26px]">
          UpcomingStreams.exe
        </div>
        <div className="text-schedule25-light bg-schedule25-dark/40 schedule-layout-25-text-shadow-dark flex size-full flex-col gap-6 px-8 pt-5 font-standard text-3xl backdrop-blur-[7px]">
          {Object.entries(groupedStreams || {}).map(([date, streams]) => {
            return (
              <div>
                <h2 className="border-schedule25-light mb-3 border-b-4 pb-1 text-[34px] font-bold">
                  {new Date(date).toLocaleDateString("de", {
                    weekday: "long",
                    day: "numeric",
                    month: "numeric",
                  })}
                </h2>
                <ul className="flex flex-col gap-6">
                  {streams.map(({ start, activity, end, streamer }) => {
                    const { name: activityName, icon: activityIcon } = activity;
                    const { stream_link } = streamer;

                    return (
                      <li
                        key={start}
                        className={cn(
                          "flex items-center gap-6 px-3",
                          className
                        )}
                      >
                        <div className="flex flex-col items-center justify-center text-[32px]">
                          <div>
                            {formatShortTime(new Date(start + "+02:00"))}
                          </div>
                          <div className="mb-1 text-[30px]/[12px]">-</div>
                          <div>{formatShortTime(new Date(end + "+02:00"))}</div>
                        </div>
                        <div className="custom-text-shadow-dark grid w-full grid-cols-[max-content_1fr] gap-6 py-2">
                          <div className="size-24 shrink-0 overflow-hidden rounded-lg">
                            {activityIcon && (
                              <img
                                src={`${import.meta.env.VITE_API_BASE_URL}/assets/${activityIcon}?width=256&height=256&quality=75&fit=cover&format=webp`}
                                alt=""
                              />
                            )}
                          </div>
                          <div className="flex flex-col justify-center gap-3">
                            {activityName && (
                              <div
                                className={cn({
                                  "text-[40px]/[1]": activityName.length <= 20,
                                  "text-[37px]/[1]":
                                    activityName.length > 20 &&
                                    activityName.length <= 30,
                                  "text-[32px]/[1]":
                                    activityName.length > 30 &&
                                    activityName.length <= 48,
                                  "text-[30px]/[1]": activityName.length > 48,
                                })}
                              >
                                {activityName}
                              </div>
                            )}
                            {stream_link && (
                              <div className="text-[30px]">
                                {getShortTwitchUrl(stream_link)}
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
      <div className="text-schedule25-dark mt-14 flex gap-3 text-[40px] font-bold">
        Mehr Infos gibt es auf
        <div className="underline decoration-4 underline-offset-4">
          www.weekofcharity.de
        </div>
      </div>
    </div>
  );
};
