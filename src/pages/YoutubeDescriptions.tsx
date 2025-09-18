import cn from "classnames";
import { useEffect, useMemo, useState } from "react";
import { PageContainer } from "../components/PageContainer";
import { Stream, useStreams } from "../hooks/useStreams";
import { formatDay } from "../utils/formatting/formatDay";
import { formatYTDescription } from "../utils/formatting/formatYTDescription";

export const YoutubeDescriptions = () => {
  const { data: streams, status: streamsStatus } = useStreams();
  const [currentStreamIndex, setCurrentStreamIndex] = useState<number>();
  const [dialogContent, setDialogContent] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const streamsGrouped = useMemo(() => {
    if (typeof streams === "undefined" || streams.length === 0) {
      return {};
    }

    return streams.reduce<Record<string, Stream[]>>((groups, stream) => {
      const day = formatDay(stream.start);
      const group = groups[day] ?? [];

      return { ...groups, [day]: [...group, stream] };
    }, {});
  }, [streams]);

  const openDialogWithContent = (stream: Stream) => {
    if (!streams) return;
    setCurrentStreamIndex(streams.indexOf(stream));
    setDialogContent(formatYTDescription(stream));
    setDialogOpen(true);
  };

  const openDialogWithPreviousStreamContent = () => {
    if (typeof currentStreamIndex === "undefined") return;
    const previousStream = streams?.[currentStreamIndex - 1];
    if (!previousStream) return;
    openDialogWithContent(previousStream);
  };

  const openDialogWithNextStreamContent = () => {
    if (typeof currentStreamIndex === "undefined") return;
    const nextStream = streams?.[currentStreamIndex + 1];
    if (!nextStream) return;
    openDialogWithContent(nextStream);
  };

  const handleCopyPress = () => {
    navigator.clipboard.writeText(dialogContent);
    setCopied(true);
  };

  const closeDialog = () => {
    setCurrentStreamIndex(undefined);
    setDialogOpen(false);
    setCopied(false);
  };

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <PageContainer>
      <div
        className="grid grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] gap-x-2.5 gap-y-1"
        inert={dialogOpen}
      >
        {streamsStatus !== "success" && "Loading Stream Data..."}
        {streamsStatus === "success" &&
          Object.keys(streamsGrouped).map((day) => (
            <div
              className="row-[span_20_/_span_20] grid grid-rows-subgrid"
              key={day}
            >
              <div className="mb-1 border-b-2 border-red-900 font-bold uppercase text-red-900">
                {day}
              </div>

              {streamsGrouped[day].map((stream) => (
                <button
                  key={stream.id}
                  className="flex min-w-0 flex-col rounded bg-red-300/30 px-2 py-1.5 text-start text-neutral-900 transition-colors duration-150 hover:bg-red-300/50"
                  title={`${stream.streamer.name}: ${stream.activity.name}`}
                  onClick={() => openDialogWithContent(stream)}
                >
                  <span className="font-bold">{stream.streamer.name}</span>
                  <span className="overflow-x-hidden text-ellipsis whitespace-nowrap">
                    {stream.activity.name}
                  </span>
                </button>
              ))}
            </div>
          ))}
      </div>
      {dialogOpen && (
        <div
          className="fixed inset-1/2 box-content size-full -translate-x-1/2 -translate-y-1/2 border border-black/40 bg-black/40"
          onClick={closeDialog}
        />
      )}
      <dialog
        open={dialogOpen}
        className="fixed left-1/2 right-1/2 top-20 w-full -translate-x-1/2 flex-col gap-4 rounded-lg bg-neutral-700 p-4 shadow-2xl open:flex md:w-fit"
      >
        <div className="flex justify-between">
          <div className="flex items-center gap-2 font-bold">
            <button
              className="rounded bg-neutral-100 px-2 py-1.5 text-neutral-800 transition-colors duration-150 enabled:hover:bg-neutral-300 disabled:opacity-40"
              onClick={openDialogWithPreviousStreamContent}
              disabled={currentStreamIndex === 0}
            >
              Prev
            </button>
            <button
              className="rounded bg-neutral-100 px-2 py-1.5 text-neutral-800 transition-colors duration-150 enabled:hover:bg-neutral-300 disabled:opacity-40"
              onClick={openDialogWithNextStreamContent}
              disabled={streams && currentStreamIndex === streams?.length - 1}
            >
              Next
            </button>
          </div>
          <div className="flex items-center gap-2 font-bold">
            <span
              className={cn(
                "mr-1 text-neutral-50 transition-[opacity,transform] duration-300",
                {
                  "translate-y-0 opacity-100": copied,
                  "translate-y-1 opacity-0": !copied,
                }
              )}
              aria-hidden={!copied}
              inert={!copied}
            >
              Copied to clipboard!
            </span>
            <button
              className="mr-2 rounded bg-neutral-100 px-5 py-1.5 text-neutral-800 transition-colors duration-150 hover:bg-neutral-300"
              onClick={handleCopyPress}
            >
              Copy
            </button>
            <button
              className="size-9 rounded bg-red-300 text-4xl text-red-900 transition-colors duration-150 hover:bg-red-400"
              onClick={closeDialog}
            >
              <div className="-translate-y-[9px]">⨯</div>
            </button>
          </div>
        </div>
        <div className="w-full overflow-x-auto rounded bg-neutral-50 p-4 md:min-w-[44rem]">
          <pre>{dialogContent}</pre>
        </div>
      </dialog>
    </PageContainer>
  );
};
