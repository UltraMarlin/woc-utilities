import { Fragment } from "react";
import { buildEmoteImageUrl, ParsedMessagePart } from "@twurple/chat";

import type { EmoteMap } from "../../../hooks/useThirdPartyEmotes";
import { LayoutChatEmote } from "./LayoutChatEmote";

export type LayoutChatMessageTextProps = {
  parts: ParsedMessagePart[];
  emotes: EmoteMap;
};

export const LayoutChatMessageText = ({
  parts,
  emotes,
}: LayoutChatMessageTextProps) =>
  parts.map((part, partIndex) => {
    if (part.type === "emote") {
      return (
        <LayoutChatEmote
          key={partIndex}
          name={part.name}
          url={buildEmoteImageUrl(part.id, { size: "2.0" })}
        />
      );
    }
    if (part.type !== "text") return null;

    return (
      <Fragment key={partIndex}>
        {part.text.split(/(\s+)/).map((word, wordIndex) => {
          const url = emotes.get(word);
          return url ? (
            <LayoutChatEmote key={wordIndex} name={word} url={url} />
          ) : (
            word
          );
        })}
      </Fragment>
    );
  });
