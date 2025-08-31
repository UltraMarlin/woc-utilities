import { useEffect, useMemo } from "react";
import cn from "classnames";

import { DownloadableComponentProps } from "./DownloadWrapper";
import {
  MAX_DESCRIPTION_FONTSIZE,
  MAX_DESCRIPTION_LINEHEIGHT,
  MIN_DESCRIPTION_FONTSIZE,
  MIN_DESCRIPTION_LINEHEIGHT,
} from "../pages/IntroductionImages";

import wocLogo from "../assets/images/logo-25.png";

export type SocialPostLayoutProps = DownloadableComponentProps & {
  className?: string;
  moreInfoTextShown?: boolean;
  windowTitle?: string;
  description?: string;
  descriptionFontSize?: number;
};

const isWhitespaceString = (str: string) => str.replace(/\s/g, "").length > 0;

export const SocialPostLayout = ({
  className,
  onLoad,
  hotReload = false,
  moreInfoTextShown,
  windowTitle: windowTitleFromProps,
  description,
  descriptionFontSize,
}: SocialPostLayoutProps) => {
  const windowTitle = windowTitleFromProps || "info";
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

  const descriptionParts = useMemo(() => {
    return description?.split("\n").filter(isWhitespaceString);
  }, [description]);

  useEffect(() => {
    onLoad?.();
  }, [onLoad]);

  if (hotReload) {
    onLoad?.();
  }

  return (
    <div
      className={cn(
        "bg-schedule-layout-25 relative flex size-[1584px] origin-top-left flex-col items-center font-pixel",
        className
      )}
    >
      <img src={wocLogo} alt="" className="absolute top-[60px] h-[182px]" />

      <div className="absolute left-[144px] top-[284px] mt-1 flex h-[1138px] w-[1298px] flex-col p-3">
        <div className="pl-3 text-left text-[32px] text-schedule25-dark">
          {`${windowTitle}.txt`}
        </div>
        <div
          style={{
            fontSize: descriptionFontSize,
            lineHeight: descriptionLineHeight,
          }}
          className="schedule-layout-25-text-shadow-dark whitespace-pre-wrap p-8 font-ubuntu text-schedule25-light"
        >
          {descriptionParts?.map((part) => (
            <p className="mb-[0.7em] last-of-type:mb-0" key={part}>
              {part}
            </p>
          ))}
        </div>
      </div>
      {moreInfoTextShown && (
        <div className="absolute bottom-[68px] flex gap-3 text-[34px] font-bold text-schedule25-dark">
          Mehr Infos gibt es auf
          <span className="relative after:absolute after:bottom-[2px] after:left-0 after:h-1 after:w-full after:bg-schedule25-dark">
            www.weekofcharity.de
          </span>
        </div>
      )}
      <div className="bg-scan-lines pointer-events-none absolute inset-0" />
    </div>
  );
};
