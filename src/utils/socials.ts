export const availableSocials = [
  "Bluesky",
  "Twitter",
  "Mastodon",
  "Twitch",
  "Instagram",
] as const;
export type SocialPlatform = (typeof availableSocials)[number];

export type SocialsOption = {
  platform: SocialPlatform;
  link: string;
};
