export type LayoutChatEmoteProps = {
  name: string;
  url: string;
};

export const LayoutChatEmote = ({ name, url }: LayoutChatEmoteProps) => (
  <img
    className="mx-0.5 inline-block h-[1.5em] w-auto align-middle"
    src={url}
    alt={name}
  />
);
