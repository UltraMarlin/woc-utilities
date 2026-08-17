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
export const MAX_DESCRIPTION_FONTSIZE = 120;

export const SocialsPostImages = () => {
  const [searchParams] = useSearchParams();
  const lastMousePosition = useRef<{
    x: number;
    y: number;
  } | null>(null);

  const [downloadActive, setDownloadActive] = useState(false);
  const [headline, setHeadline] = useState(
    () => searchParams.get("headline") || ""
  );
  const [headlineFontSize, setHeadlineFontSize] = useState(
    () => parseInt(searchParams.get("headlineFontSize") || "") || 92
  );
  const [description, setDescription] = useState(
    () => searchParams.get("description") || ""
  );
  const [descriptionFontSize, setDescriptionFontSize] = useState(
    () => parseInt(searchParams.get("descriptionFontSize") || "") || 64
  );
  const [copied, setCopied] = useState(false);
  const scrollContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [copied]);

  const toggleDownloadActive = () => {
    setDownloadActive((prev) => !prev);
  };

  const handleHeadlineChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setDownloadActive(false);
    setHeadline(event.target.value);
  };

  const handleHeadlineFontSizeChange = (value: number) => {
    setDownloadActive(false);
    setHeadlineFontSize(value);
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

  const handleCopyPress = () => {
    const paramsArray: string[][] = [];
    if (headline) paramsArray.push(["headline", headline]);
    if (headlineFontSize && headlineFontSize !== 92)
      paramsArray.push(["headlineFontSize", `${headlineFontSize}`]);
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
    headline,
    headlineFontSize,
    description,
    descriptionFontSize,
  };

  return (
    <PageContainer className="grid grid-cols-[1fr_minmax(0,792px)] gap-4">
      <div className="flex h-fit flex-col gap-3.5 rounded bg-neutral-700 p-4 text-white">
        <label className="flex w-full cursor-pointer flex-col">
          <span>Headline</span>
          <input
            type="text"
            className="text-lg text-black"
            name="headline"
            value={headline}
            onChange={handleHeadlineChange}
          />
        </label>
        <label className="flex w-full cursor-pointer flex-col gap-1.5">
          <span>Description</span>
          <textarea
            className="text-lg text-black"
            name="description"
            value={description}
            onChange={handleDescriptionChange}
            rows={12}
          />
        </label>
        <RangeSlider
          className="w-full"
          onChange={handleHeadlineFontSizeChange}
          value={headlineFontSize}
          min={MIN_DESCRIPTION_FONTSIZE}
          max={MAX_DESCRIPTION_FONTSIZE}
        >
          Headline Font Size
        </RangeSlider>
        <RangeSlider
          className="w-full"
          onChange={handleDescriptionFontSizeChange}
          value={descriptionFontSize}
          min={MIN_DESCRIPTION_FONTSIZE}
          max={MAX_DESCRIPTION_FONTSIZE}
        >
          Description Font Size
        </RangeSlider>
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
            className="mt-4 w-fit rounded border px-2 py-0.5"
            onClick={toggleDownloadActive}
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
