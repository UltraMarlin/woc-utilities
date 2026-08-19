import { PropsWithChildren, useEffect, useRef, useState } from "react";
import cn from "classnames";

import chessterWaveGif from "../../../assets/layout/donation_alert/Chesster_Animation_02.gif";
import chessterJumpGif from "../../../assets/layout/donation_alert/Chesster_Animation_01.gif";

import { streamBanners } from "./streamBannerData";

export type AnimatedStreamBannerProps = PropsWithChildren<{
  language: "de" | "en";
  className?: string;
}>;

const BANNER_VISIBLE_DURATION = 12000;
const BANNER_HIDDEN_DURATION = 30000;
const CHESSTER_ALONE_DURATION = 1000;

enum ChessterState {
  HIDDEN_LEFT = "hidden_left",
  HIDDEN_RIGHT = "hidden_right",
  LEFT = "left",
  RIGHT = "right",
}

const getChessterStateVisible = (bannerId: number) => {
  if (bannerId === 1 || bannerId === 4) return ChessterState.LEFT;
  if (bannerId === 2) return ChessterState.RIGHT;
  return ChessterState.HIDDEN_LEFT;
};

const getChessterStateHidden = (bannerId: number) => {
  if (bannerId === 1 || bannerId === 4) return ChessterState.HIDDEN_LEFT;
  if (bannerId === 2) return ChessterState.HIDDEN_RIGHT;
  return ChessterState.HIDDEN_LEFT;
};

export const AnimatedStreamBanner = ({
  language,
  className,
  children,
}: AnimatedStreamBannerProps) => {
  const [currentBanner, setCurrentBanner] = useState(-1);
  const [isBannerVisible, setBannerVisible] = useState(false);
  const [chessterState, setChessterState] = useState(ChessterState.HIDDEN_LEFT);
  const bannerIndex = useRef(-1);

  const hideCurrentBanner = () => {
    setBannerVisible(false);
    setTimeout(() => {
      setChessterState((prev) => {
        if (prev === ChessterState.LEFT) return ChessterState.HIDDEN_LEFT;
        if (prev === ChessterState.RIGHT) return ChessterState.HIDDEN_RIGHT;
        return ChessterState.HIDDEN_LEFT;
      });
    }, CHESSTER_ALONE_DURATION);
  };

  const displayNextBanner = () => {
    const nextBanner = (bannerIndex.current + 1) % streamBanners.length;
    bannerIndex.current = nextBanner;
    setCurrentBanner(nextBanner);

    setChessterState(getChessterStateHidden(nextBanner));
    setTimeout(
      () => setChessterState(getChessterStateVisible(nextBanner)),
      750
    );
    setTimeout(() => {
      setBannerVisible(true);
    }, CHESSTER_ALONE_DURATION + 750);
  };

  useEffect(() => {
    let timeout;

    if (isBannerVisible)
      timeout = setTimeout(hideCurrentBanner, BANNER_VISIBLE_DURATION);
    else timeout = setTimeout(displayNextBanner, BANNER_HIDDEN_DURATION);

    return () => clearTimeout(timeout);
  }, [isBannerVisible]);

  const chessterLeft =
    chessterState === ChessterState.HIDDEN_LEFT ||
    chessterState === ChessterState.LEFT;

  const chessterRight =
    chessterState === ChessterState.HIDDEN_RIGHT ||
    chessterState === ChessterState.RIGHT;

  const chessterVisible =
    chessterState === ChessterState.LEFT ||
    chessterState === ChessterState.RIGHT;

  const chessterHidden =
    chessterState === ChessterState.HIDDEN_LEFT ||
    chessterState === ChessterState.HIDDEN_RIGHT;

  return (
    <div className={className}>
      <div
        className={cn(
          "ease-in-out-back grid size-full font-bold transition-[transform,opacity] duration-[1500ms]",
          {
            "translate-y-16 scale-95 opacity-0": !isBannerVisible,
          }
        )}
      >
        <div className="animate-float">
          {children}
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-7">
            {currentBanner >= 0 && streamBanners[currentBanner][language]}
            {currentBanner >= 0 && streamBanners[currentBanner].both}
          </div>
        </div>
      </div>
      <img
        className={cn(
          "ease-in-out-back absolute bottom-0 -mb-6 size-24 object-contain object-top transition-transform duration-1000",
          {
            "left-0 rotate-[18deg]": chessterLeft,
            "right-0 translate-x-12": chessterRight,
            "translate-y-2": chessterVisible,
            "translate-y-20": chessterHidden,
            "-translate-x-10": chessterState === ChessterState.LEFT,
            "-translate-x-20": chessterState === ChessterState.HIDDEN_LEFT,
          }
        )}
        src={chessterLeft ? chessterWaveGif : chessterJumpGif}
        alt=""
      />
    </div>
  );
};
