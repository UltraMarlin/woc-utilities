import { useQueries } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";

export type EmoteMap = Map<string, string>;

type EmoteEntry = [code: string, url: string];

type BttvEmote = { id: string; code: string };
type FfzEmote = { code: string; images: Record<string, string> };
type SevenTvEmote = { id: string; name: string; data: { flags: number } };

const SEVEN_TV_ZERO_WIDTH_FLAG = 256;

const toBttvEntries = (emotes: BttvEmote[]): EmoteEntry[] =>
  emotes.map(({ id, code }) => [
    code,
    `https://cdn.betterttv.net/emote/${id}/2x`,
  ]);

const toFfzEntries = (emotes: FfzEmote[]): EmoteEntry[] =>
  emotes.map(({ code, images }) => [code, images["2x"] ?? images["1x"]]);

const toSevenTvEntries = (emotes: SevenTvEmote[]): EmoteEntry[] =>
  emotes
    .filter(({ data }) => !(data.flags & SEVEN_TV_ZERO_WIDTH_FLAG))
    .map(({ id, name }) => [name, `https://cdn.7tv.app/emote/${id}/2x.webp`]);

const fetchEmotes = async <T>(
  url: string,
  toEntries: (data: T) => EmoteEntry[]
) => {
  try {
    const { data } = await axios.get<T>(url);
    return toEntries(data);
  } catch (error) {
    const channelHasNoAccount =
      isAxiosError(error) && error.response?.status === 404;
    if (channelHasNoAccount) return [];
    throw error;
  }
};

const emoteQuery = <T>(url: string, toEntries: (data: T) => EmoteEntry[]) => ({
  queryKey: ["thirdPartyEmotes", url],
  queryFn: () => fetchEmotes(url, toEntries),
  staleTime: Infinity,
  retry: 5,
  refetchOnWindowFocus: false,
});

const globalEmoteQueries = [
  emoteQuery(
    "https://api.betterttv.net/3/cached/frankerfacez/emotes/global",
    toFfzEntries
  ),
  emoteQuery("https://api.betterttv.net/3/cached/emotes/global", toBttvEntries),
  emoteQuery(
    "https://7tv.io/v3/emote-sets/global",
    (data: { emotes: SevenTvEmote[] }) => toSevenTvEntries(data.emotes)
  ),
];

const getChannelEmoteQueries = (channelId: string) => [
  emoteQuery(
    `https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${channelId}`,
    toFfzEntries
  ),
  emoteQuery(
    `https://api.betterttv.net/3/cached/users/twitch/${channelId}`,
    (data: { channelEmotes: BttvEmote[]; sharedEmotes: BttvEmote[] }) =>
      toBttvEntries([...data.channelEmotes, ...data.sharedEmotes])
  ),
  emoteQuery(
    `https://7tv.io/v3/users/twitch/${channelId}`,
    (data: { emote_set: { emotes: SevenTvEmote[] | null } | null }) =>
      toSevenTvEntries(data.emote_set?.emotes ?? [])
  ),
];

const toEmoteMap = (results: { data?: EmoteEntry[] }[]): EmoteMap =>
  new Map(results.flatMap(({ data }) => data ?? []));

export const useThirdPartyEmotes = (channelId: string | undefined) =>
  useQueries({
    queries: [
      ...globalEmoteQueries,
      ...(channelId ? getChannelEmoteQueries(channelId) : []),
    ],
    combine: toEmoteMap,
  });
