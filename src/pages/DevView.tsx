import { DownloadWrapper } from "../components/DownloadWrapper";
import { ScheduleLayout } from "../components/ScheduleLayout";

export const DevView = () => {
  const minEndTimestampUTC = "2024-10-10T18:00:00";
  const maxEndTimestampUTC = "2024-10-11T06:00:00";

  return (
    <main className="flex flex-col gap-6 p-10">
      <DownloadWrapper className="size-[720px]">
        {({ onLoad }) => (
          <ScheduleLayout
            onLoad={onLoad}
            hotReload
            minEndTimestampUTC={minEndTimestampUTC}
            maxEndTimestampUTC={maxEndTimestampUTC}
            night
          />
        )}
      </DownloadWrapper>
      <ScheduleLayout
        minEndTimestampUTC={minEndTimestampUTC}
        maxEndTimestampUTC={maxEndTimestampUTC}
        night
      />
    </main>
  );
};
