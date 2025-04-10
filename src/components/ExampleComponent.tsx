import cn from "classnames";
import { useStreams } from "../hooks/useStreams";
import { DownloadableComponentProps } from "./DownloadWrapper";
import { useEffect } from "react";

export type ExampleComponentProps = DownloadableComponentProps & {
  className?: string;
  headline?: string;
};

export const ExampleComponent = ({
  headline,
  className,
  onLoad,
  hotReload = false,
}: ExampleComponentProps) => {
  const { data: streams, status: streamsStatus } = useStreams();

  const firstThreeStreams = streams?.slice(0, 3);

  useEffect(() => {
    if (streamsStatus === "success") onLoad?.();
  }, [streamsStatus, onLoad]);

  if (hotReload && streamsStatus === "success") {
    onLoad?.();
  }

  return (
    <div
      className={cn(
        "size-[1440px] origin-top-left bg-gradient-to-tr from-blue-400 to-pink-600 p-4 text-white",
        className
      )}
    >
      <h1 className="mb-4 text-center text-4xl font-bold">{headline}</h1>
      <p>Hallos</p>
      <ul className="mb-8 text-2xl">
        {firstThreeStreams?.map((stream) => (
          <li key={stream.id}>
            <span>{stream.start}</span>
            <span>{stream.streamer.name}</span>
            <img
              className="mt-2"
              src={`${import.meta.env.VITE_API_BASE_URL}/assets/${stream.activity.icon}?width=64&height=64&quality=100&fit=cover&format=webp`}
              alt=""
            />
          </li>
        ))}
      </ul>
      <p>More Info</p>
    </div>
  );
};
