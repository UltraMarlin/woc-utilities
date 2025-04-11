import cn from "classnames";
import { useEffect, useMemo } from "react";
import { useStreams } from "../hooks/useStreams";
import { DownloadableComponentProps } from "./DownloadWrapper";
import logo from "../assets/images/logo.png";
import nightBg from "../assets/images/night-background.png";
import nightTimeBox from "../assets/images/night-time-box.png";
import nightStreamBox from "../assets/images/night-stream-box.png";
import nightLine from "../assets/images/night-line.png";

export type ExampleComponentProps = DownloadableComponentProps & {
  className?: string;
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const ScheduleLayout = ({
  className,
  onLoad,
  hotReload = false,
}: ExampleComponentProps) => {
  const { data: streams, status: streamsStatus } = useStreams();

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
  }, [streamsStatus, onLoad]);

  if (hotReload && streamsStatus === "success") {
    onLoad?.();
  }

  return (
    <div
      className={cn(
        "relative flex size-[1584px] origin-top-left flex-col items-center bg-contain bg-no-repeat text-neutral-800 -z-10",
        className
      )}
      style={{ backgroundImage: `url(${nightBg})` }}
    >
      <img src={logo} alt="" className="mb-24 mt-4 h-56" />
      <h1 className="font-pixel mb-10 text-center text-[6rem] night-outline">
        Upcoming Streams
      </h1>

      <div className="text-night-highlight font-standard">
        {Object.entries(groupedStreams || {}).map(([date, streams]) => (
          <div className="mb-10 w-[800px] text-3xl">
            <h2>
              {new Date(date).toLocaleDateString("de", {
                weekday: "long",
                day: "numeric",
                month: "numeric",
              })}
            </h2>
            <div className="w-[955px] h-[12px]" style={{ backgroundImage: `url(${nightLine})` }} />
            <ul>
              {streams.map((stream) => (
                <li key={stream.id} className="grid grid-cols-[154px_778px] grid-rows-[113px] w-full gap-4">
                  <div
                    className="relative flex flex-col items-center bg-contain"
                    style={{ backgroundImage: `url(${nightTimeBox})` }}
                  >
                    <span>{formatTime(new Date(stream.start))}</span>
                    <span>-</span>
                    <span>{formatTime(new Date(stream.end))}</span>
                  </div>
                  <div className="relative flex w-full">
                    <img
                      className="absolute rounded-l-xl left-2 top-2"
                      src={`${import.meta.env.VITE_API_BASE_URL}/assets/${stream.activity.icon}?width=104&height=97&quality=100&fit=cover&format=webp`}
                      alt=""
                    />
                    <div className="absolute size-full bg-contain gap-4 pl-[112px]" style={{ backgroundImage: `url(${nightStreamBox})` }}>
                      <div className="flex flex-col justify-center p-2">
                        <span>{stream.activity.name}</span>
                        <span>{`twitch.tv${stream.streamer.stream_link.split("twitch.tv")[1]}`}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="absolute bottom-24 text-4xl">More Info</p>
    </div>
  );
};
