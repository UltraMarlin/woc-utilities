import { useEffect, useMemo, useRef, useState } from "react";
import backgroundImage from "../assets/images/introductions-background-1.png";
import profilePictureBackground from "../assets/images/introductions-image-background-1.png";

import bubbleTop from "../assets/images/introductions-bubble-1-top.png";
import bubbleMiddle from "../assets/images/introductions-bubble-1-middle.png";
import bubbleBottom from "../assets/images/introductions-bubble-1-bottom.png";
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

export type IntroductionsLayoutProps = DownloadableComponentProps & {
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

const getOptimizedFontSize = (value: string, maxWidth: number) => {
  const testElement = document.createElement("span");
  testElement.classList.add("font-bubbly");
  testElement.innerHTML = value;
  document.body.appendChild(testElement);

  let rect: DOMRect;
  let fontSize = MAX_NAME_FONTSIZE + FONTSIZE_STEP;
  do {
    fontSize -= FONTSIZE_STEP;
    if (fontSize <= MIN_NAME_FONTSIZE) break;
    testElement.style.fontSize = `${fontSize}px`;
    rect = testElement.getBoundingClientRect();
  } while (maxWidth <= rect.width);

  document.body.removeChild(testElement);
  const optimizedFontsize =
    fontSize <= MIN_NAME_FONTSIZE ? MIN_NAME_FONTSIZE : fontSize;

  return optimizedFontsize;
};

const isWhitespaceString = (str: string) => str.replace(/\s/g, "").length > 0;

export const IntroductionsLayout = ({
  onLoad,
  hotReload = false,
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
        !cloudTextContainer.current
      )
        return setNameFontSize(MAX_NAME_FONTSIZE);
      const textContainerComputedStyle = window.getComputedStyle(
        cloudTextContainer.current
      );
      const paddingLeft = parseInt(textContainerComputedStyle.paddingLeft);
      const paddingRight = parseInt(textContainerComputedStyle.paddingRight);
      const horizontalTextPadding = paddingLeft + paddingRight;
      const maxWidth =
        cloudContainer.current.getBoundingClientRect().width -
        horizontalTextPadding -
        parseInt(window.getComputedStyle(cloudTextRef.current).columnGap) -
        pronounsRef.current.getBoundingClientRect().width;

      const fontSize = getOptimizedFontSize(name, maxWidth);

      return setNameFontSize(fontSize);
    });
  }, [name, pronouns]);

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

  return (
    <div className="relative aspect-square size-[1584px] select-none bg-black text-5xl">
      <div
        className="absolute left-[53px] top-[305px] size-[530px] p-[5px]"
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
      <div className="absolute left-[68px] top-[258px] font-pixel text-[28px] text-schedule25-dark">
        {name?.toLowerCase()}.png
      </div>
      <div className="absolute left-[640px] top-[52px] flex h-[580px] w-[850px] items-center">
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
            className="row-span-full pb-[90px] pl-[150px] pr-[64px] pt-[44px] text-[#303989]"
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
      <div className="absolute left-[246px] top-[746px] w-[1248px] px-6 py-3">
        <span className="float-start h-[110px] w-[360px]" />
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
