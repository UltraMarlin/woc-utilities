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
    console.log("Handle load");
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
      <div ref={componentRef} className="absolute -top-[9999px]">
        {children({ onLoad: handleLoadWithDelay })}
      </div>
      {imgSrc && <img className="peer" src={imgSrc} alt="" />}
      {!imgSrc && <div className="size-full animate-pulse bg-neutral-200" />}
      <button
        onClick={startDownload}
        className="absolute rounded-xl bg-neutral-800/50 p-4 text-white transition-colors hover:bg-neutral-900/60"
      >
        <DownloadIcon className="size-10" />
      </button>
    </div>
  );
};
