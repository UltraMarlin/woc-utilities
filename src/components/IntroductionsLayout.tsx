import cn from "classnames";
import { useEffect, useRef } from "react";
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

export type IntroductionsLayoutProps = DownloadableComponentProps & {
  name?: string;
  pronouns?: string;
  profilePicture?: string;
  picturePositionX?: number;
  picturePositionY?: number;
  socials?: SocialsOption[];
  description?: string;
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

export const IntroductionsLayout = ({
  onLoad,
  hotReload = false,
  name,
  pronouns,
  profilePicture,
  picturePositionX = 50,
  picturePositionY = 50,
  socials,
  description,
}: IntroductionsLayoutProps) => {
  const cloudContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cloudContainer.current) return;
    cloudContainer.current.style.transform = "";
    const y = cloudContainer.current.getBoundingClientRect().y;
    const fractionalPartY = y - Math.floor(y);
    cloudContainer.current.style.transform = `translateY(${fractionalPartY}px)`;
  });

  useEffect(() => {
    onLoad?.();
  }, [onLoad]);

  if (hotReload) {
    onLoad?.();
  }

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
          <div className="row-span-full pb-[90px] pl-[150px] pr-[64px] pt-[80px] text-[#303989]">
            <div className="mb-2 flex w-fit flex-wrap gap-x-4 gap-y-2">
              {name && (
                <div
                  className={cn(
                    "font-bubbly odd:*:text-[#ff9ae5] even:*:text-[#829eff]",
                    {
                      "mb-16 text-[15px]": name.length >= 9,
                      "mb-20 text-[17px]": !(name.length >= 9),
                    }
                  )}
                >
                  {name.split("").map((letter, index) => (
                    <span key={letter + index}>{letter}</span>
                  ))}
                </div>
              )}
              <div className="font-bubbly mb-8 ml-auto self-end text-right text-[6px]">
                {pronouns}
              </div>
            </div>
            <ul className="flex flex-col gap-4 pl-8 font-ubuntu text-[42px]">
              {socials?.map((social) => {
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
      <p className="absolute left-[246px] top-[746px] w-[1248px] p-3">
        <span className="float-start h-[90px] w-[360px]" />
        <span className="schedule-layout-25-text-shadow-dark whitespace-pre-line font-ubuntu text-[44px] text-schedule25-light">
          {description}
        </span>
      </p>
    </div>
  );
};
