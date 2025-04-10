import { DownloadWrapper } from "../components/DownloadWrapper";
import { ExampleComponent } from "../components/ExampleComponent";

export const DownloadView = () => {
  return (
    <main className="p-10">
      <DownloadWrapper className="size-[360px]">
        {({ onLoad }) => <ExampleComponent onLoad={onLoad} />}
      </DownloadWrapper>
    </main>
  );
};
