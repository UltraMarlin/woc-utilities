import { DownloadWrapper } from "../components/DownloadWrapper";
import { ScheduleLayout } from "../components/ScheduleLayout";

export const DevView = () => {
  return (
    <main className="flex flex-col gap-6 p-10">
      <DownloadWrapper className="size-[720px]">
        {({ onLoad }) => <ScheduleLayout onLoad={onLoad} hotReload />}
      </DownloadWrapper>
      <ScheduleLayout />
    </main>
  );
};
