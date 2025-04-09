import { ReactNode, useEffect, useRef, useState } from "react";
import {
  downloadImage,
  exportAsImage,
} from "../utils/html2canvas/exportAsImage";
import { DownloadIcon } from "./icons/DownloadIcon";

type DownloadWrapperProps = {
  children: ReactNode;
};

export const DownloadWrapper = ({ children }: DownloadWrapperProps) => {
  const [imgSrc, setImgSrc] = useState("");
  const componentRef = useRef<HTMLDivElement>(null);

  const startDownload = () => {
    downloadImage(imgSrc, "download.png");
  };

  useEffect(() => {
    const generateImage = async () => {
      if (!componentRef.current) return;
      const imageBlob = await exportAsImage(componentRef.current);
      setImgSrc(imageBlob);
    };

    generateImage();
  }, [children]);

  return (
    <div className="relative flex aspect-square size-[360px] w-fit flex-col items-center justify-center">
      {!imgSrc && (
        <div ref={componentRef} className="absolute -top-[6000px]">
          {children}
        </div>
      )}
      {imgSrc && <img className="peer" src={imgSrc} />}
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
