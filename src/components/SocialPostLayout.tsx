import { useEffect, useMemo } from "react";
import cn from "classnames";

import { DownloadableComponentProps } from "./DownloadWrapper";
import {
  MAX_DESCRIPTION_FONTSIZE,
  MAX_DESCRIPTION_LINEHEIGHT,
  MIN_DESCRIPTION_FONTSIZE,
  MIN_DESCRIPTION_LINEHEIGHT,
} from "../pages/IntroductionImages";

export type SocialPostLayoutProps = DownloadableComponentProps & {
  className?: string;
  moreInfoTextShown?: boolean;
  windowTitle?: string;
  headline?: string;
  headlineFontSize?: number;
  description?: string;
  descriptionFontSize?: number;
};

const isWhitespaceString = (str: string) => str.replace(/\s/g, "").length > 0;

export const SocialPostLayout = ({
  className,
  onLoad,
  hotReload = false,
  headline,
  headlineFontSize,
  description,
  descriptionFontSize,
}: SocialPostLayoutProps) => {
  const descriptionLineHeight = useMemo(() => {
    if (!descriptionFontSize) return MAX_DESCRIPTION_LINEHEIGHT;
    const percent =
      (descriptionFontSize - MIN_DESCRIPTION_FONTSIZE) /
      (MAX_DESCRIPTION_FONTSIZE - MIN_DESCRIPTION_FONTSIZE);
    const lineheightSpan =
      MAX_DESCRIPTION_LINEHEIGHT - MIN_DESCRIPTION_LINEHEIGHT;
    const lineheight = MIN_DESCRIPTION_LINEHEIGHT + lineheightSpan * percent;
    return lineheight;
  }, [descriptionFontSize]);

  const headlineLineHeight = useMemo(() => {
    if (!headlineFontSize) return MAX_DESCRIPTION_LINEHEIGHT;
    const percent =
      (headlineFontSize - MIN_DESCRIPTION_FONTSIZE) /
      (MAX_DESCRIPTION_FONTSIZE - MIN_DESCRIPTION_FONTSIZE);
    const lineheightSpan =
      MAX_DESCRIPTION_LINEHEIGHT - MIN_DESCRIPTION_LINEHEIGHT;
    const lineheight = MIN_DESCRIPTION_LINEHEIGHT + lineheightSpan * percent;
    return lineheight;
  }, [headlineFontSize]);

  const descriptionParts = useMemo(() => {
    return description?.split("\n").filter(isWhitespaceString);
  }, [description]);

  useEffect(() => {
    onLoad?.();
  }, [onLoad]);

  useEffect(() => {
    if (hotReload) onLoad?.();
  });

  return (
    <div
      className={cn(
        "bg-social-post relative flex size-[1584px] origin-top-left flex-col items-center text-white",
        className
      )}
    >
      <div className="absolute left-[131px] top-[284px] mt-1 flex h-[1112px] w-[1309px] flex-col p-14">
        <div className="whitespace-pre-wrap">
          {headline && (
            <h1
              className="font-smash-open mb-8 text-center tracking-[0.075em]"
              style={{
                fontSize: headlineFontSize,
                lineHeight: headlineLineHeight,
              }}
            >
              {headline}
            </h1>
          )}
          {descriptionParts?.map((part) => (
            <p
              key={part}
              className="font-exo mb-[0.7em] px-10 font-medium last-of-type:mb-0"
              style={{
                fontSize: descriptionFontSize,
                lineHeight: descriptionLineHeight,
              }}
            >
              {part}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
