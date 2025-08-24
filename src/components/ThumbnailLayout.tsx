import cn from "classnames";
import { useEffect } from "react";
import { DownloadableComponentProps } from "./DownloadWrapper";
import shape from "../assets/images/thumbnail-shape-25.png";

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
    <div
      className={cn("relative aspect-video w-[1600px]", {
        "checker-board": !backgroundSrc,
      })}
    >
      {backgroundSrc && (
        <div
          className="size-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundSrc})`,
          }}
        />
      )}
      <img src={shape} alt="" className="absolute left-0 top-0 size-full" />
      <div className="yt-thumbnail-text absolute bottom-7 left-[32px] flex flex-col p-3 font-explorer text-[72px] leading-none text-[#4c0a49]">
        <span style={{ fontSize: `${gameFontSize}px` }}>{game}</span>
        <span style={{ fontSize: `${streamerFontSize}px` }}>{streamer}</span>
      </div>
      <div className="yt-thumbnail-text-logo absolute right-24 top-10 text-[#ffb2ff]">
        <div className="-rotate-3 -skew-x-6 transform-gpu font-explorer text-[78px] leading-none">
          <span>WEEK OF</span>
          <br />
          <span className="ml-3">CHARITY</span>
          <span className="yt-thumbnail-text-logo-year absolute rotate-6 font-lilita text-4xl">
            &apos;25
          </span>
        </div>
      </div>
    </div>
  );
};
