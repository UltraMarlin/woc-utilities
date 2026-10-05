import { useEffect, useEffectEvent, useMemo, useState } from "react";

import { useBidwarResults } from "./useBidwarResults";

export type WidgetRotationWindow = "donationGoals" | "bidwars";

export type WidgetRotationTimings = {
  goalsPhaseDuration: number;
  bidwarDuration: number;
  maxBidwarPhaseDuration: number;
  switchDuration: number;
};

type BidwarsState = {
  window: "bidwars";
  queue: number[];
  index: number;
  bidwarDuration: number;
};

type RotationState =
  | { window: "donationGoals" }
  | { window: null; next: "bidwars" }
  | { window: null; next: "donationGoals"; lastBidwarId: number }
  | BidwarsState;

const advanceBidwar = (
  state: BidwarsState,
  activeBidwarIds: number[]
): RotationState => {
  const nextIndex = state.queue.findIndex(
    (id, index) => index > state.index && activeBidwarIds.includes(id)
  );
  if (nextIndex !== -1) return { ...state, index: nextIndex };
  return {
    window: null,
    next: "donationGoals",
    lastBidwarId: state.queue[state.index],
  };
};

const getNextState = (
  state: RotationState,
  activeBidwarIds: number[],
  bidwarDuration: number,
  maxBidwarPhaseDuration: number
): RotationState => {
  if (state.window === "bidwars") return advanceBidwar(state, activeBidwarIds);
  if (state.window === "donationGoals") {
    if (activeBidwarIds.length === 0) return { window: "donationGoals" };
    return { window: null, next: "bidwars" };
  }
  if (state.next === "donationGoals" || activeBidwarIds.length === 0)
    return { window: "donationGoals" };
  return {
    window: "bidwars",
    queue: activeBidwarIds,
    index: 0,
    bidwarDuration: Math.min(
      bidwarDuration,
      maxBidwarPhaseDuration / activeBidwarIds.length
    ),
  };
};

export const useWidgetRotation = ({
  goalsPhaseDuration,
  bidwarDuration,
  maxBidwarPhaseDuration,
  switchDuration,
}: WidgetRotationTimings) => {
  const [state, setState] = useState<RotationState>({
    window: "donationGoals",
  });

  const { data: bidwarResults } = useBidwarResults();
  const activeBidwarIds = useMemo(
    () =>
      bidwarResults?.results
        .filter((bidwar) => bidwar.status === "active")
        .map((bidwar) => bidwar.id) ?? [],
    [bidwarResults]
  );

  if (
    state.window === "bidwars" &&
    !activeBidwarIds.includes(state.queue[state.index])
  ) {
    setState(advanceBidwar(state, activeBidwarIds));
  }

  const phaseDuration =
    state.window === "donationGoals"
      ? goalsPhaseDuration
      : state.window === "bidwars"
        ? state.bidwarDuration
        : switchDuration;

  const endPhase = useEffectEvent(() => {
    setState(
      getNextState(
        state,
        activeBidwarIds,
        bidwarDuration,
        maxBidwarPhaseDuration
      )
    );
  });

  useEffect(() => {
    const timeout = setTimeout(endPhase, phaseDuration);
    return () => clearTimeout(timeout);
  }, [state, phaseDuration]);

  const currentBidwarId =
    state.window === "bidwars"
      ? state.queue[state.index]
      : state.window === null && state.next === "donationGoals"
        ? state.lastBidwarId
        : activeBidwarIds[0];

  return { activeWindow: state.window, currentBidwarId };
};
