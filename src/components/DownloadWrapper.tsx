import { ReactNode, useRef, useState } from "react";
import cn from "classnames";
import {
  downloadImage,
  exportAsImage,
} from "../utils/html2canvas/exportAsImage";
import { DownloadIcon } from "./icons/DownloadIcon";

export type DownloadableComponentProps = {
  onLoad?: () => void;
  hotReload?: boolean;
};

type DownloadWrapperProps = {
  children: (props: DownloadableComponentProps) => ReactNode;
  fileBaseName?: string;
  className?: string;
  delay?: number;
};

export const DownloadWrapper = ({
  children,
  fileBaseName = "download",
  className,
  delay = 0,
}: DownloadWrapperProps) => {
  const [imgSrc, setImgSrc] = useState("");
  const componentRef = useRef<HTMLDivElement>(null);

  const startDownload = () => {
    downloadImage(imgSrc, `${fileBaseName}.png`);
  };

  const generateImage = async () => {
    if (!componentRef.current) return;
    const imageBlob = await exportAsImage(componentRef.current);
    setImgSrc(imageBlob);
  };

  const handleLoadWithDelay = () => {
    setTimeout(() => {
      generateImage();
    }, delay);
  };

  return (
    <div
      className={cn(
        "relative flex aspect-square items-center justify-center",
        className
      )}
    >
      <div ref={componentRef} className="absolute -left-[9999px]">
        {children({ onLoad: handleLoadWithDelay })}
      </div>
      {imgSrc && <img className="peer" src={imgSrc} alt="" />}
      {!imgSrc && <div className="size-full animate-pulse bg-neutral-400" />}
      <div className="absolute size-full bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
      <span className="absolute bottom-2 text-white">{fileBaseName}.png</span>
      <button
        onClick={startDownload}
        className="absolute rounded-xl bg-black/60 p-5 text-white transition-colors hover:bg-black/80"
      >
        <DownloadIcon className="size-12" />
      </button>
    </div>
  );
};
