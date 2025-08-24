import { ChangeEventHandler, useState } from "react";
import { PageContainer } from "../components/PageContainer";
import {
  ThumbnailLayout,
  ThumbnailLayoutProps,
} from "../components/ThumbnailLayout";
import { DownloadWrapper } from "../components/DownloadWrapper";
import { lowerSanitize } from "../utils/formatting/sanitize";

export const YoutubeThumbnails = () => {
  const [downloadActive, setDownloadActive] = useState(false);
  const [game, setGame] = useState("SPIEL");
  const [gameFontSize, setGameFontSize] = useState("72");
  const [streamer, setStreamer] = useState("STREAMER*IN");
  const [streamerFontSize, setStreamerFontSize] = useState("72");
  const [background, setBackground] = useState("");

  const toggleDownloadActive = () => {
    setDownloadActive((prev) => !prev);
  };

  const handleBackgroundUpdate: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setDownloadActive(false);
    const file = event.target.files?.[0];
    if (!file) return;
    setBackground(URL.createObjectURL(file));
  };

  const handleGameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setDownloadActive(false);
    setGame(event.target.value);
  };

  const handleGameFontSizeChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setDownloadActive(false);
    setGameFontSize(event.target.value);
  };

  const handleStreamerChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setDownloadActive(false);
    setStreamer(event.target.value);
  };

  const handleStreamerFontSizeChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setDownloadActive(false);
    setStreamerFontSize(event.target.value);
  };

  const thumbnailLayoutProps: ThumbnailLayoutProps = {
    game,
    gameFontSize,
    streamer,
    streamerFontSize,
    backgroundSrc: background,
  };

  return (
    <PageContainer>
      <div className="mb-4 grid max-w-[1600px] grid-cols-[1fr_1fr_1fr_auto] items-center gap-x-8 rounded bg-neutral-700 px-4 py-2 text-white">
        <div className="flex items-end gap-1.5">
          <label className="flex w-full cursor-pointer flex-col">
            <span>Game</span>
            <input
              type="text"
              className="text-lg text-black"
              name="game"
              value={game}
              onChange={handleGameChange}
            />
          </label>
          <label className="flex cursor-pointer flex-col">
            <span>Font</span>
            <input
              type="number"
              className="w-20 text-lg text-black"
              value={gameFontSize}
              onChange={handleGameFontSizeChange}
            />
          </label>
        </div>
        <div className="flex items-end gap-1.5">
          <label className="flex w-full cursor-pointer flex-col">
            <span>StreamerIn</span>
            <input
              className="text-lg text-black"
              type="text"
              name="streamer"
              value={streamer}
              onChange={handleStreamerChange}
            />
          </label>
          <label className="flex cursor-pointer flex-col">
            <span>Font</span>
            <input
              type="number"
              className="w-20 text-lg text-black"
              value={streamerFontSize}
              onChange={handleStreamerFontSizeChange}
            />
          </label>
        </div>
        <label className="flex cursor-pointer flex-col">
          <span>Background</span>
          <input
            type="file"
            accept="image/png, image/jpeg"
            name="background"
            className="cursor-pointer"
            onChange={handleBackgroundUpdate}
          />
        </label>
        <button
          type="button"
          className="ml-auto mt-4 w-fit rounded border px-2 py-0.5"
          onClick={toggleDownloadActive}
        >
          {downloadActive ? "Thumbnail Bearbeiten" : "Thumbnail Rendern"}
        </button>
      </div>
      <div className="overflow-scroll">
        {downloadActive ? (
          <DownloadWrapper
            className="aspect-video w-[1600px]"
            fileBaseName={`thumbnail${game ? "_" + lowerSanitize(game) : ""}`}
            downloadPosition="top-left"
          >
            {({ onLoad }) => (
              <ThumbnailLayout onLoad={onLoad} {...thumbnailLayoutProps} />
            )}
          </DownloadWrapper>
        ) : (
          <ThumbnailLayout {...thumbnailLayoutProps} />
        )}
      </div>
    </PageContainer>
  );
};
