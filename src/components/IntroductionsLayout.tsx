import { useEffect, useMemo, useRef, useState } from "react";
import cn from "classnames";

import { DownloadableComponentProps } from "./DownloadWrapper";
import { SocialPlatform, SocialsOption } from "../utils/socials";
import { TwitchIcon } from "./icons/TwitchIcon";
import { BlueskyIcon } from "./icons/BlueskyIcon";
import { TwitterIcon } from "./icons/TwitterIcon";
import { MastodonIcon } from "./icons/MastodonIcon";
import { InstagramIcon } from "./icons/InstagramIcon";
import {
  MAX_DESCRIPTION_FONTSIZE,
  MAX_DESCRIPTION_LINEHEIGHT,
  MIN_DESCRIPTION_FONTSIZE,
  MIN_DESCRIPTION_LINEHEIGHT,
} from "../pages/IntroductionImages";

import backgroundImageDefault from "../assets/images/introductions-background-1.png";
import backgroundImageMirrored from "../assets/images/introductions-background-2.png";
import profilePictureBackgroundDefault from "../assets/images/introductions-image-background-1.png";
import profilePictureBackgroundMirrored from "../assets/images/introductions-image-background-2.png";

import bubbleTopDefault from "../assets/images/introductions-bubble-1-top.png";
import bubbleMiddleDefault from "../assets/images/introductions-bubble-1-middle.png";
import bubbleBottomDefault from "../assets/images/introductions-bubble-1-bottom.png";
import bubbleTopMirrored from "../assets/images/introductions-bubble-2-top.png";
import bubbleMiddleMirrored from "../assets/images/introductions-bubble-2-middle.png";
import bubbleBottomMirrored from "../assets/images/introductions-bubble-2-bottom.png";

export type IntroductionsLayoutProps = DownloadableComponentProps & {
  scale?: number;
  className?: string;
  mirrored?: boolean;
  name?: string;
  pronouns?: string;
  profilePicture?: string;
  picturePositionX?: number;
  picturePositionY?: number;
  socials?: SocialsOption[];
  descriptionIntro?: string;
  description?: string;
  descriptionFontSize?: number;
};

const getSocialIcon = (platform: SocialPlatform) => {
  switch (platform) {
    case "Twitch":
      return TwitchIcon;
    case "Bluesky":
      return BlueskyIcon;
    case "Twitter":
      return TwitterIcon;
    case "Mastodon":
      return MastodonIcon;
    case "Instagram":
      return InstagramIcon;
    default:
      return TwitchIcon;
  }
};

const MAX_NAME_FONTSIZE = 124;
const FONTSIZE_STEP = 2;
const MIN_NAME_FONTSIZE = 96;

const getOptimizedFontSize = (
  value: string,
  maxWidth: number,
  parent: HTMLElement
) => {
  const testElement = document.createElement("span");
  testElement.classList.add("font-bubbly");
  testElement.innerHTML = value;
  parent.appendChild(testElement);

  let rect: DOMRect;
  let fontSize = MAX_NAME_FONTSIZE + FONTSIZE_STEP;
  do {
    fontSize -= FONTSIZE_STEP;
    if (fontSize <= MIN_NAME_FONTSIZE) break;
    testElement.style.fontSize = `${fontSize}px`;
    rect = testElement.getBoundingClientRect();
  } while (maxWidth <= rect.width);

  parent.removeChild(testElement);
  const optimizedFontsize =
    fontSize <= MIN_NAME_FONTSIZE ? MIN_NAME_FONTSIZE : fontSize;

  return optimizedFontsize;
};

const isWhitespaceString = (str: string) => str.replace(/\s/g, "").length > 0;

