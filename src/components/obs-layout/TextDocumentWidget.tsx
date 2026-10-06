import { useEffect, useMemo, useRef, useState } from "react";
import cn from "classnames";

import {
  ChatDocumentMessage,
  useChatDocumentMessages,
} from "../../hooks/useChatDocumentMessages";
import chessterGif1 from "../../assets/layout/donation_alert/Chesster_Animation_01.gif";
import chessterGif5 from "../../assets/layout/donation_alert/Chesster_Animation_05.gif";
import chessterGif3 from "../../assets/layout/donation_alert/Chesster_Animation_03.gif";

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
    <div
      className={cn(
        "flex h-full flex-col items-start p-2 pb-1 text-[15px]/[1.14]",
        className
      )}
    >
      <div className="mt-4 flex h-[386px] w-full flex-col overflow-hidden rounded-lg bg-gradient-to-b from-purpleAccent26 to-purpleLight26 px-3.5 py-2.5 font-normal tracking-wider">
        <div className="flex flex-col-reverse overflow-hidden pb-1">
          <div>
            <span>{visibleDocumentText}</span>
            <span className="inline-flex h-[0.8lh] pl-0.5">
              <span className="translate-y-0.5 animate-blink border-current" />
            </span>
          </div>
        </div>
      </div>
      <div className="-mt-4 flex h-[102px] w-full items-end justify-between px-2 pb-1">
        <img className="h-[94px] object-contain" src={chessterGif5} alt="" />
        <img
          className="mb-2 h-[100px] object-contain"
          src={chessterGif1}
          alt=""
        />
        <img className="h-[100px] object-contain" src={chessterGif3} alt="" />
      </div>
      <div className="w-full rounded bg-purpleLight26 text-center text-sm/[1.6] font-semibold uppercase italic tracking-wider">
        {helperText}
      </div>
    </div>
  );
};
