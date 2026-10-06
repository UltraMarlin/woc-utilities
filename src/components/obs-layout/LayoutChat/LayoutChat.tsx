import cn from "classnames";

import { useTwitchChat } from "../../../hooks/useTwitchChat";
import { useThirdPartyEmotes } from "../../../hooks/useThirdPartyEmotes";
import { useMessageStack } from "./useMessageStack";
import { LayoutChatMessage } from "./LayoutChatMessage";
import { LayoutChatPopParticles } from "./LayoutChatPopParticles";

export type LayoutChatProps = {
  channel: string;
  theme: "light" | "dark";
  className?: string;
};

export const LayoutChat = ({ channel, theme, className }: LayoutChatProps) => {
  const { messages, channelId, dismissMessage } = useTwitchChat(channel);
  const emotes = useThirdPartyEmotes(channelId);
  const { listRef, pops } = useMessageStack(messages, dismissMessage);

  return (
    <div className={cn("overflow-hidden text-[16px] text-white", className)}>
      <ul
        ref={listRef}
        className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 px-2 pb-3"
      >
        {messages.map((message) => (
          <li key={message.id}>
            <LayoutChatMessage
              message={message}
              emotes={emotes}
              theme={theme}
              isPopping={pops.some((pop) => pop.id === message.id)}
            />
          </li>
        ))}
      </ul>
      {pops.map((pop) => (
        <LayoutChatPopParticles key={pop.id} pop={pop} />
      ))}
    </div>
  );
};
