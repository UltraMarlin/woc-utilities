import { useRef } from "react";
import { DownloadWrapper } from "../components/DownloadWrapper";
import { ScheduleLayout24 } from "../components/ScheduleLayout24";
import { formatFileDate } from "../utils/formatting/formatFileDate";
import { getLayoutTimestamps } from "../utils/getLayoutTimestamps";
import { DownloadIcon } from "../components/icons/DownloadIcon";
import { PageContainer } from "../components/PageContainer";

export const DownloadView = () => {
  const downloadGrid = useRef<HTMLDivElement>(null);
  const timestampEntries = getLayoutTimestamps(
    "2024-10-06T18:00:00Z",
    "2024-10-13T20:00:00Z"
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

  return (
    <PageContainer>
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
                  <ScheduleLayout24
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
