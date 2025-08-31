import { DownloadWrapper } from "../components/DownloadWrapper";
import { PageContainer } from "../components/PageContainer";
import { ScheduleLayout25 } from "../components/ScheduleLayout25";

export const DevView = () => {
  const minEndTimestampUTC = "2025-09-15T12:00:00";
  const maxEndTimestampUTC = "2025-09-15T23:00:00";

  const LayoutComponent = ScheduleLayout25;

  return (
    <PageContainer>
      <div className="flex flex-col gap-6 p-10">
        <DownloadWrapper className="aspect-square size-[720px]">
          {({ onLoad }) => (
            <LayoutComponent
              onLoad={onLoad}
              hotReload
              minEndTimestampUTC={minEndTimestampUTC}
              maxEndTimestampUTC={maxEndTimestampUTC}
            />
          )}
        </DownloadWrapper>
        <LayoutComponent
          minEndTimestampUTC={minEndTimestampUTC}
          maxEndTimestampUTC={maxEndTimestampUTC}
        />
      </div>
    </PageContainer>
  );
};
