import { FaMastodon } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaBluesky } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa6";

import cn from "classnames";
import cardgourmetLogo from "../../../assets/images/cardgourmet_cat_logo_66.png";

export type ChessterSide = "left" | "right";

type MultiLanguageBanner = {
  de?: React.ReactNode;
  en?: React.ReactNode;
  both?: React.ReactNode;
  chessterSide?: ChessterSide;
};

export const getStreamBanners = (
  theme: "light" | "dark" = "light"
): MultiLanguageBanner[] => [
  {
    de: (
      <div className="ml-5 self-start text-left text-[20px]/none">
        Gesponsert von
      </div>
    ),
    en: (
      <div className="ml-5 self-start text-left text-[20px]/none">
        Sponsored by
      </div>
    ),
    both: (
      <div className="h-2/3 w-full text-left">
        <img
          className="absolute right-3 top-11"
          alt=""
          src={cardgourmetLogo}
          width={66}
        />
        <div className="ml-5 mt-[20px] w-full">
          <p className="mb-2 text-[25px]/[1.15] tracking-tight">
            cardgourmet.com
          </p>
          <p
            className={cn("text-[20px] italic", {
              "text-[#a2abfd]": theme === "dark",
              "text-purpleLight26": theme === "light",
            })}
          >
            A TCG Card Browser
          </p>
        </div>
      </div>
    ),
  },
  {
    de: "Alle Spenden gehen an",
    en: "All donations go to",
    both: <div className="text-[32px]">Sanktionsfrei</div>,
    chessterSide: "left",
  },
  {
    de: (
      <>
        Für mehr Infos zum
        <br />
        Spenden schreibt
        <br />
        <span className="text-3xl">!spenden</span>
        in den Chat
      </>
    ),
    en: (
      <>
        For the donation
        <br />
        link write
        <br />
        <span className="text-3xl">!donate</span>
        in the chat
      </>
    ),
    chessterSide: "right",
  },
  {
    de: "Folgt uns auf",
    en: "Follow us on",
    both: (
      <div className="my-2 flex flex-col gap-1.5 text-[20px] *:flex *:items-center *:justify-center *:leading-5">
        <span className="gap-1 tracking-tight" key="mastodon">
          <FaMastodon size="1.5rem" />
          WeekOfCharity@tech.lgbt
        </span>
        <span className="gap-1 tracking-tight" key="bluesky">
          <FaBluesky size="1.5rem" />
          chesster.weekofcharity.de
        </span>
      </div>
    ),
  },
  {
    de: "Folgt uns auf",
    en: "Follow us on",
    both: (
      <div className="mt-2 flex flex-col gap-1.5 text-[20px] *:flex *:items-center *:justify-center *:gap-2 *:leading-5">
        <span key="youtube">
          <FaYoutube size="1.5rem" />
          @WeekOfCharity
        </span>
        <span key="tiktok">
          <FaTiktok size="1.5rem" />
          @WeekOfCharity
        </span>
        <span key="instagram" className="mb-0.5">
          <FaInstagram size="1.5rem" />
          weekofcharity
        </span>
      </div>
    ),
    chessterSide: "left",
  },
];
