import { useCallback, useEffect, useState } from "react";
import {
  ChatClient,
  ChatMessage,
  LogLevel,
  ParsedMessagePart,
  parseChatMessage,
} from "@twurple/chat";

// Safety cap only: the chat view dismisses messages long before this.
const MAX_MESSAGES = 20;

export type TwitchChatBadge = "broadcaster" | "moderator" | "vip";

export type TwitchChatMessage = {
  id: string;
  userId: string;
  displayName: string;
  color: string | undefined;
  badges: TwitchChatBadge[];
  isAction: boolean;
  parts: ParsedMessagePart[];
};

const toTwitchChatMessage = (
  text: string,
  msg: ChatMessage,
  isAction: boolean
): TwitchChatMessage => {
  const { userId, displayName, color, isBroadcaster, isMod, isVip } =
    msg.userInfo;
  const badges: TwitchChatBadge[] = [];
  if (isBroadcaster) badges.push("broadcaster");
  if (isMod) badges.push("moderator");
  if (isVip) badges.push("vip");

  return {
    id: msg.id,
    userId,
    displayName,
    color,
    badges,
    isAction,
    parts: parseChatMessage(text, msg.emoteOffsets),
  };
};

export const useTwitchChat = (channel: string) => {
  const [messages, setMessages] = useState<TwitchChatMessage[]>([]);
  const [channelId, setChannelId] = useState<string>();

  const dismissMessage = useCallback(
    (id: string) =>
      setMessages((previous) =>
        previous.filter((message) => message.id !== id)
      ),
    []
  );

  useEffect(() => {
    const client = new ChatClient({
      channels: [channel],
      logger: { minLevel: LogLevel.ERROR },
    });

    const addMessage = (text: string, msg: ChatMessage, isAction: boolean) => {
      if (msg.channelId) setChannelId(msg.channelId);
      setMessages((previous) => [
        ...previous.slice(-(MAX_MESSAGES - 1)),
        toTwitchChatMessage(text, msg, isAction),
      ]);
    };
    const removeUserMessages = (userId: string | null) =>
      setMessages((previous) =>
        previous.filter((message) => message.userId !== userId)
      );

    client.onMessage((_, __, text, msg) => addMessage(text, msg, false));
    client.onAction((_, __, text, msg) => addMessage(text, msg, true));
    client.onMessageRemove((_, messageId) => dismissMessage(messageId));
    client.onTimeout((_, __, ___, msg) => removeUserMessages(msg.targetUserId));
    client.onBan((_, __, msg) => removeUserMessages(msg.targetUserId));
    client.onChatClear(() => setMessages([]));

    client.connect();

    return () => client.quit();
  }, [channel, dismissMessage]);

  return { messages, channelId, dismissMessage };
};
