import cn from "classnames";
import { PointerEventHandler, useEffect, useRef, useState } from "react";
import { DownloadableComponentProps } from "./DownloadWrapper";
import shape from "../assets/images/thumbnail-shape.png";
import { useFontSizeScroll } from "../utils/useFontSizeScroll";

export const THUMBNAIL_WIDTH = 1600;
export const THUMBNAIL_HEIGHT = 900;

export const DEFAULT_FONT_SIZE = 72;
export const DEFAULT_FREE_TEXT_X = THUMBNAIL_WIDTH / 2;
export const DEFAULT_FREE_TEXT_Y = THUMBNAIL_HEIGHT / 4;

const EDITABLE_OUTLINE =
  "pointer-events-auto hover:outline hover:outline-2 hover:outline-red-500";

const clamp = (value: number, max: number) =>
  Math.round(Math.min(Math.max(value, 0), max));

export type ThumbnailLayoutProps = DownloadableComponentProps & {
  game?: string;
  gameFontSize?: number;
  streamer?: string;
  streamerFontSize?: number;
  backgroundSrc?: string;
  freeText?: string;
  freeTextFontSize?: number;
  freeTextX?: number;
  freeTextY?: number;
  freeTextShadow?: boolean;
  onFreeTextMove?: (x: number, y: number) => void;
  onGameFontSizeScroll?: (delta: number) => void;
  onStreamerFontSizeScroll?: (delta: number) => void;
  onFreeTextFontSizeScroll?: (delta: number) => void;
};

export const ThumbnailLayout = ({
  onLoad,
  hotReload = false,
  game,
  gameFontSize,
  streamer,
  streamerFontSize,
  backgroundSrc,
  freeText,
  freeTextFontSize = DEFAULT_FONT_SIZE,
  freeTextX = DEFAULT_FREE_TEXT_X,
  freeTextY = DEFAULT_FREE_TEXT_Y,
  freeTextShadow = false,
  onFreeTextMove,
  onGameFontSizeScroll,
  onStreamerFontSizeScroll,
  onFreeTextFontSizeScroll,
}: ThumbnailLayoutProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const gameRef = useFontSizeScroll(onGameFontSizeScroll);
  const streamerRef = useFontSizeScroll(onStreamerFontSizeScroll);
  const freeTextRef = useFontSizeScroll(onFreeTextFontSizeScroll);

  const grabOffsetRef = useRef({ x: 0, y: 0 });
  const pointerPositionRef = useRef<{ x: number; y: number } | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    onLoad?.();
  }, [onLoad]);

  useEffect(() => {
    if (hotReload) onLoad?.();
  });

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    []
  );

  const toThumbnailCoordinates = (
    clientX: number,
    clientY: number,
    bounds: DOMRect
  ) => ({
    x: ((clientX - bounds.left) / bounds.width) * THUMBNAIL_WIDTH,
    y: ((clientY - bounds.top) / bounds.height) * THUMBNAIL_HEIGHT,
  });

  const handlePointerDown: PointerEventHandler<HTMLSpanElement> = (event) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!onFreeTextMove || !bounds) return;
    const pointer = toThumbnailCoordinates(
      event.clientX,
      event.clientY,
      bounds
    );
    grabOffsetRef.current = {
      x: freeTextX - pointer.x,
      y: freeTextY - pointer.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const handlePointerUp: PointerEventHandler<HTMLSpanElement> = () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    pointerPositionRef.current = null;
    setDragging(false);
  };

  const applyPointerPosition = () => {
    frameRef.current = null;
    const pointer = pointerPositionRef.current;
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!pointer || !bounds || !onFreeTextMove) return;
    const { x, y } = toThumbnailCoordinates(pointer.x, pointer.y, bounds);
    const offset = grabOffsetRef.current;
    onFreeTextMove(
      clamp(x + offset.x, THUMBNAIL_WIDTH),
      clamp(y + offset.y, THUMBNAIL_HEIGHT)
    );
  };

  const handlePointerMove: PointerEventHandler<HTMLSpanElement> = (event) => {
    if (
      !onFreeTextMove ||
      !event.currentTarget.hasPointerCapture(event.pointerId)
    )
      return;
    pointerPositionRef.current = { x: event.clientX, y: event.clientY };
    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(applyPointerPosition);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none relative aspect-video w-[1600px] text-white",
        {
          "checker-board": !backgroundSrc,
        }
      )}
    >
      {backgroundSrc && (
        <div
          className="size-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundSrc})`,
          }}
        />
      )}
      <img src={shape} alt="" className="absolute left-0 top-0 size-full" />
      <div className="absolute bottom-7 left-[32px] flex flex-col p-3 font-smash leading-[1.1]">
        <span
          ref={gameRef}
          className={cn("w-fit select-none", {
            [EDITABLE_OUTLINE]: !!onGameFontSizeScroll,
          })}
          style={{ fontSize: `${gameFontSize}px` }}
        >
          {game?.toUpperCase()}
        </span>
        <span
          ref={streamerRef}
          className={cn("w-fit select-none", {
            [EDITABLE_OUTLINE]: !!onStreamerFontSizeScroll,
          })}
          style={{ fontSize: `${streamerFontSize}px` }}
        >
          {streamer?.toUpperCase()}
        </span>
      </div>
      {freeText && (
        <span
          ref={freeTextRef}
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 select-none whitespace-pre font-smash leading-[1.1]",
            {
              [EDITABLE_OUTLINE]:
                !!onFreeTextMove || !!onFreeTextFontSizeScroll,
              "cursor-move": !!onFreeTextMove,
              "yt-thumbnail-free-text-shadow": freeTextShadow,
              "outline outline-2 outline-red-500": dragging,
            }
          )}
          style={{
            left: `${(freeTextX / THUMBNAIL_WIDTH) * 100}%`,
            top: `${(freeTextY / THUMBNAIL_HEIGHT) * 100}%`,
            fontSize: `${freeTextFontSize}px`,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {freeText}
        </span>
      )}
    </div>
  );
};
