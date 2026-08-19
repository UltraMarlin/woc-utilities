import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import {
  translateStream,
  type Stream,
  type StreamWithAlternatives,
} from "./useStreams";

export type DonationGoal = {
  timeslot: Stream | null;
  description: string | null;
  hidden: boolean | null;
  id: number;
  name: string;
  reached_at: number;
  reached_at_hidden: boolean;
};

export type DonationGoalWithAlternatives = Omit<DonationGoal, "timeslot"> & {
  name_en: string | null;
  description_en: string | null;
  timeslot: StreamWithAlternatives | null;
};

const translateDonationGoals =
  (lang: "de" | "en") => (donationGoals: DonationGoalWithAlternatives[]) =>
    donationGoals.map((donationGoal) => {
      const { name_en, name, description_en, description, timeslot, ...rest } =
        donationGoal;

      const translatedDonationGoal: DonationGoal = {
        ...rest,
        name: lang === "de" || !name_en ? name : name_en,
        description:
          lang === "de" || !description_en ? description : description_en,
        timeslot: null,
      };

      if (!timeslot) return translatedDonationGoal;

      return {
        ...translatedDonationGoal,
        timeslot: translateStream(lang)(timeslot),
      };
    });

export const useDonationGoals = (lang: "de" | "en") => {
  return useQuery({
    queryKey: ["donation_goals"],
    queryFn: async () => {
      const { data } = await axios.get<{
        data: DonationGoalWithAlternatives[];
      }>(
        `${import.meta.env.VITE_API_BASE_URL}/items/donation_goals?fields=*,timeslot.*,timeslot.activity.icon,timeslot.activity.id,timeslot.activity.name,timeslot.activity.name_en,timeslot.activity.hidden,timeslot.streamer.icon,timeslot.streamer.id,timeslot.streamer.name&filter[hidden][_eq]=false&sort=reached_at`
      );
      return data.data;
    },
    select: translateDonationGoals(lang),
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    refetchIntervalInBackground: true,
  });
};
