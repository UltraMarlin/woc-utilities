import cn from "classnames";
import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { PageContainer } from "../components/PageContainer";
import { useSearchParams } from "react-router";

import { DownloadWrapper } from "../components/DownloadWrapper";
import { RangeSlider } from "../components/RangeSlider";
import {
  SocialPostLayout,
  SocialPostLayoutProps,
} from "../components/SocialPostLayout";

export const MIN_DESCRIPTION_LINEHEIGHT = 1.05;
export const MAX_DESCRIPTION_LINEHEIGHT = 1.25;
export const MIN_DESCRIPTION_FONTSIZE = 32;
export const MAX_DESCRIPTION_FONTSIZE = 100;

export const SocialsPostImages = () => {
  const [searchParams] = useSearchParams();
  const lastMousePosition = useRef<{
    x: number;
    y: number;
  } | null>(null);

  const [downloadActive, setDownloadActive] = useState(false);
  const [renderButtonDisabled, setRenderButtonDisabled] = useState(false);
  const [moreInfoTextShown, setMoreInfoTextShown] = useState(true);
  const [windowTitle, setWindowTitle] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionFontSize, setDescriptionFontSize] = useState(64);
  const [copied, setCopied] = useState(false);
  const scrollContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [copied]);

  useEffect(() => {
    setMoreInfoTextShown(searchParams.get("moreInfoTextShown") !== "false");
    setWindowTitle(searchParams.get("windowTitle") || "");
    setDescription(searchParams.get("description") || "");
    setDescriptionFontSize(
      parseInt(searchParams.get("descriptionFontSize") || "") || 64
    );
  }, [searchParams]);

  const toggleDownloadActive = () => {
    setDownloadActive((prev) => !prev);
  };

  const handleDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    setDownloadActive(false);
    setDescription(event.target.value);
  };

  const handleDescriptionFontSizeChange = (value: number) => {
    setDownloadActive(false);
    setDescriptionFontSize(value);
  };

  const handleMoreInfoTextShownChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setDownloadActive(false);
    setMoreInfoTextShown(event.target.checked);
  };

  const handleWindowTitleChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setDownloadActive(false);
    setWindowTitle(event.target.value);
  };

  useEffect(() => {
    setRenderButtonDisabled(window.devicePixelRatio !== 1);

    const handleResize = () => {
      setRenderButtonDisabled(window.devicePixelRatio !== 1);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCopyPress = () => {
    const paramsArray: string[][] = [];
    if (moreInfoTextShown) paramsArray.push(["moreInfoTextShown", "true"]);
    else paramsArray.push(["moreInfoTextShown", "false"]);
    if (windowTitle) paramsArray.push(["windowTitle", windowTitle]);
    if (description) paramsArray.push(["description", description]);
    if (descriptionFontSize && descriptionFontSize !== 64)
      paramsArray.push(["descriptionFontSize", `${descriptionFontSize}`]);

    const searchParams = new URLSearchParams(paramsArray);
    navigator.clipboard.writeText(
      `${window.location.origin}${window.location.pathname}${paramsArray.length > 0 ? "?" + searchParams : ""}`
    );
    setCopied(true);
  };

  const handleMouseEnter = () => {
    const element = scrollContainer.current;
    if (!element) return;
    const isScrollable =
      element.scrollWidth > element.clientWidth ||
      element.scrollHeight > element.clientHeight;
    if (isScrollable) element.style.cursor = "all-scroll";
    else element.style.cursor = "default";
  };

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!scrollContainer.current) return;
    lastMousePosition.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!lastMousePosition.current || !scrollContainer.current) return;
    const differenceX = event.clientX - lastMousePosition.current.x;
    const differenceY = event.clientY - lastMousePosition.current.y;
    scrollContainer.current.scrollBy({
      left: -differenceX * 1.5,
      top: -differenceY * 1.5,
    });
    lastMousePosition.current = { x: event.clientX, y: event.clientY };
  };

  const resetMousePosition: MouseEventHandler<HTMLDivElement> = () => {
    if (!scrollContainer.current) return;
    lastMousePosition.current = null;
  };

  const socialPostLayoutProps: SocialPostLayoutProps = {
    moreInfoTextShown,
    windowTitle,
    description,
    descriptionFontSize,
  };

  return (
    <PageContainer className="grid grid-cols-[1fr_minmax(0,792px)] gap-4">
      <div className="flex h-fit flex-col gap-3.5 rounded bg-neutral-700 p-4 text-white">
        <label className="flex w-fit cursor-pointer items-center gap-2 py-1 pr-2">
          <span>More Info Text Shown</span>
          <input
            type="checkbox"
            className="size-4"
            name="moreInfoTextShown"
            checked={moreInfoTextShown}
            onChange={handleMoreInfoTextShownChange}
          />
        </label>
        <label className="flex w-full cursor-pointer flex-col">
          <span>Window Title</span>
          <input
            type="text"
            className="text-lg text-black"
            name="windowTitle"
            value={windowTitle}
            onChange={handleWindowTitleChange}
          />
        </label>
        <label className="flex w-full cursor-pointer flex-col gap-1.5">
          <span>Description</span>
          <textarea
            className="text-lg text-black"
            name="description"
            value={description}
            onChange={handleDescriptionChange}
            rows={14}
          />
        </label>
        <RangeSlider
          className="w-full"
          onChange={handleDescriptionFontSizeChange}
          value={descriptionFontSize}
          min={MIN_DESCRIPTION_FONTSIZE}
          max={MAX_DESCRIPTION_FONTSIZE}
        >
          Description Font Size
        </RangeSlider>
        {renderButtonDisabled && !downloadActive && (
          <div className="rounded-md border border-red-500/50 bg-red-500/10 px-2.5 py-2 text-red-200">
            Browser zoom has to be at 100% to render the image!
          </div>
        )}
        <div className="relative flex justify-between">
          <div>
            <button
              type="button"
              className="mt-4 w-fit rounded border px-2 py-0.5"
              onClick={handleCopyPress}
            >
              Copy Link
            </button>
            <div
              className={cn(
                "absolute -top-3 ml-1 text-neutral-50 transition-[opacity,transform] duration-300",
                {
                  "translate-y-0 opacity-100": copied,
                  "translate-y-1 opacity-0": !copied,
                }
              )}
              aria-hidden={!copied}
              inert={!copied}
            >
              Copied to clipboard!
            </div>
          </div>

          <button
            type="button"
            className="mt-4 w-fit rounded border px-2 py-0.5 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={toggleDownloadActive}
            disabled={renderButtonDisabled && !downloadActive}
          >
            {downloadActive ? "Edit Image" : "Render Image"}
          </button>
        </div>
      </div>
      <div
        className={cn({
          "sticky top-4 max-h-[min(100vh-100px,792px)] overflow-scroll":
            !downloadActive,
        })}
        ref={scrollContainer}
        onMouseEnter={handleMouseEnter}
        onMouseDown={handleMouseDown}
        onMouseUp={resetMousePosition}
        onMouseLeave={resetMousePosition}
        onMouseMove={handleMouseMove}
      >
        {downloadActive ? (
          <DownloadWrapper
            className="aspect-square w-[800px]"
            fileBaseName="socialpost"
            downloadPosition="top-left"
          >
            {({ onLoad }) => (
              <SocialPostLayout onLoad={onLoad} {...socialPostLayoutProps} />
            )}
          </DownloadWrapper>
        ) : (
          <SocialPostLayout
            className="-mb-[792px] -mr-[792px] origin-top-left scale-50"
            {...socialPostLayoutProps}
          />
        )}
      </div>
    </PageContainer>
  );
};
