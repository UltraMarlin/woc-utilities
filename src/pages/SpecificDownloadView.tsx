import { useSearchParams } from "react-router-dom";
import { DownloadWrapper } from "../components/DownloadWrapper";
import { ScheduleLayout } from "../components/ScheduleLayout";
import { formatFileDate } from "../utils/formatting/formatFileDate";
import { PageContainer } from "../components/PageContainer";

export const SpecificDownloadView = () => {
  const [searchParams] = useSearchParams();
  // const minEnd = "2024-10-06T18:00:00Z";
  // const maxEnd = "2024-10-07T06:00:00Z";
  const minEnd = searchParams.get("minEnd");
  const maxEnd = searchParams.get("maxEnd");

  if (!minEnd || !maxEnd) return <div>Missing dates in search params</div>;

  const minEndDate = new Date(minEnd);
  const maxEndDate = new Date(maxEnd);

  if (isNaN(minEndDate.getTime()) || isNaN(maxEndDate.getTime()))
    return <div>Invalid dates in search params</div>;

  const isNight = minEndDate.getHours() > 15;
  const fileBaseName = `${formatFileDate(minEndDate)}${isNight ? "night" : "day"}`;

  return (
    <PageContainer>
      <div className="flex flex-col items-center p-4 sm:p-8">
        <DownloadWrapper
          key={minEnd}
          className="aspect-square max-w-[720px]"
          fileBaseName={fileBaseName}
        >
          {({ onLoad }) => (
            <ScheduleLayout
              onLoad={onLoad}
              minEndTimestampUTC={minEnd}
              maxEndTimestampUTC={maxEnd}
              night={isNight}
            />
          )}
        </DownloadWrapper>
      </div>
    </PageContainer>
  );
};
