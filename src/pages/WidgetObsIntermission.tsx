import { useEffect, useRef, useState } from "react";
import cn from "classnames";
import { useSearchParams } from "react-router-dom";

import { Donation, DonationSorting, useDonations } from "../hooks/useDonations";
import { useWidgetRotation } from "../hooks/useWidgetRotation";

import { SmashText } from "../components/SmashText";
import { DonationAlert } from "../components/obs-layout/DonationAlert";
import { IntermissionClock } from "../components/obs-layout/IntermissionClock";
import { UpcomingStreams } from "../components/obs-layout/UpcomingStreams";
import { GoalWidgetIntermission } from "../components/obs-layout/GoalWidgetIntermission";
import { TextDocumentWidget } from "../components/obs-layout/TextDocumentWidget";
import { IntermissionBidwarWidget } from "../components/obs-layout/IntermissionBidwarWidget";
import { IntermissionIndicator } from "../components/obs-layout/IntermissionIndicator";

import {
  getAlertLengthFromDonationAmount,
  playSound,
} from "../utils/widgets/donationAlertSounds";
import { preloadDonationGifs } from "../utils/widgets/donationAlertGifs";
import { getTheme } from "../utils/layout/getTheme";

import bigArtwork from "../assets/layout/chesster.png";
import headerPause from "../assets/layout/header-pause.png";
import headerStart from "../assets/layout/header-start.png";
import headerEnde from "../assets/layout/header-ende.png";
import headerFin from "../assets/layout/header-fin.png";
import intermissionOverlay from "../assets/layout/obs-intermission-overlay.png";
import lightBackgroundAnimation from "../assets/layout/Animation BG Light_1.webm";
import darkBackgroundAnimation from "../assets/layout/Animation Dark BG_1.webm";

const validHeaderTypes = ["pause", "start", "fin"];

const defaultHeader = headerPause;
const getHeaderSrc = (type: string, language: "de" | "en") => {
  if (type === "start") return headerStart;
  if (type === "pause") return headerPause;
  if (type === "fin" && language === "en") return headerFin;
  if (type === "fin" && language === "de") return headerEnde;
  return headerPause;
};

const GOALS_PHASE_DURATION = 60 * 1000;
const BIDWAR_DURATION = 15 * 1000;
const MAX_BIDWAR_PHASE_DURATION = 75 * 1000;
const SWITCH_DURATION = 1000;

