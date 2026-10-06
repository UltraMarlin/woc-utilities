import cn from "classnames";

import type {
  TwitchChatBadge,
  TwitchChatMessage,
} from "../../../hooks/useTwitchChat";
import type { EmoteMap } from "../../../hooks/useThirdPartyEmotes";
import { LayoutChatMessageText } from "./LayoutChatMessageText";

import messageBox from "../../../assets/layout/chat/message-box.svg";
import broadcasterBadge from "../../../assets/layout/chat/badge-broadcaster.png";
import moderatorBadge from "../../../assets/layout/chat/badge-moderator.png";
import vipBadge from "../../../assets/layout/chat/badge-vip.png";

const FALLBACK_NAME_COLOR = "#ffc400";

const BADGES: Record<TwitchChatBadge, string> = {
  broadcaster: broadcasterBadge,
  moderator: moderatorBadge,
  vip: vipBadge,
};

const getReadableNameColor = (color: string | undefined) =>
  color ? `oklch(from ${color} max(l, 0.75) c h)` : FALLBACK_NAME_COLOR;

export type LayoutChatMessageProps = {
  message: TwitchChatMessage;
  emotes: EmoteMap;
  theme: "light" | "dark";
  isPopping: boolean;
};

export const LayoutChatMessage = ({
  message,
  emotes,
  theme,
  isPopping,
}: LayoutChatMessageProps) => {
  const nameColor = getReadableNameColor(message.color);

  return (
    <div
      className={cn(
        "relative break-words px-3.5 py-2",
        isPopping ? "animate-chatMessagePop" : "animate-chatMessageSpawn"
      )}
    >
      <div
        className={cn(
          "absolute inset-px rounded-[19px]",
          theme === "dark" ? "bg-purpleAccent26/90" : "bg-purpleAccent26/95"
        )}
      />
      <div className="relative">
        <div className="mb-1 font-bold leading-snug">
          {message.badges.map((badge) => (
            <img
              key={badge}
              className="mb-0.5 mr-1 inline-block h-[1.1em] align-middle"
              src={BADGES[badge]}
              alt=""
            />
          ))}
          <span style={{ color: nameColor }}>{message.displayName}</span>
        </div>
        <div
          className={cn("leading-tight", { italic: message.isAction })}
          style={message.isAction ? { color: nameColor } : undefined}
        >
          <LayoutChatMessageText parts={message.parts} emotes={emotes} />
        </div>
      </div>
      <div
        className="absolute inset-0 border-[20px] border-solid border-transparent"
        style={{ borderImage: `url("${messageBox}") 50 fill / 20px stretch` }}
      />
    </div>
  );
};
