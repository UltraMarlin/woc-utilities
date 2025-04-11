import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";

export type Stream = {
  id: number;
  start: string;
  end: string;
  activity: {
    id: number;
    icon: string;
    name: string;
  };
  language: StreamLanguage;
  streamer: {
    id: number;
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

export const useStreams = (
  minEndTimestamp: string,
  maxEndTimestamp: string,
  lang: "de" | "en" = "de"
) => {
  const rawQueryResult = useQuery({
    queryKey: ["streams", minEndTimestamp, maxEndTimestamp],
    queryFn: async () => {
      const { data } = await axios.get<{ data: StreamWithAlternatives[] }>(
        `${import.meta.env.VITE_API_BASE_URL}/items/timeslots?fields=id,start,end,language,activity.icon,activity.id,activity.name,activity.name_en,streamer.id,streamer.stream_link&sort=start` +
          `&filter[_and][0][end][_gt]=${minEndTimestamp}&filter[_and][1][end][_lte]=${maxEndTimestamp}`
      );
      return data.data;
    },
  });

  const translatedData = useMemo(() => {
    if (!rawQueryResult.data) return undefined;
    return rawQueryResult.data.map((dataEntry) => {
      const { activity, ...rest } = dataEntry;
      const { name, name_en, ...restActivity } = activity;
      return {
        ...rest,
        activity: {
          ...restActivity,
          name: lang === "de" || !name_en ? name : name_en,
        },
      } as Stream;
    });
  }, [lang, rawQueryResult.data]);

  return { ...rawQueryResult, data: translatedData };
};
