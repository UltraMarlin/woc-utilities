import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import cn from "classnames";

import { Donation, DonationSorting, useDonations } from "../hooks/useDonations";
import { useWidgetRotation } from "../hooks/useWidgetRotation";

import { GoalWidgetOverlay } from "../components/obs-layout/GoalWidgetOverlay";
import { LayoutDonationList } from "../components/obs-layout/LayoutDonationList";
import { AnimatedStreamBanner } from "../components/obs-layout/AnimatedStreamBanner";
import { LayoutBidwarWidget } from "../components/obs-layout/LayoutBidwarWidget";
import { DonationAlert } from "../components/obs-layout/DonationAlert";
import { LayoutChat } from "../components/obs-layout/LayoutChat";
import { SmashText } from "../components/SmashText";

import {
  getAlertLengthFromDonationAmount,
  playSound,
} from "../utils/widgets/donationAlertSounds";
import { preloadDonationGifs } from "../utils/widgets/donationAlertGifs";

import obsOverlay from "../assets/layout/obs-overlay.png";
import obsOverlayNoCam from "../assets/layout/obs-overlay-no-cam.png";

const GOALS_PHASE_DURATION = 10 * 60 * 1000;
const BIDWAR_DURATION = 60 * 1000;
const MAX_BIDWAR_PHASE_DURATION = 4 * 60 * 1000;
const SWITCH_DURATION = 2200;

const getNoCamNameFontSize = (name: string) => {
  if (name.length <= 4) return 62;
  if (name.length <= 6) return 52;
  if (name.length <= 8) return 46;
  if (name.length <= 12) return 34;
  if (name.length <= 30) return 28;
  return 22;
};

const getNoCamNameFontShadowOffsetClassName = (name: string) => {
  if (name.length <= 4) return "!top-[3px]";
  if (name.length <= 6) return "!top-[2px]";
  if (name.length <= 8) return "!top-[2px]";
  if (name.length <= 12) return "!top-[0.6px]";
  if (name.length <= 30) return "!top-[0.6px]";
  return "!top-[0.6px]";
};

export const WidgetObsOverlay = () => {
  const { activeWindow, currentBidwarId } = useWidgetRotation({
    goalsPhaseDuration: GOALS_PHASE_DURATION,
    bidwarDuration: BIDWAR_DURATION,
    maxBidwarPhaseDuration: MAX_BIDWAR_PHASE_DURATION,
    switchDuration: SWITCH_DURATION,
  });
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
  const theme = searchParams.get("theme");
  const validTheme = theme === "dark" ? "dark" : "light";
  const name = searchParams.get("name");
  const pronouns = searchParams.get("pronouns");
  const lang = searchParams.get("lang");
  const testalert = searchParams.get("testalert");
  const alertonly = searchParams.get("alertonly");
  const noCam = searchParams.get("nocam") !== null;
  const twitchChannel = searchParams.get("twitch");
  const displayedName = name === "empty" ? "" : name || "";
  const noCamNameFontSize = getNoCamNameFontSize(displayedName);
  const noCamNameFontShadowOffsetClassName =
    getNoCamNameFontShadowOffsetClassName(displayedName);
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
    <div
      className={cn(
        "grid h-[1080px] w-[1920px] overflow-hidden font-exo *:col-start-1 *:row-start-1",
        {
          "text-white": validTheme === "dark",
          "text-purpleAccent26": validTheme === "light",
        }
      )}
    >
      {alertonly === null && (
        <>
          <GoalWidgetOverlay
            className="absolute left-[324px] top-[922px] h-[137px] w-[584px] text-center"
            language={language}
            onDonationTextChange={setDonationGoalText}
            onGoalReachedTextChange={setAnnouncingGoalReached}
            theme={validTheme}
          />
          {twitchChannel && (
            <LayoutChat
              key={twitchChannel}
              className={cn(
                "absolute left-[19px] w-[282px]",
                noCam ? "top-[138px] h-[756px]" : "top-[294px] h-[599px]"
              )}
              channel={twitchChannel}
              theme={validTheme}
            />
          )}
          <div
            className="z-10"
            style={{
              backgroundImage: `url(${noCam ? obsOverlayNoCam : obsOverlay})`,
            }}
          />
          <LayoutBidwarWidget
            className={cn(
              "absolute left-[326px] top-[922px] z-10 flex h-[76px] w-[580px] items-center justify-center overflow-hidden text-center text-[18px] transition-opacity duration-1000",
              { "opacity-0": announcingGoalReached }
            )}
            language={language}
            donationGoalsText={donationGoalText}
            activeWindow={activeWindow}
            currentBidwarId={currentBidwarId}
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
          {noCam ? (
            <div className="absolute left-[32px] top-[4px] z-10 flex h-[62px] w-[266px] items-center">
              <SmashText
                className={cn("leading-none tracking-wide", {
                  "whitespace-nowrap": noCamNameFontSize > 28,
                })}
                style={{ fontSize: `${noCamNameFontSize}px` }}
                shadowClassName={noCamNameFontShadowOffsetClassName}
                text={displayedName}
              />
            </div>
          ) : (
            <SmashText
              className="absolute left-[64px] top-[21px] z-10 whitespace-nowrap text-[33px] tracking-wide"
              shadowClassName="!top-[0.7px]"
              text={displayedName}
            />
          )}
          <SmashText
            className={cn(
              "absolute z-10 whitespace-nowrap text-right",
              noCam
                ? "left-[298px] top-[74px] -translate-x-full text-[25px]"
                : "left-[182px] top-[228px] text-[23px]"
            )}
            shadowClassName={cn(noCam ? "!top-[1px]" : "!top-[0.8px]")}
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
          "absolute left-[1200px] top-[140px] z-10 transition-[transform,opacity] duration-[500ms]",
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
          theme={validTheme}
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
