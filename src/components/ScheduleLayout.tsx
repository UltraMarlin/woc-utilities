import cn from "classnames";
import { useEffect, useMemo } from "react";
import { useStreams } from "../hooks/useStreams";
import { DownloadableComponentProps } from "./DownloadWrapper";
import nightLogo from "../assets/images/night-logo.png";
import nightBg from "../assets/images/night-background.png";
import nightTimeBox from "../assets/images/night-time-box.png";
import nightStreamBox from "../assets/images/night-stream-box.png";
import nightLine from "../assets/images/night-line.png";

import dayLogo from "../assets/images/day-logo.png";
import dayBg from "../assets/images/day-background.png";
import dayTimeBox from "../assets/images/day-time-box.png";
import dayStreamBox from "../assets/images/day-stream-box.png";
import dayLine from "../assets/images/day-line.png";

export type ExampleComponentProps = DownloadableComponentProps & {
  minEndTimestampUTC: string;
  maxEndTimestampUTC: string;
  night: boolean;
  className?: string;
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const ScheduleLayout = ({
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

  useEffect(() => {
    if (streamsStatus === "success") onLoad?.();
  }, [streamsStatus, onLoad, minEndTimestampUTC, maxEndTimestampUTC]);

  if (hotReload && streamsStatus === "success") {
    onLoad?.();
  }

  return (
    <div
      className={cn(
        "relative flex size-[1584px] origin-top-left flex-col items-center bg-contain bg-no-repeat",
        { "text-night-background": night, "text-day-background": !night },
        className
      )}
      style={{ backgroundImage: `url(${night ? nightBg : dayBg})` }}
    >
      <img
        src={night ? nightLogo : dayLogo}
        alt=""
        className="mb-20 mt-20 h-48"
      />
      <h1
        className={cn("mb-10 text-center font-pixel text-[72px] font-bold", {
          "night-outline": night,
          "day-outline": !night,
        })}
      >
        Upcoming Streams
      </h1>

      <div
        className={cn("flex flex-col items-center gap-2 font-standard", {
          "text-night-highlight": night,
          "text-day-highlight": !night,
        })}
      >
        <div className="min-h-[934px]">
          {Object.entries(groupedStreams || {}).map(([date, streams]) => (
            <div className="mb-10 text-3xl">
              <h2 className="text-[36px] font-bold">
                {new Date(date).toLocaleDateString("de", {
                  weekday: "long",
                  day: "numeric",
                  month: "numeric",
                })}
              </h2>
              <div
                className="mb-4 h-[12px] w-[955px]"
                style={{
                  backgroundImage: `url(${night ? nightLine : dayLine})`,
                }}
              />
              <ul className="flex flex-col gap-3">
                {streams.map((stream) => (
                  <li
                    key={stream.id}
                    className="grid w-full grid-cols-[154px_778px] grid-rows-[113px] gap-6"
                  >
                    <div
                      className="relative flex flex-col items-center justify-center bg-contain text-[2rem]/6 font-bold"
                      style={{
                        backgroundImage: `url(${night ? nightTimeBox : dayTimeBox})`,
                      }}
                    >
                      <span>{formatTime(new Date(stream.start))}</span>
                      <span>-</span>
                      <span>{formatTime(new Date(stream.end))}</span>
                    </div>
                    <div className="relative flex w-full">
                      <div className="absolute left-2 top-2 flex h-[97px] w-[104px] items-center justify-center overflow-hidden rounded-l-xl">
                        <img
                          className="absolute h-full max-w-none"
                          src={`${import.meta.env.VITE_API_BASE_URL}/assets/${stream.activity.icon}?width=104&height=97&quality=100&fit=cover&format=webp`}
                          alt=""
                        />
                      </div>
                      <div
                        className="absolute size-full gap-4 bg-contain pl-[112px]"
                        style={{
                          backgroundImage: `url(${night ? nightStreamBox : dayStreamBox})`,
                        }}
                      >
                        <div className="flex h-full flex-col justify-center gap-1 pl-6">
                          <div className="text-[36px] font-bold">
                            {stream.activity.name}
                          </div>
                          <div className="text-[28px]">{`twitch.tv${stream.streamer.stream_link.split("twitch.tv")[1]}`}</div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex gap-3 text-[44px] font-bold">
          Mehr Infos gibt es auf
          <div className="h-14 border-b-4 border-current">
            www.weekofcharity.de
          </div>
        </div>
      </div>
    </div>
  );
};
