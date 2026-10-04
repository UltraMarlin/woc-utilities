import { useEffect, useMemo, useRef, useState } from "react";
import cn from "classnames";

import {
  ChatDocumentMessage,
  useChatDocumentMessages,
} from "../../hooks/useChatDocumentMessages";

export type TextDocumentWidgetProps = {
  language?: "de" | "en";
  className?: string;
};

const randomIntInclusive = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getMessagesString = (messages: ChatDocumentMessage[] | undefined) => {
  if (!messages) return "";
  return [...messages]
    .reverse()
    .map((message) => message.message)
    .join(" ");
};

export const TextDocumentWidget = ({
  language,
  className,
}: TextDocumentWidgetProps) => {
  const [skipAnimation, setSkipAnimation] = useState(true);
  const [visibleDocumentText, setVisibleDocumentText] = useState("");
  const animationIntervalId = useRef<ReturnType<typeof setInterval>>(undefined);

  const { data: messages } = useChatDocumentMessages();

  const documentText = useMemo(() => getMessagesString(messages), [messages]);

  if (
    visibleDocumentText !== documentText &&
    (skipAnimation || visibleDocumentText.length >= documentText.length)
  ) {
    setVisibleDocumentText(documentText);
  }

  useEffect(() => {
    const id = setTimeout(() => setSkipAnimation(false), 5 * 1000);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (skipAnimation || visibleDocumentText.length >= documentText.length)
      return;

    animationIntervalId.current = setInterval(
      () => {
        setVisibleDocumentText((prev) => {
          const nextChar = documentText[prev.length];
          if (nextChar) return prev + nextChar;
          else return prev;
        });
      },
      randomIntInclusive(50, 180)
    );

    return () => {
      if (animationIntervalId.current === null) return;
      clearInterval(animationIntervalId.current);
    };
  }, [visibleDocumentText, documentText, skipAnimation]);

  const helperText =
    language === "en"
      ? "Use !txt in chat to write your message!"
      : "Schreibe deine Nachricht mit !txt im Chat!";

  return (
    <div className={cn("flex h-full flex-col items-start", className)}>
      <div className="mt-2 flex w-full flex-col overflow-hidden">
        <div className="mb-4 border-y-[3px] border-[#d7d4ff] pb-1.5 pt-2 text-center text-[#d7d4ff]">
          {helperText}
        </div>
        <div className="flex max-w-[488px] flex-col-reverse overflow-hidden pb-3 text-base/7 text-[#d7d4ff]">
          <div>
            <span>{visibleDocumentText}</span>
            <span className="inline-flex pl-0.5">
              <span className="h-5 translate-y-0.5 animate-blink border-current" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
