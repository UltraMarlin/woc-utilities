import { DownloadWrapper } from "../components/DownloadWrapper";
import { ScheduleLayout } from "../components/ScheduleLayout";

export const DownloadView = () => {
  return (
    <main className="p-10">
      <DownloadWrapper className="size-[360px]">
        {({ onLoad }) => <ScheduleLayout onLoad={onLoad} />}
      </DownloadWrapper>
    </main>
  );
};
