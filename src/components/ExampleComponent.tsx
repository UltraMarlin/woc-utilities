import cn from "classnames";
import { useEffect, useMemo } from "react";
import { useStreams } from "../hooks/useStreams";
import { DownloadableComponentProps } from "./DownloadWrapper";
import exampleBg from "../assets/images/example-background.png";
import exampleLogo from "../assets/images/example-logo.png";

export type ExampleComponentProps = DownloadableComponentProps & {
  className?: string;
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const ExampleComponent = ({
  className,
  onLoad,
  hotReload = false,
}: ExampleComponentProps) => {
  const { data: streams, status: streamsStatus } = useStreams(
    "2024-10-11T18:00:00",
    "2024-10-12T06:00:00"
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
  }, [streamsStatus, onLoad]);

  if (hotReload && streamsStatus === "success") {
    onLoad?.();
  }

  return (
    <div
      className={cn(
        "relative flex size-[1440px] origin-top-left flex-col items-center bg-contain bg-no-repeat text-neutral-800",
        className
      )}
      style={{ backgroundImage: `url(${exampleBg})` }}
    >
      <img src={exampleLogo} alt="" className="mb-24 mt-4 h-56" />
      <h1 className="mb-10 text-center font-pixel text-[6rem]">
        Upcoming Streams
      </h1>

      <div>
        {Object.entries(groupedStreams || {}).map(([date, streams]) => (
          <div className="mb-10 w-[800px] text-3xl">
            <h2>
              {new Date(date).toLocaleDateString("de", {
                weekday: "long",
                day: "numeric",
                month: "numeric",
              })}
            </h2>
            <ul>
              {streams.map((stream) => (
                <li key={stream.id} className="flex w-full items-center gap-4">
                  <div
                    className="relative flex flex-col items-center bg-contain"
                    style={{ backgroundImage: `url(${exampleBg})` }}
                  >
                    <span>{formatTime(new Date(stream.start))}</span>
                    <span>{formatTime(new Date(stream.end))}</span>
                  </div>
                  <div
                    className="relative flex w-full gap-4 bg-contain"
                    style={{ backgroundImage: `url(${exampleBg})` }}
                  >
                    <img
                      className="mt-2"
                      src={`${import.meta.env.VITE_API_BASE_URL}/assets/${stream.activity.icon}?width=104&height=104&quality=100&fit=cover&format=webp`}
                      alt=""
                    />
                    <div className="flex flex-col justify-center">
                      <span>{stream.activity.name}</span>
                      <span>{`twitch.tv${stream.streamer.stream_link.split("twitch.tv")[1]}`}</span>
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
