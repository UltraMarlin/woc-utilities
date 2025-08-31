import { ChangeEventHandler, useMemo, useRef, useState } from "react";
import { DownloadWrapper } from "../components/DownloadWrapper";
import { ScheduleLayout25 } from "../components/ScheduleLayout25";
import { formatFileDate } from "../utils/formatting/formatFileDate";
import { PageContainer } from "../components/PageContainer";
import { DownloadIcon } from "../components/icons/DownloadIcon";
import { getLayoutTimestamps } from "../utils/getLayoutTimestamps";
import { Link } from "react-router-dom";
import { InfoIcon } from "../components/icons/InfoIcon";

export const SpecificDownloadView = () => {
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const downloadGrid = useRef<HTMLDivElement>(null);
  const timestampEntries = useMemo(
    () => getLayoutTimestamps(`${start}Z`, `${end}Z`),
    [start, end]
  );

  const downloadAll = () => {
    const downloadButtons =
      downloadGrid.current?.querySelectorAll<HTMLButtonElement>(
        "button[data-download]"
      );
    downloadButtons?.forEach((button) => {
      button.click();
    });
  };

  const handleStartChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (typeof event.target.value !== "string") return;
    setStart(event.target.value);
  };

  const handleEndChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (typeof event.target.value !== "string") return;
    setEnd(event.target.value);
  };

  return (
    <PageContainer>
      <div className="mb-4 flex max-w-screen-sm flex-col gap-x-4 gap-y-2 rounded border border-blue-950 bg-blue-100 p-3 text-blue-950 sm:flex-row sm:items-center">
        <InfoIcon className="block size-7 shrink-0" />
        <p>
          <span className="block font-bold">
            This page is only for very specific usecases!
          </span>
          Please use the{" "}
          <Link to="/schedule-images" className="underline">
            regular download page
          </Link>{" "}
          unless you know what you are doing.
        </p>
      </div>
      <div className="mb-4 flex flex-col gap-6 font-medium sm:flex-row">
        <label
          className="flex w-min items-baseline gap-2"
          htmlFor="start-input"
        >
          <span className="text-xl">Start</span>
          <input
            id="start-input"
            className="cursor-pointer rounded border border-neutral-900 bg-neutral-50 px-2 py-0.5 text-lg transition-colors hover:bg-neutral-950/15"
            type="datetime-local"
            value={start}
            name="start"
            onChange={handleStartChange}
          />
        </label>
        <label className="flex w-min items-baseline gap-2" htmlFor="end-input">
          <span className="text-xl">Ende</span>
          <input
            id="end-input"
            className="cursor-pointer rounded border border-neutral-900 bg-neutral-50 px-2 py-0.5 text-lg transition-colors hover:bg-neutral-950/15"
            type="datetime-local"
            value={end}
            name="end"
            onChange={handleEndChange}
          />
        </label>
      </div>
      <div className="flex flex-col items-center">
        <div
          ref={downloadGrid}
          className="mb-6 grid w-full grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4"
        >
          {timestampEntries.map(({ minEnd, maxEnd }) => {
            const minEndDate = new Date(minEnd);
            const isNight = minEndDate.getHours() > 15;
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
