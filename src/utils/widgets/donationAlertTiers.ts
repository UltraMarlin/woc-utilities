export type DonationAlertTiming = {
  bubblesIn: number;
  bubblesOut: number;
  duration: number;
};

const TIER_1: DonationAlertTiming = {
  bubblesIn: 700,
  bubblesOut: 7400,
  duration: 8000,
};
const TIER_2: DonationAlertTiming = {
  bubblesIn: 800,
  bubblesOut: 7400,
  duration: 8000,
};
const TIER_3: DonationAlertTiming = {
  bubblesIn: 2300,
  bubblesOut: 9400,
  duration: 10000,
};
const TIER_4: DonationAlertTiming = {
  bubblesIn: 4300,
  bubblesOut: 10400,
  duration: 11000,
};
const TIER_5: DonationAlertTiming = {
  bubblesIn: 200,
  bubblesOut: 9900,
  duration: 13000,
};

export const getAlertTimingFromDonationAmount = (
  donated_amount_in_cents: number | null | undefined
) => {
  if (!donated_amount_in_cents || donated_amount_in_cents < 500) return TIER_1;
  if (donated_amount_in_cents < 1000) return TIER_2;
  if (donated_amount_in_cents < 2000) return TIER_3;
  if (donated_amount_in_cents < 5000) return TIER_4;
  return TIER_5;
};
