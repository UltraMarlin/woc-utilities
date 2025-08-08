import { ChangeEventHandler, useMemo, useRef, useState } from "react";
import { DownloadWrapper } from "../components/DownloadWrapper";
import { ScheduleLayout25 } from "../components/ScheduleLayout25";
import { formatFileDate } from "../utils/formatting/formatFileDate";
import { getSmartLayoutTimestamps } from "../utils/getLayoutTimestamps";
import { DownloadIcon } from "../components/icons/DownloadIcon";
import { PageContainer } from "../components/PageContainer";
import { useStreams } from "../hooks/useStreams";
import { InfoIcon } from "../components/icons/InfoIcon";
import { Link } from "react-router-dom";

export const DownloadView = () => {
  const [startOffset, setStartOffset] = useState<number>(0);
  const [endOffset, setEndOffset] = useState<number>(0);
  const { data: streams } = useStreams();

  const downloadGrid = useRef<HTMLDivElement>(null);
  const timestampEntries = useMemo(() => {
    if (!streams || streams.length === 0) return [];
    const firstStream = streams[0];
    const lastStream = streams[streams.length - 1];
    const start = firstStream.start;
    const end = lastStream.end;
    return getSmartLayoutTimestamps(
      `${start}Z`,
      `${end}Z`,
      startOffset,
      endOffset
    );
  }, [endOffset, startOffset, streams]);

  const downloadAll = () => {
    const downloadButtons =
      downloadGrid.current?.querySelectorAll<HTMLButtonElement>(
        "button[data-download]"
      );
    downloadButtons?.forEach((button) => {
      button.click();
    });
  };

  const handleStartOffsetChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (typeof event.target.value !== "string") return;
    const parsedNumber = parseInt(event.target.value);
    setStartOffset(!isNaN(parsedNumber) ? parsedNumber : 0);
  };

  const handleEndOffsetChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (typeof event.target.value !== "string") return;
    const parsedNumber = parseInt(event.target.value);
    setEndOffset(!isNaN(parsedNumber) ? parsedNumber : 0);
  };

  const handleResetOffsets = () => {
    setStartOffset(0);
    setEndOffset(0);
  };

  return (
    <PageContainer>
      <div className="mb-4 flex max-w-screen-sm flex-col gap-x-4 gap-y-2 rounded border border-blue-950 bg-blue-100 p-3 text-blue-950 sm:flex-row sm:items-center">
        <Link to="/schedule-images/specific">
          <InfoIcon className="block size-7 shrink-0" />
        </Link>
        <p>
          With the offsets, individual streams can be moved between the first
          two and between the last two screen schedule images respectively. This
          is useful in case the distribution is not balanced towards the start
          or end of the streaming week.
        </p>
      </div>
      <div className="mb-4 flex flex-col gap-x-6 gap-y-2 font-medium text-neutral-900 sm:flex-row">
        <label
          className="flex items-baseline gap-2"
          htmlFor="start-offset-input"
        >
          <span className="text-xl">Start Offset (h)</span>
          <input
            id="start-offset-input"
            className="w-16 rounded border border-neutral-900 bg-neutral-50 px-2 py-0.5 text-lg transition-colors hover:bg-neutral-950/15"
            type="number"
            value={startOffset}
            name="start-offset"
            onChange={handleStartOffsetChange}
          />
        </label>
        <label className="flex items-baseline gap-2" htmlFor="end-offset-input">
          <span className="text-xl">End Offset (h)</span>
          <input
            id="end-offset-input"
            className="w-16 rounded border border-neutral-900 bg-neutral-50 px-2 py-0.5 text-lg transition-colors hover:bg-neutral-950/15"
            type="number"
            value={endOffset}
            name="end-offset"
            onChange={handleEndOffsetChange}
          />
        </label>
        <button
          type="button"
          className="w-fit cursor-pointer rounded border border-neutral-900 px-2 py-0.5 text-lg transition-colors hover:bg-neutral-950/15"
          onClick={handleResetOffsets}
        >
          Reset to Default
        </button>
      </div>
      <div className="flex flex-col items-center">
        <div
          ref={downloadGrid}
          className="mb-6 grid w-full grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4"
        >
          {timestampEntries.map(({ minEnd, maxEnd }) => {
            const minEndDate = new Date(minEnd);
            const isNight = minEndDate.getHours() > 12;
            const fileBaseName = `${formatFileDate(minEndDate)}${isNight ? "night" : "day"}`;

            return (
              <DownloadWrapper
                key={minEnd}
                className="aspect-square"
                fileBaseName={fileBaseName}
              >
                {({ onLoad }) => (
                  <ScheduleLayout25
                    onLoad={onLoad}
                    minEndTimestampUTC={minEnd}
                    maxEndTimestampUTC={maxEnd}
                    night={isNight}
                  />
                )}
              </DownloadWrapper>
            );
          })}
        </div>
        <button
          onClick={downloadAll}
          className="flex items-center gap-3 rounded-lg bg-black/60 px-4 py-2.5 text-2xl text-white transition-colors hover:bg-black/80"
        >
          Download All <DownloadIcon className="size-7" />
        </button>
      </div>
    </PageContainer>
  );
};
