import { DownloadWrapper } from "../components/DownloadWrapper";
import { PageContainer } from "../components/PageContainer";
import { ScheduleLayout } from "../components/ScheduleLayout";

export const DevView = () => {
  const minEndTimestampUTC = "2025-09-16T18:00:00";
  const maxEndTimestampUTC = "2025-09-17T08:00:00";

  const LayoutComponent = ScheduleLayout;

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
