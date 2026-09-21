import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import cn from "classnames";

import { Donation, DonationSorting, useDonations } from "../hooks/useDonations";

import { GoalWidgetOverlay } from "../components/obs-layout/GoalWidgetOverlay";
import { LayoutDonationList } from "../components/obs-layout/LayoutDonationList";
import { AnimatedStreamBanner } from "../components/obs-layout/AnimatedStreamBanner";
import { LayoutBidwarWidget } from "../components/obs-layout/LayoutBidwarWidget";
import { DonationAlert } from "../components/obs-layout/DonationAlert";
import { SmashText } from "../components/SmashText";

import {
  getAlertLengthFromDonationAmount,
  playSound,
} from "../utils/widgets/donationAlertSounds";
import { preloadDonationGifs } from "../utils/widgets/donationAlertGifs";

import obsOverlay from "../assets/layout/obs-overlay.png";

export const WidgetObsOverlay = () => {
  const [donationGoalText, setDonationGoalText] = useState("");
  const [donationAlertComment, setDonationAlertComment] = useState<
    string | null
  >();
  const [donationAlertName, setDonationAlertName] = useState<string | null>();
  const [donationAlertAmount, setDonationAlertAmount] = useState<
    number | null
  >();
  const [playDonationAlert, setPlayDonationAlert] = useState(false);
  const [announcingGoalReached, setAnnouncingGoalReached] = useState<string>();
  const [displayedGoalReached, setDisplayedGoalReached] = useState<string>("");
  const [isPreloading, setPreloading] = useState(true);
  const [searchParams] = useSearchParams();
  // Unused, but will be needed later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = searchParams.get("theme");
  const name = searchParams.get("name");
  const pronouns = searchParams.get("pronouns");
  const lang = searchParams.get("lang");
  const testalert = searchParams.get("testalert");
  const alertonly = searchParams.get("alertonly");
  const language = lang === "en" ? "en" : "de";

  const skipAlerts = useRef<boolean>(true);
  const donationAlertQueue = useRef<Donation[]>([]);
  const alreadyQueuedIds = useRef<number[]>([]);

  const { data: highestDonations } = useDonations(DonationSorting.HIGHEST);
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

  if (announcingGoalReached && announcingGoalReached !== displayedGoalReached) {
    setDisplayedGoalReached(announcingGoalReached);
  }

  if (isPreloading) return <div className="text-7xl">Loading...</div>;

  return (
    <div className="grid h-[1080px] w-[1920px] overflow-hidden font-exo text-purpleAccent26 *:col-start-1 *:row-start-1">
      {alertonly === null && (
        <>
          <GoalWidgetOverlay
            className="absolute left-[326px] top-[922px] h-[137px] w-[580px] text-center"
            language={language}
            onDonationTextChange={setDonationGoalText}
            onGoalReachedTextChange={setAnnouncingGoalReached}
          />
          <div
            className="z-10"
            style={{ backgroundImage: `url(${obsOverlay})` }}
          />
          <LayoutBidwarWidget
            className={cn(
              "absolute left-[326px] top-[922px] z-10 flex h-[76px] w-[580px] items-center justify-center overflow-hidden text-center text-[18px] transition-opacity duration-1000",
              { "opacity-0": announcingGoalReached }
            )}
            language={language}
            donationGoalsText={donationGoalText}
          />
          <div
            className={cn(
              "absolute left-[326px] top-[922px] z-10 flex h-[76px] w-[580px] animate-donationAlert items-center justify-center overflow-hidden px-4 text-center text-[18px] transition-opacity duration-1000",
              { "opacity-0": !announcingGoalReached }
            )}
          >
            {language === "en" ? "GOAL REACHED:" : "ZIEL ERREICHT:"}{" "}
            {displayedGoalReached.split(" - ")[1] || displayedGoalReached}
          </div>
          <SmashText
            className="absolute left-[64px] top-[21px] z-10 whitespace-nowrap text-[32px] tracking-wide"
            shadowClassName="!top-[1px]"
            text={name === "empty" ? "" : name || ""}
          />
          <SmashText
            className="absolute left-[182px] top-[228px] z-10 whitespace-nowrap text-right text-[23px]"
            shadowClassName="!top-[0.8px]"
            text={pronouns === "empty" ? "" : pronouns || ""}
          />
          <LayoutDonationList
            className="absolute left-[933px] top-[922px] z-10 h-[137px] w-[486px] overflow-hidden whitespace-nowrap text-center text-[1.1875rem]"
            headline={language === "en" ? "Top Donations" : "Höchste Spenden"}
            donations={highestDonations}
            language={language}
          />
          <LayoutDonationList
            className="absolute left-[1444px] top-[922px] z-10 h-[137px] w-[456px] overflow-hidden whitespace-nowrap text-center text-[1.1875rem]"
            headline={language === "en" ? "Last Donations" : "Letzte Spenden"}
            donations={newestDonations?.slice(0, 3)}
            language={language}
          />
          <AnimatedStreamBanner
            className="absolute left-[12px] top-[916px] z-10 h-[153px] w-[295px] text-center"
            language={language}
          />
        </>
      )}
      <div
        className={cn(
          "absolute left-[1200px] top-[140px] z-10 w-[606px] overflow-hidden text-lg transition-[transform,opacity] duration-[500ms]",
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
        />
      </div>
      {!name && (
        <div className="absolute left-[5px] top-[5px] z-10 max-w-[520px] bg-[#990000] px-4 py-2 font-sans text-xl font-semibold text-white">
          No name provided. Please provide your name by adding &name=[example]
          to the layout URL.
          <br /> Or add &name=empty to not show a name.
        </div>
      )}
      {!pronouns && (
        <div className="absolute left-[5px] top-[110px] z-10 max-w-[520px] bg-[#990000] px-4 py-2 font-sans text-xl font-semibold text-white">
          No pronouns provided. Please provide your pronouns by adding
          &pronouns=[example] to the layout URL.
          <br /> Or add &pronouns=empty to not show any pronouns.
        </div>
      )}
    </div>
  );
};
