import { useEffect } from "react";
import { DownloadableComponentProps } from "./DownloadWrapper";

type ThumbnailLayoutProps = DownloadableComponentProps & {
  game?: string;
  streamer?: string;
};

export const ThumbnailLayout = ({
  onLoad,
  hotReload = false,
  game,
  streamer,
}: ThumbnailLayoutProps) => {
  useEffect(() => {
    onLoad?.();
  }, [onLoad]);

  if (hotReload) {
    onLoad?.();
  }

  return (
    <div className="relative aspect-video w-[1600px] bg-blue-500">
      <div className="absolute bottom-4 left-4 flex flex-col p-3 text-7xl/tight">
        <span>{game}</span>
        <span>{streamer}</span>
      </div>
    </div>
  );
};
