import { useEffect, useMemo, useRef } from "react";
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

import bgIntroduction from "../assets/images/bg-introduction.png";
import { SmashText } from "./SmashText";

export type IntroductionsLayoutProps = DownloadableComponentProps & {
  scale?: number;
  className?: string;
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

const MAX_NAME_FONTSIZE = 192;

const isWhitespaceString = (str: string) => str.replace(/\s/g, "").length > 0;

export const IntroductionsLayout = ({
  className,
  onLoad,
  hotReload = false,
  name,
  pronouns,
  profilePicture,
  picturePositionX = 50,
  picturePositionY = 50,
  socials,
  description,
  descriptionFontSize,
}: IntroductionsLayoutProps) => {
  const layoutRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (hotReload) onLoad?.();
  });

  const nameFontSize =
    name && name.length > 0
      ? MAX_NAME_FONTSIZE / (1 + name.length ** 2.2 * 0.004)
      : MAX_NAME_FONTSIZE;

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
    <div
      ref={layoutRef}
      className={cn(
        "relative aspect-square size-[1584px] select-none bg-yellow26 text-5xl",
        className
      )}
    >
      <div className="absolute right-[107px] top-[102px] flex w-[980px] items-end rounded-[16px] border-[6px] border-solid border-purpleAccent26 pb-[26px] pl-[262px] pt-[242px]">
        <ul
          className={cn(
            "flex flex-col font-exo font-semibold italic text-purpleAccent26",
            {
              "gap-1 text-[38px]": sortedSocials.length > 3,
              "gap-2.5 py-3 text-[46px]": sortedSocials.length <= 3,
            }
          )}
        >
          {sortedSocials?.map((social) => {
            const SocialIcon = getSocialIcon(social.platform);
            return (
              <li key={social.platform} className="flex items-center gap-4">
                <SocialIcon className="mt-2 inline size-[0.9em]" />
                <span>{social.link}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="absolute left-[68px] top-[36px] size-[654px]">
        {profilePicture && (
          <div
            className="size-full rounded-full bg-yellow26 bg-cover"
            style={{
              backgroundImage: `url(${profilePicture})`,
              backgroundPosition: `${picturePositionX}% ${picturePositionY}%`,
            }}
          />
        )}
      </div>
      <img src={bgIntroduction} className="absolute size-[1584px]" />
      <div className="absolute right-[76px] top-[64px] w-[980px]">
        <div className="flex flex-col">
          <div className="mb-6 flex h-[136px] max-w-[900px] items-center justify-center self-end pr-[162px]">
            <SmashText
              text={name || ""}
              style={{ fontSize: nameFontSize }}
              className="text-right leading-[0.9] text-white smash-shadow-purpleShadow26"
            />
          </div>
          {pronouns && (
            <SmashText
              text={pronouns}
              className="self-end pr-[18px] text-[60px] text-white smash-shadow-purpleShadow26"
            />
          )}
        </div>
      </div>
      <div className="absolute left-[156px] top-[638px] w-[1310px] px-[58px] pt-[74px] text-white">
        <span
          style={{
            fontSize: descriptionFontSize,
            lineHeight: descriptionLineHeight,
          }}
          className="whitespace-pre-wrap font-exo font-medium"
        >
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
