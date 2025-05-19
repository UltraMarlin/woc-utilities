import { ReactNode, useRef, useState } from "react";
import cn from "classnames";
import {
  downloadImage,
  exportAsImage,
} from "../utils/html2canvas/exportAsImage";
import { DownloadIcon } from "./icons/DownloadIcon";

export type DownloadableComponentProps = {
  onLoad?: (alt?: string) => void;
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
  const [altText, setAltText] = useState("");
  const componentRef = useRef<HTMLDivElement>(null);

  const startDownload = () => {
    downloadImage(imgSrc, `${fileBaseName}.png`);
  };

  const generateImage = async () => {
    if (!componentRef.current) return;
    const imageBlob = await exportAsImage(componentRef.current);
    setImgSrc(imageBlob);
  };

  const handleLoadWithDelay = (alt?: string) => {
    setTimeout(() => {
      generateImage();
      if (alt) setAltText(alt);
    }, delay);
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div ref={componentRef} className="absolute -left-[9999px]">
        {children({ onLoad: handleLoadWithDelay })}
      </div>
      {imgSrc && <img className="peer" src={imgSrc} alt="" />}
      {!imgSrc && <div className="size-full animate-pulse bg-neutral-400" />}
      <div className="absolute size-full bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
      <span className="absolute bottom-2 text-white">{fileBaseName}.png</span>
      <button
        type="button"
        data-download
        onClick={startDownload}
        className="absolute rounded-xl bg-black/60 p-5 text-white transition-colors hover:bg-black/80"
      >
        <DownloadIcon className="size-12" />
      </button>
      {altText && (
        <button
          onClick={() => window.alert(altText)}
          className="absolute right-2 top-2 rounded-lg bg-black/60 px-2.5 py-0.5 font-semibold text-white underline decoration-transparent decoration-2 underline-offset-[-1px] transition-[background-color,text-decoration-color,text-underline-offset] hover:bg-black/80 hover:decoration-white hover:underline-offset-1"
        >
          ALT
        </button>
      )}
    </div>
  );
};
