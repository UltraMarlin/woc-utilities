import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { getGermanTimestamp } from "../utils/formatting/time";

export type Stream = {
  activity: {
    id: number;
    icon: string;
    name: string;
  };
  end: string;
  fellows: {
    people_id: {
      id: number;
      name: string;
      stream_link: string | null;
    };
  }[];
  id: number;
  start: string;
  language: StreamLanguage;
  streamer: {
    id: number;
    name: string;
    stream_link: string;
  };
};

export type StreamWithAlternatives = Omit<Stream, "activity"> & {
  activity: Stream["activity"] & {
    name_en: string | null;
  };
};

export enum StreamLanguage {
  DE = "de",
  EN = "en",
  DEEN = "deen",
}

export enum StreamFilter {
  UPCOMING = "upcoming",
}

export type UseStreamsOptions = {
  filter?: StreamFilter;
  limit?: number;
  refetchInterval?: number;
};

export const translateStream =
  (lang: "de" | "en") => (stream: StreamWithAlternatives) => {
    const { activity, ...rest } = stream;
    const { name, name_en, ...restActivity } = activity;
    return {
      ...rest,
      activity: {
        ...restActivity,
        name: lang === "de" || !name_en ? name : name_en,
      },
    } as Stream;
  };

export const translateStreams =
  (lang: "de" | "en") => (streams: StreamWithAlternatives[]) =>
    streams.filter((stream) => stream.activity).map(translateStream(lang));

export const useStreams = (
  minEndTimestamp?: string,
  maxEndTimestamp?: string,
  lang: "de" | "en" = "de",
  { filter, limit, refetchInterval }: UseStreamsOptions = {}
) => {
  return useQuery({
    queryKey: [
      "streams",
      minEndTimestamp,
      maxEndTimestamp,
      lang,
      filter,
      limit,
    ],
    queryFn: async () => {
      const minFilter = minEndTimestamp
        ? `&filter[_and][0][end][_gt]=${minEndTimestamp}`
        : "";
      const maxFilter = maxEndTimestamp
        ? `&filter[_and][1][end][_lte]=${maxEndTimestamp}`
        : "";
      const upcomingFilter =
        filter === StreamFilter.UPCOMING
          ? `&filter[_and][2][start][_gt]=${getGermanTimestamp(-30 * 60)}`
          : "";
      const limitOption = limit ? `&limit=${limit}` : "";
      const { data } = await axios.get<{ data: StreamWithAlternatives[] }>(
        `${import.meta.env.VITE_API_BASE_URL}/items/timeslots?fields=id,start,end,language,activity.icon,activity.id,activity.name,activity.name_en,fellows.people_id.id,fellows.people_id.name,fellows.people_id.stream_link,streamer.id,streamer.stream_link,streamer.name&sort=start${minFilter}${maxFilter}${upcomingFilter}${limitOption}`
      );
      return data.data;
    },
    select: translateStreams(lang),
    refetchInterval,
    refetchIntervalInBackground: true,
  });
};
