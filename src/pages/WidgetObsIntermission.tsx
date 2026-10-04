import { useEffect, useRef, useState } from "react";
import cn from "classnames";
import { useSearchParams } from "react-router-dom";

import { Donation, DonationSorting, useDonations } from "../hooks/useDonations";

import { DonationAlert } from "../components/obs-layout/DonationAlert";

import { IntermissionClock } from "../components/obs-layout/IntermissionClock";

import { UpcomingStreams } from "../components/obs-layout/UpcomingStreams";
import { GoalWidgetIntermission } from "../components/obs-layout/GoalWidgetIntermission";
import { TextDocumentWidget } from "../components/obs-layout/TextDocumentWidget";

import {
  getAlertLengthFromDonationAmount,
  playSound,
} from "../utils/widgets/donationAlertSounds";
import { preloadDonationGifs } from "../utils/widgets/donationAlertGifs";

import bigArtwork from "../assets/layout/chesster.png";
import headerPause from "../assets/layout/header-pause.png";
import headerStart from "../assets/layout/header-start.png";
import headerEnde from "../assets/layout/header-ende.png";
import headerFin from "../assets/layout/header-fin.png";
import { IntermissionBidwarWidget } from "../components/obs-layout/IntermissionBidwarWidget";

const validHeaderTypes = ["pause", "start", "fin"];

const defaultHeader = headerPause;
const getHeaderSrc = (type: string, language: "de" | "en") => {
  if (type === "start") return headerStart;
  if (type === "pause") return headerPause;
  if (type === "fin" && language === "en") return headerFin;
  if (type === "fin" && language === "de") return headerEnde;
  return headerPause;
};

const SWITCH_BIDWAR_GOAL_INTERVAL = 70;

export const WidgetObsIntermission = () => {
  const [activeWindow] = useState<"donationGoals" | "bidwars" | null>(
    "donationGoals"
  );
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
  const enParam = searchParams.get("en");
  const language = enParam !== null ? "en" : "de";
  const testalert = searchParams.get("testalert");
  const type = searchParams.get("type");
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
        "relative grid h-[1080px] w-[1920px] overflow-hidden *:col-start-1 *:row-start-1"
      )}
    >
      <div className="absolute left-[49px] top-[156px] flex w-[450px] justify-center">
        <img src={headerImage} alt="" />
      </div>
      <UpcomingStreams className="px-4 py-7" />

      <div className="size-full backdrop-blur-[7px]">
        <img
          src={bigArtwork}
          alt=""
          className="h-full object-cover object-[35%_50%]"
        />
      </div>

      <TextDocumentWidget language={language} />

      <div
        className={cn(
          "absolute left-[687px] top-[630px] z-10 w-[675px] transition-[transform,opacity] duration-[800ms]",
          {
            "translate-y-[300px] scale-0": activeWindow !== "donationGoals",
          }
        )}
      >
        <GoalWidgetIntermission language={language} />
      </div>

      <div
        className={cn(
          "absolute left-[687px] top-[630px] z-10 w-[675px] transition-[transform,opacity] duration-[800ms]",
          {
            "translate-y-[300px] scale-0": activeWindow !== "bidwars",
          }
        )}
      >
        <div className="h-full p-4">
          <IntermissionBidwarWidget
            totalBidwarDuration={SWITCH_BIDWAR_GOAL_INTERVAL}
            language={language}
          />
        </div>
      </div>

      <IntermissionClock className="ml-auto" />
      <div
        className={cn(
          "absolute left-[120px] top-[258px] z-50 w-[606px] overflow-hidden text-lg transition-[transform,opacity] duration-[500ms]",
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
          withBgBlur
        />
      </div>
    </div>
  );
};