export const IntroductionsLayout = ({
  scale = 1,
  className,
  onLoad,
  hotReload = false,
  mirrored,
  name,
  pronouns,
  profilePicture,
  picturePositionX = 50,
  picturePositionY = 50,
  socials,
  descriptionIntro,
  description,
  descriptionFontSize,
}: IntroductionsLayoutProps) => {
  const [nameFontSize, setNameFontSize] = useState(MAX_NAME_FONTSIZE);
  const cloudContainer = useRef<HTMLDivElement>(null);
  const cloudTextRef = useRef<HTMLDivElement>(null);
  const pronounsRef = useRef<HTMLDivElement>(null);
  const cloudTextContainer = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cloudContainer.current) return;
    cloudContainer.current.style.transform = "";
    const y = cloudContainer.current.getBoundingClientRect().y;
    const fractionalPartY = y - Math.floor(y);
    cloudContainer.current.style.transform = `translateY(${fractionalPartY}px)`;
  });

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

  useEffect(() => {
    setTimeout(() => {
      if (
        !name ||
        !cloudTextRef.current ||
        !pronounsRef.current ||
        !cloudContainer.current ||
        !cloudTextContainer.current ||
        !layoutRef.current
      )
        return setNameFontSize(MAX_NAME_FONTSIZE);
      const textContainerComputedStyle = window.getComputedStyle(
        cloudTextContainer.current
      );
      const paddingLeft =
        parseInt(textContainerComputedStyle.paddingLeft) * scale;
      const paddingRight =
        parseInt(textContainerComputedStyle.paddingRight) * scale;
      const horizontalTextPadding = paddingLeft + paddingRight;
      const gap =
        parseInt(window.getComputedStyle(cloudTextRef.current).columnGap) *
        scale;

      const maxWidth =
        cloudContainer.current.getBoundingClientRect().width -
        horizontalTextPadding -
        gap -
        pronounsRef.current.getBoundingClientRect().width;

      const fontSize = getOptimizedFontSize(name, maxWidth, layoutRef.current);

      return setNameFontSize(fontSize);
    });
  }, [name, pronouns, scale]);

  const sortedSocials = useMemo(() => {
    if (!socials) return [];
    const socialsOrder: SocialPlatform[] = [
      "Twitch",
      "Instagram",
      "Twitter",
      "Bluesky",
      "Mastodon",
    ];
    return [...socials].sort(
      (a, b) =>
        socialsOrder.indexOf(a.platform) - socialsOrder.indexOf(b.platform)
    );
  }, [socials]);

  const backgroundImage = mirrored
    ? backgroundImageMirrored
    : backgroundImageDefault;

  const profilePictureBackground = mirrored
    ? profilePictureBackgroundMirrored
    : profilePictureBackgroundDefault;

  const bubbleTop = mirrored ? bubbleTopMirrored : bubbleTopDefault;
  const bubbleMiddle = mirrored ? bubbleMiddleMirrored : bubbleMiddleDefault;
  const bubbleBottom = mirrored ? bubbleBottomMirrored : bubbleBottomDefault;

  return (
    <div
      ref={layoutRef}
      className={cn(
        "relative aspect-square size-[1584px] select-none bg-black text-5xl",
        className
      )}
    >
      <div
        className={cn("absolute size-[530px] p-[5px]", {
          "left-[53px] top-[305px]": !mirrored,
          "left-[948px] top-[260px]": mirrored,
        })}
        style={{
          backgroundImage: `url(${profilePictureBackground})`,
        }}
      >
        {profilePicture && (
          <div
            className="size-full bg-cover"
            style={{
              backgroundImage: `url(${profilePicture})`,
              backgroundPosition: `${picturePositionX}% ${picturePositionY}%`,
            }}
          />
        )}
      </div>
      <img
        src={backgroundImage}
        alt=""
        className="absolute size-full object-cover"
        draggable={false}
      />
      <div
        className={cn("absolute font-pixel text-[28px] text-schedule25-dark", {
          "left-[68px] top-[258px]": !mirrored,
          "left-[963px] top-[213px]": mirrored,
        })}
      >
        {name?.toLowerCase()}.png
      </div>
      <div
        className={cn(
          "absolute top-[52px] flex h-[580px] w-[850px] items-center",
          { "left-[640px]": !mirrored, "left-[64px]": mirrored }
        )}
      >
        <div
          className="grid w-full grid-rows-[165px_1fr_195px] *:col-start-1"
          ref={cloudContainer}
        >
          <img
            src={bubbleTop}
            className="row-start-1 w-[850px] bg-no-repeat"
            alt=""
          />
          <img src={bubbleMiddle} className="row-start-2 h-full w-[850px]" />
          <img
            src={bubbleBottom}
            className="row-start-3 w-[850px] bg-no-repeat"
            alt=""
          />
          <div
            ref={cloudTextContainer}
            className={cn("row-span-full pb-[90px] pt-[44px] text-[#303989]", {
              "pl-[150px] pr-[64px]": !mirrored,
              "pl-[64px] pr-[150px]": mirrored,
            })}
          >
            <div
              ref={cloudTextRef}
              className="mb-2 flex w-fit flex-wrap gap-x-[16px] gap-y-2"
            >
              {name && (
                <div
                  style={{ fontSize: nameFontSize }}
                  className="font-bubbly odd:*:text-[#ff9ae5] even:*:text-[#829eff]"
                >
                  {name.split("").map((letter, index) => (
                    <span key={letter + index}>{letter}</span>
                  ))}
                </div>
              )}
              <div
                ref={pronounsRef}
                className="ml-auto self-end text-right font-bubbly text-[56px]"
              >
                {pronouns}
              </div>
            </div>
            <ul className="mt-10 flex flex-col gap-6 pl-8 font-ubuntu text-[40px]">
              {sortedSocials?.map((social) => {
                const SocialIcon = getSocialIcon(social.platform);
                return (
                  <li key={social.platform} className="flex items-center gap-4">
                    <SocialIcon className="inline size-9" />
                    <span>{social.link}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      {mirrored && (
        <div className="absolute left-[124px] top-[720px] font-pixel text-[28px] text-schedule25-dark">
          README.md
        </div>
      )}
      <div
        className={cn("absolute w-[1248px] px-6 py-3", {
          "left-[246px] top-[746px]": !mirrored,
          "left-[124px] top-[776px]": mirrored,
        })}
      >
        <span
          className={cn({
            "float-start h-[110px] w-[360px]": !mirrored,
            "float-end h-[32px] w-[424px]": mirrored,
          })}
        />
        <span
          style={{
            fontSize: descriptionFontSize,
            lineHeight: descriptionLineHeight,
          }}
          className="schedule-layout-25-text-shadow-dark whitespace-pre-wrap font-ubuntu text-schedule25-light"
        >
          {descriptionIntro && (
            <div className="flex h-[115px] items-center pb-[24px]">
              {descriptionIntro}
            </div>
          )}
          {descriptionParts?.map((part) => (
            <p className="mb-[0.7em] last-of-type:mb-0" key={part}>
              {part}
            </p>
          ))}
        </span>
      </div>
    </div>
  );
};
