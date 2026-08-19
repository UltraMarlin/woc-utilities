import { FaMastodon } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaBluesky } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa6";

type MultiLanguageBanner = {
  de?: React.ReactNode;
  en?: React.ReactNode;
  both?: React.ReactNode;
};

export const streamBanners: MultiLanguageBanner[] = [
  {
    de: "Alle Spenden gehen an",
    en: "All donations go to",
    both: (
      <>
        <br />
        <span className="mt-1 text-xl">Islamic Relief</span>
      </>
    ),
  },
  {
    de: (
      <>
        Für mehr Infos zum
        <br />
        Spenden schreibt
        <br />
        <span className="my-1 text-xl">! spenden</span>
        in den Chat
      </>
    ),
    en: (
      <>
        For the donation
        <br />
        link write
        <br />
        <span className="my-1 text-xl">! donate</span>
        in the chat
      </>
    ),
  },
  {
    de: "Folgt uns auf",
    en: "Follow us on",
    both: (
      <div className="mt-2 flex flex-col gap-1.5 text-[15px] *:flex *:items-center *:justify-center *:leading-6">
        <span className="gap-1 tracking-tighter" key="mastodon">
          <FaMastodon size="1.5rem" />
          WeekOfCharity@tech.lgbt
        </span>
        <span className="gap-1 tracking-[-0.07em]" key="bluesky">
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
      <div className="mt-2 flex flex-col gap-1.5 text-[15px] *:flex *:items-center *:justify-center *:gap-2 *:leading-5 *:tracking-tighter">
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
  },
];
