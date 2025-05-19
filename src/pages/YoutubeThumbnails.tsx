import { PageContainer } from "../components/PageContainer";

export const YoutubeThumbnails = () => {
  return (
    <PageContainer>
      <div className="mb-4 grid w-96 grid-cols-[max-content_1fr] gap-x-5 gap-y-3 rounded-lg bg-neutral-700 p-4 text-white *:col-span-2">
        <label className="grid grid-cols-subgrid">
          <span>Game</span>
          <input className="text-lg text-black" type="text" name="game" />
        </label>
        <label className="grid grid-cols-subgrid">
          <span>StreamerIn</span>
          <input className="text-lg text-black" type="text" name="game" />
        </label>
        <input type="file" accept="image/png, image/jpeg" name="background" />
        <button
          className="ml-auto mt-4 w-fit rounded border px-2 py-0.5"
          type="button"
        >
          Thumbnail Erstellen
        </button>
      </div>
      <div className="aspect-video w-fit bg-blue-500"></div>
    </PageContainer>
  );
};
