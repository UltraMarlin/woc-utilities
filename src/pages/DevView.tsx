import { DownloadWrapper } from "../components/DownloadWrapper";
import { ExampleComponent } from "../components/ExampleComponent";

export const DevView = () => {
  return (
    <main className="flex flex-col gap-6 p-10">
      <DownloadWrapper className="size-[720px]">
        {({ onLoad }) => <ExampleComponent onLoad={onLoad} hotReload />}
      </DownloadWrapper>
      <ExampleComponent />
    </main>
  );
};
