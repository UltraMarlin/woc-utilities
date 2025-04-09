import { DownloadWrapper } from "./components/DownloadWrapper";
import { ExampleComponent } from "./components/ExampleComponent";

export const App = () => {
  return (
    <main className="p-10">
      <DownloadWrapper>
        <ExampleComponent headline="WOC Plan" />
      </DownloadWrapper>
      <DownloadWrapper>
        <ExampleComponent headline="WOC Plan Nummer 2" />
      </DownloadWrapper>
    </main>
  );
};
