import { useEffect } from "react";
import { DownloadableComponentProps } from "./DownloadWrapper";
import greenShape from "../assets/images/thumbnail-green-shape.png";

export type ThumbnailLayoutProps = DownloadableComponentProps & {
  game?: string;
  gameFontSize?: string;
  streamer?: string;
  streamerFontSize?: string;
  backgroundSrc?: string;
};

export const ThumbnailLayout = ({
  onLoad,
  hotReload = false,
  game,
  gameFontSize,
  streamer,
  streamerFontSize,
  backgroundSrc,
}: ThumbnailLayoutProps) => {
  useEffect(() => {
    onLoad?.();
  }, [onLoad]);

  if (hotReload) {
    onLoad?.();
  }

  return (
    <div className="relative aspect-video w-[1600px] bg-blue-500">
      {backgroundSrc && (
        <img
          src={backgroundSrc}
          alt=""
          className="absolute size-full object-cover"
        />
      )}
      <img
        src={greenShape}
        alt=""
        className="absolute left-0 top-0 size-full"
      />
      <div className="font-explorer yt-thumbnail-text absolute bottom-7 left-[32px] flex flex-col p-3 text-[72px] leading-none text-[#b1ef92]">
        <span style={{ fontSize: `${gameFontSize}px` }}>{game}</span>
        <span style={{ fontSize: `${streamerFontSize}px` }}>{streamer}</span>
      </div>
      <div className="yt-thumbnail-text-logo absolute right-24 top-10 text-[#b1ef92]">
        <div className="font-explorer -rotate-3 -skew-x-6 transform-gpu text-[78px] leading-none">
          <span>Week of</span>
          <br />
          <span className="ml-3">Charity</span>
          <span className="font-lilita yt-thumbnail-text-logo-year absolute rotate-6 text-4xl">
            &apos;25
          </span>
        </div>
      </div>
    </div>
  );
};