export const WidgetObsIntermission = () => {
  const { activeWindow, currentBidwarId } = useWidgetRotation({
    goalsPhaseDuration: GOALS_PHASE_DURATION,
    bidwarDuration: BIDWAR_DURATION,
    maxBidwarPhaseDuration: MAX_BIDWAR_PHASE_DURATION,
    switchDuration: SWITCH_DURATION,
  });
  const [donationAlertComment, setDonationAlertComment] = useState<
    string | null
  >();
  const [donationAlertName, setDonationAlertName] = useState<string | null>();
  const [donationAlertAmount, setDonationAlertAmount] = useState<
    number | null
  >();
  const [playDonationAlert, setPlayDonationAlert] = useState(false);
  const [isPreloading, setPreloading] = useState(true);
  const [searchParams] = useSearchParams();
  const language =
    searchParams.get("lang") === "en" || searchParams.get("en") !== null
      ? "en"
      : "de";
  const testalert = searchParams.get("testalert");
  const type = searchParams.get("type");
  const theme = getTheme(searchParams.get("theme"));
  const headerImage =
    type && validHeaderTypes.includes(type)
      ? getHeaderSrc(type, language)
      : defaultHeader;

  const skipAlerts = useRef<boolean>(true);
  const donationAlertQueue = useRef<Donation[]>([]);
  const alreadyQueuedIds = useRef<number[]>([]);

  const { data: newestDonations } = useDonations(DonationSorting.NEWEST, 10);

  useEffect(() => {
    preloadDonationGifs()
      .then(() => {
        setPreloading(false);
        setTimeout(() => {
          skipAlerts.current = false;
          if (testalert === null) return;
          if (alreadyQueuedIds.current.includes(-1)) return;
          donationAlertQueue.current.unshift({
            id: -1,
            donator_name: "Chesster",
            donated_amount_in_cents: testalert ? parseInt(testalert) : 556,
            donation_comment:
              "Das ist eine Testdonation! Hier steht der Kommentar, der einer Spende hinzugefügt werden kann.",
          });
          alreadyQueuedIds.current.push(-1);
          setPlayDonationAlert(true);
        }, 2500);
      })
      .catch(() => {});
  }, [testalert]);

  useEffect(() => {
    if (!newestDonations) return;

    [...newestDonations].reverse().forEach((newestDonation) => {
      if (alreadyQueuedIds.current.some((id) => id >= newestDonation.id))
        return;

      donationAlertQueue.current.unshift(newestDonation);
      alreadyQueuedIds.current.push(newestDonation.id);
    });

    if (playDonationAlert || donationAlertQueue.current.length === 0) return;

    setTimeout(() => setPlayDonationAlert(true), 1700);
  }, [newestDonations, playDonationAlert]);

  useEffect(() => {
    if (skipAlerts.current) {
      setPlayDonationAlert(false);
      donationAlertQueue.current = [];
      return;
    }
    if (!playDonationAlert) return;

    const currentAlertDonation = donationAlertQueue.current.pop();
    if (!currentAlertDonation) return;
    const { donation_comment, donator_name, donated_amount_in_cents } =
      currentAlertDonation;

    setDonationAlertComment(donation_comment);
    setDonationAlertName(donator_name);
    setDonationAlertAmount(donated_amount_in_cents);
    playSound(donated_amount_in_cents);

    const timeout = setTimeout(
      () => setPlayDonationAlert(false),
      getAlertLengthFromDonationAmount(donated_amount_in_cents)
    );

    return () => clearTimeout(timeout);
  }, [playDonationAlert]);

  if (isPreloading) return <div className="text-7xl">Loading...</div>;

  return (
    <div
      className={cn(
        "relative grid h-[1080px] w-[1920px] overflow-hidden font-exo text-white *:col-start-1 *:row-start-1",
        {
          "bg-yellow26": theme === "light",
          "bg-purpleDark26": theme === "dark",
        }
      )}
    >
      <video
        src={
          theme === "light" ? lightBackgroundAnimation : darkBackgroundAnimation
        }
        autoPlay
        muted
        loop
        width={1920}
        height={1080}
      />
      <div className="absolute right-[51px] top-[74px] h-[724px] w-[508px] overflow-hidden rounded-xl">
        <img
          className="h-[784px] -translate-y-3 object-cover object-[32%_50%]"
          src={bigArtwork}
          alt=""
        />
      </div>
      <img className="absolute inset-0" src={intermissionOverlay} alt="" />
      <div className="absolute left-[36px] top-[29px] flex h-[296px] w-[706px] items-center justify-center">
        <img src={headerImage} alt="" />
      </div>

      <SmashText
        text="Chesster"
        shadowClassName="!top-[1px]"
        className="absolute right-[68px] top-[98px] text-[42px]/none uppercase tracking-[0.09em]"
      />

      <SmashText
        text={language === "en" ? "Upcoming Streams" : "Nächste Streams"}
        shadowClassName="!top-[1px]"
        className="absolute right-[666px] top-[280px] text-[42px]/none uppercase tracking-[0.09em]"
      />
      <div className="absolute left-[562px] top-[306px] h-[346px] w-[726px]">
        <UpcomingStreams />
      </div>

      <SmashText
        text="Message Board"
        shadowClassName="!top-[0.6px]"
        className="absolute left-[97px] top-[347px] text-[33px]/none uppercase tracking-widest"
      />
      <div className="absolute left-[79px] top-[373px] h-[380px] w-[371px]">
        <TextDocumentWidget language={language} />
      </div>

      <SmashText
        text="Donation Goals"
        shadowClassName="!top-[0.6px]"
        className="tracking-wides absolute left-[568px] top-[735px] text-[33px]/none uppercase tracking-widest"
      />
      <IntermissionIndicator
        className="absolute left-[505px] top-[720px]"
        active={activeWindow === "donationGoals"}
      />
      <SmashText
        text="Bidwars"
        shadowClassName="!top-[0.6px]"
        className="tracking-wides absolute right-[702px] top-[735px] text-[33px]/none uppercase tracking-widest"
      />
      <IntermissionIndicator
        className="absolute right-[869px] top-[720px]"
        active={activeWindow === "bidwars"}
      />
      <div className="absolute left-[514px] top-[760px] h-[246px] w-[726px]">
        <div
          className={cn(
            "absolute inset-0 transition-[transform,opacity] duration-[800ms]",
            {
              "translate-y-[24px] opacity-0": activeWindow !== "donationGoals",
            }
          )}
        >
          <GoalWidgetIntermission language={language} />
        </div>
        <div
          className={cn(
            "absolute inset-0 transition-[transform,opacity] duration-[800ms]",
            {
              "translate-y-[24px] opacity-0": activeWindow !== "bidwars",
            }
          )}
        >
          <IntermissionBidwarWidget
            currentBidwarId={currentBidwarId}
            language={language}
          />
        </div>
      </div>

      <IntermissionClock className="absolute bottom-[52px] right-[136px] h-[112px] w-[304px]" />
      <div
        className={cn(
          "absolute left-[546px] top-[146px] z-50 transition-[transform,opacity] duration-[500ms]",
          {
            "scale-[0.4] opacity-0": !playDonationAlert,
          }
        )}
      >
        <DonationAlert
          amount={donationAlertAmount}
          comment={donationAlertComment}
          name={donationAlertName}
          language={language}
          active={playDonationAlert}
        />
      </div>
    </div>
  );
};
