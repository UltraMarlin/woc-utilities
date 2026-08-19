import cn from "classnames";
import { useCallback, useEffect, useMemo } from "react";
import { useStreams } from "../hooks/useStreams";
import { DownloadableComponentProps } from "./DownloadWrapper";

import { formatShortTime, formatTimeAlt } from "../utils/formatting/time";
import { formatDay, getWeekday } from "../utils/formatting/formatDay";
import { getTwitchUsername } from "../utils/formatting/twitch";
import { SmashText } from "./SmashText";

export type ExampleComponentProps = DownloadableComponentProps & {
  minEndTimestampUTC: string;
  maxEndTimestampUTC: string;
  className?: string;
};

const Seperator = () => <div className="bg-seperator my-[18px] w-[1.5px]" />;

export const ScheduleLayout = ({
  className,
  minEndTimestampUTC,
  maxEndTimestampUTC,
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

  useEffect(() => {
    if (hotReload && streamsStatus === "success") onLoad?.(getAltText());
  });

  return (
    <div
      className={cn(
        "bg-schedule-post relative flex size-[1584px] origin-top-left flex-col items-center",
        className
      )}
    >
      <div className="absolute left-[130px] top-[289px] h-[1112px] w-[1310px] pl-[48px] pr-[30px] pt-[32px] text-white">
        <SmashText
          className="mb-8 mr-6 mt-2 text-right text-[63px] uppercase leading-none tracking-[0.074em]"
          text="Upcoming Streams"
        />
        <div className="flex flex-col gap-6 font-exo">
          {Object.entries(groupedStreams || {}).map(([date, streams]) => {
            return (
              <div key={date}>
                <h2 className="mb-3 rounded-[14px] bg-purpleLight26 p-1.5 pb-2 pl-6 text-[30px] font-semibold uppercase italic leading-none tracking-widest">
                  {formatDay(date)}
                </h2>
                <ul className="flex flex-col gap-3">
                  {streams.map(({ start, activity, streamer }) => {
                    const { name: activityName, icon: activityIcon } = activity;
                    const { stream_link } = streamer;
                    return (
                      <li
                        key={start}
                        className={cn(
                          "grid h-[124px] grid-cols-[226px_4px_190px_4px_1fr] rounded-[14px] bg-gradient-to-r from-purpleLight26 to-purpleAccent26 *:min-h-0",
                          className
                        )}
                      >
                        <div className="flex items-center justify-center text-[54px] font-medium tracking-wider">
                          {formatShortTime(new Date(start + "+02:00"))}
                        </div>
                        <Seperator />
                        <div className="flex items-center justify-center">
                          <div className="size-[108px] shrink-0 overflow-hidden rounded-[8px]">
                            {activityIcon && (
                              <img
                                src={`${import.meta.env.VITE_API_BASE_URL}/assets/${activityIcon}?width=256&height=256&quality=100&fit=cover&format=webp`}
                                alt=""
                              />
                            )}
                          </div>
                        </div>
                        <Seperator />
                        <div className="flex h-full flex-col py-2 pl-8">
                          {activityName && (
                            <div
                              className={cn(
                                "flex h-full items-center font-medium leading-none tracking-wider",
                                {
                                  "text-[41px]": activityName.length <= 20,
                                  "text-[37px]":
                                    activityName.length > 20 &&
                                    activityName.length <= 30,
                                  "text-[31px]":
                                    activityName.length > 30 &&
                                    activityName.length <= 40,
                                  "text-[27px]": activityName.length > 40,
                                }
                              )}
                            >
                              {activityName}
                            </div>
                          )}
                          {stream_link && (
                            <div className="mb-2 text-[26px] italic tracking-wider">
                              twitch.tv/{getTwitchUsername(stream_link)}
                            </div>
                          )}
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
    </div>
  );
};
