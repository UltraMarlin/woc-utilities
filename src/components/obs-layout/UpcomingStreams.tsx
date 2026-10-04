import cn from "classnames";
import { StreamFilter, useStreams } from "../../hooks/useStreams";
import { UpcomingStreamItem } from "./UpcomingStreamItem";

type UpcomingStreamsProps = {
  className?: string;
};

export const UpcomingStreams = ({ className }: UpcomingStreamsProps) => {
  const { data: upcomingStreams, status: streamsStatus } = useStreams(
    undefined,
    undefined,
    "de",
    {
      filter: StreamFilter.UPCOMING,
      limit: 3,
      refetchInterval: 60 * 1000,
    }
  );

  return (
    <div className={cn("grid grid-rows-3", className)}>
      {streamsStatus === "pending" && <span>Laden...</span>}
      {streamsStatus === "error" && <span>Fehler beim Laden der Streams</span>}
      {streamsStatus === "success" &&
        upcomingStreams?.map((stream) => (
          <UpcomingStreamItem
            key={stream.id}
            activityIcon={stream.activity.icon}
            activityName={stream.activity.name}
            streamerLink={stream.streamer.stream_link}
            start={stream.start}
            end={stream.end}
          />
        ))}
    </div>
  );
};
