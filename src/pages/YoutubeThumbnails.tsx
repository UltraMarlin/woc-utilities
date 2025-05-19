import { useState } from "react";
import { PageContainer } from "../components/PageContainer";
import { ThumbnailLayout } from "../components/ThumbnailLayout";
import { DownloadWrapper } from "../components/DownloadWrapper";

export const YoutubeThumbnails = () => {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [game, setGame] = useState("");
  const [streamer, setStreamer] = useState("");

  const downloadThumbnail = () => {
    setDownloadStarted(true);
  };

  return (
    <PageContainer>
      <div className="mb-4 grid w-96 grid-cols-[max-content_1fr] gap-x-5 gap-y-3 rounded-lg bg-neutral-700 p-4 text-white *:col-span-2">
        <label className="grid grid-cols-subgrid">
          <span>Game</span>
          <input
            type="text"
            className="text-lg text-black"
            name="game"
            value={game}
            onChange={(e) => setGame(e.target.value)}
          />
        </label>
        <label className="grid grid-cols-subgrid">
          <span>StreamerIn</span>
          <input
            className="text-lg text-black"
            type="text"
            name="streamer"
            value={streamer}
            onChange={(e) => setStreamer(e.target.value)}
          />
        </label>
        <input type="file" accept="image/png, image/jpeg" name="background" />
        <button
          type="button"
          className="ml-auto mt-4 w-fit rounded border px-2 py-0.5"
          onClick={downloadThumbnail}
        >
          Thumbnail Erstellen
        </button>
      </div>
      {downloadStarted ? (
        <DownloadWrapper
          className="aspect-video w-[1600px]"
          fileBaseName="thumbnail"
        >
          {({ onLoad }) => (
            <ThumbnailLayout onLoad={onLoad} game={game} streamer={streamer} />
          )}
        </DownloadWrapper>
      ) : (
        <ThumbnailLayout game={game} streamer={streamer} />
      )}
    </PageContainer>
  );
};
