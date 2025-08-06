import { Stream } from "../../hooks/useStreams";
import { formatShortTime } from "./time";

const formatTime = (stream: Stream) => {
  const start = new Date(stream.start);
  const end = new Date(stream.end);

  const startTime = formatShortTime(start);
  const endTime = formatShortTime(end);
  const startDate = start.toLocaleDateString("de", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `${startTime} - ${endTime}, am ${startDate}`;
};

const formatStreamLink = (streamLink: string) => {
  return `https://twitch.tv${streamLink.split("twitch.tv")[1]}`;
};

const getStreamerLinks = (stream: Stream) => {
  const hostLink = formatStreamLink(stream.streamer.stream_link);
  const fellowLinks = stream.fellows
    .map(
      (fellow) =>
        fellow.people_id.stream_link &&
        formatStreamLink(fellow.people_id.stream_link)
    )
    .filter(Boolean);
  if (fellowLinks.length === 0) return hostLink;

  return `${hostLink} (Host)\n${fellowLinks.join("\n")}`;
};

const getNonStreamerPlayers = (stream: Stream) => {
  return stream.fellows
    .map((fellow) => !fellow.people_id.stream_link && fellow.people_id.name)
    .filter(Boolean);
};

export const formatYTDescription = (stream: Stream) => {
  const additionalPlayers = getNonStreamerPlayers(stream);
  const additionalPlayersString =
    additionalPlayers.length > 0
      ? `\n\nMitspieler*innen:
${additionalPlayers.join("\n")}`
      : "";

  const content = `Das ist das VOD von ${formatTime(stream)} von ${stream.streamer.name}

Gespielte Spiele:
${stream.activity.name}

Links der Week of Charity (WoC):
Website: https://weekofcharity.de/

Socials: 
Twitter: https://x.com/WeekOfCharity
Instagram: https://www.instagram.com/weekofcharity/
Mastodon: https://tech.lgbt/@weekofcharity 
Bluesky: https://bsky.app/profile/chesster.weekofcharity.de
TikTok: https://www.tiktok.com/@weekofcharity

Streamer*innen:
${getStreamerLinks(stream)}${additionalPlayersString}
`;
  return content;
};
