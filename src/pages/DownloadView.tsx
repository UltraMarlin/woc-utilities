import { DownloadWrapper } from "../components/DownloadWrapper";
import { ExampleComponent } from "../components/ExampleComponent";

export const DownloadView = () => {
  return (
    <main className="p-10">
      <DownloadWrapper>
        {({ onLoad }) => (
          <ExampleComponent headline="WOC Plan" onLoad={onLoad} />
        )}
      </DownloadWrapper>
    </main>
  );
};
