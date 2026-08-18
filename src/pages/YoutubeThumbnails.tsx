import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { PageContainer } from "../components/PageContainer";
import {
  DEFAULT_FONT_SIZE,
  DEFAULT_FREE_TEXT_X,
  DEFAULT_FREE_TEXT_Y,
  THUMBNAIL_HEIGHT,
  THUMBNAIL_WIDTH,
  ThumbnailLayout,
  ThumbnailLayoutProps,
} from "../components/ThumbnailLayout";
import { DownloadWrapper } from "../components/DownloadWrapper";
import { RangeSlider } from "../components/RangeSlider";
import { usePersistentState } from "../utils/usePersistentState";
import { lowerSanitize } from "../utils/formatting/sanitize";

const MIN_FONTSIZE = 20;
const MAX_FONTSIZE = 200;

const DEFAULTS = {
  game: "SPIEL",
  gameFontSize: DEFAULT_FONT_SIZE,
  streamer: "STREAMER*IN",
  streamerFontSize: DEFAULT_FONT_SIZE,
  freeText: "",
  freeTextFontSize: DEFAULT_FONT_SIZE,
  freeTextX: DEFAULT_FREE_TEXT_X,
  freeTextY: DEFAULT_FREE_TEXT_Y,
  freeTextShadow: false,
};

const clampFontSize = (size: number) =>
  Math.min(Math.max(size, MIN_FONTSIZE), MAX_FONTSIZE);

const parsePosition = (value: string, max: number) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return 0;
  return Math.round(Math.min(Math.max(parsed, 0), max));
};

export const YoutubeThumbnails = () => {
  const [renderedLayoutKey, setRenderedLayoutKey] = useState<string | null>(
    null
  );
  const [resetPending, setResetPending] = useState(false);
  const [background, setBackground] = useState("");
  const [game, setGame] = usePersistentState("thumbnail.game", DEFAULTS.game);
  const [gameFontSize, setGameFontSize] = usePersistentState(
    "thumbnail.gameFontSize",
    DEFAULTS.gameFontSize
  );
  const [streamer, setStreamer] = usePersistentState(
    "thumbnail.streamer",
    DEFAULTS.streamer
  );
  const [streamerFontSize, setStreamerFontSize] = usePersistentState(
    "thumbnail.streamerFontSize",
    DEFAULTS.streamerFontSize
  );
  const [freeText, setFreeText] = usePersistentState(
    "thumbnail.freeText",
    DEFAULTS.freeText
  );
  const [freeTextFontSize, setFreeTextFontSize] = usePersistentState(
    "thumbnail.freeTextFontSize",
    DEFAULTS.freeTextFontSize
  );
  const [freeTextX, setFreeTextX] = usePersistentState(
    "thumbnail.freeTextX",
    DEFAULTS.freeTextX
  );
  const [freeTextY, setFreeTextY] = usePersistentState(
    "thumbnail.freeTextY",
    DEFAULTS.freeTextY
  );
  const [freeTextShadow, setFreeTextShadow] = usePersistentState(
    "thumbnail.freeTextShadow",
    DEFAULTS.freeTextShadow
  );

  const thumbnailLayoutProps: ThumbnailLayoutProps = {
    game,
    gameFontSize,
    streamer,
    streamerFontSize,
    backgroundSrc: background,
    freeText,
    freeTextFontSize,
    freeTextX,
    freeTextY,
    freeTextShadow,
  };

  const layoutKey = JSON.stringify(thumbnailLayoutProps);
  const downloadActive = renderedLayoutKey === layoutKey;

  const toggleDownloadActive = () => {
    setRenderedLayoutKey(downloadActive ? null : layoutKey);
  };

  const backgroundUrlRef = useRef("");
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const updateBackground = useCallback((url: string) => {
    if (backgroundUrlRef.current) URL.revokeObjectURL(backgroundUrlRef.current);
    backgroundUrlRef.current = url;
    setBackground(url);
  }, []);

  useEffect(
    () => () => {
      if (backgroundUrlRef.current)
        URL.revokeObjectURL(backgroundUrlRef.current);
    },
    []
  );

  const handleReset = () => {
    if (!resetPending) {
      setResetPending(true);
      return;
    }
    setGame(DEFAULTS.game);
    setGameFontSize(DEFAULTS.gameFontSize);
    setStreamer(DEFAULTS.streamer);
    setStreamerFontSize(DEFAULTS.streamerFontSize);
    setFreeText(DEFAULTS.freeText);
    setFreeTextFontSize(DEFAULTS.freeTextFontSize);
    setFreeTextX(DEFAULTS.freeTextX);
    setFreeTextY(DEFAULTS.freeTextY);
    setFreeTextShadow(DEFAULTS.freeTextShadow);
    updateBackground("");
    if (backgroundInputRef.current) backgroundInputRef.current.value = "";
    setRenderedLayoutKey(null);
    setResetPending(false);
  };

  const handleBackgroundUpdate: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    updateBackground(URL.createObjectURL(file));
  };

  const handleGameFontSizeScroll = useCallback(
    (delta: number) => {
      setGameFontSize((prev) => clampFontSize(prev + delta));
    },
    [setGameFontSize]
  );

  const handleStreamerFontSizeScroll = useCallback(
    (delta: number) => {
      setStreamerFontSize((prev) => clampFontSize(prev + delta));
    },
    [setStreamerFontSize]
  );

  const handleFreeTextFontSizeScroll = useCallback(
    (delta: number) => {
      setFreeTextFontSize((prev) => clampFontSize(prev + delta));
    },
    [setFreeTextFontSize]
  );

  const handleFreeTextMove = useCallback(
    (x: number, y: number) => {
      setFreeTextX(x);
      setFreeTextY(y);
    },
    [setFreeTextX, setFreeTextY]
  );

  return (
    <PageContainer>
      <div className="mb-4 flex max-w-[1600px] flex-col gap-2 rounded bg-neutral-700 px-3 py-2 text-sm text-white">
        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          <label className="flex min-w-48 max-w-[400px] flex-1 cursor-pointer flex-col">
            <span>Game</span>
            <input
              type="text"
              className="text-base text-black"
              name="game"
              value={game}
              onChange={(event) => setGame(event.target.value)}
            />
          </label>
          <RangeSlider
            className="min-w-40 max-w-[400px] flex-1"
            onChange={setGameFontSize}
            value={gameFontSize}
            min={MIN_FONTSIZE}
            max={MAX_FONTSIZE}
          >
            Font Size
          </RangeSlider>
          <div className="max-w-[16rem] opacity-80">
            Hover the texts in the preview and use mousewheel to change size
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          <label className="flex min-w-48 max-w-[400px] flex-1 cursor-pointer flex-col">
            <span>Streamer</span>
            <input
              type="text"
              className="text-base text-black"
              name="streamer"
              value={streamer}
              onChange={(event) => setStreamer(event.target.value)}
            />
          </label>
          <RangeSlider
            className="min-w-40 max-w-[400px] flex-1"
            onChange={setStreamerFontSize}
            value={streamerFontSize}
            min={MIN_FONTSIZE}
            max={MAX_FONTSIZE}
          >
            Font Size
          </RangeSlider>
        </div>
        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          <label className="flex min-w-48 max-w-[400px] flex-1 cursor-pointer flex-col">
            <span>Free Text (optional)</span>
            <input
              type="text"
              className="text-base text-black"
              name="freeText"
              value={freeText}
              onChange={(event) => setFreeText(event.target.value)}
            />
          </label>
          <RangeSlider
            className="min-w-40 max-w-[400px] flex-1"
            onChange={setFreeTextFontSize}
            value={freeTextFontSize}
            min={MIN_FONTSIZE}
            max={MAX_FONTSIZE}
          >
            Font Size
          </RangeSlider>
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="checkbox"
              className="cursor-pointer"
              checked={freeTextShadow}
              onChange={(event) => setFreeTextShadow(event.target.checked)}
            />
            <span>Shadow</span>
          </label>
          <label className="flex cursor-pointer flex-col">
            <span>X in px</span>
            <input
              type="number"
              min={0}
              max={THUMBNAIL_WIDTH}
              className="w-18 text-base text-black"
              value={freeTextX}
              onChange={(event) =>
                setFreeTextX(parsePosition(event.target.value, THUMBNAIL_WIDTH))
              }
            />
          </label>
          <label className="flex cursor-pointer flex-col">
            <span>Y in px</span>
            <input
              type="number"
              min={0}
              max={THUMBNAIL_HEIGHT}
              className="w-18 text-base text-black"
              value={freeTextY}
              onChange={(event) =>
                setFreeTextY(
                  parsePosition(event.target.value, THUMBNAIL_HEIGHT)
                )
              }
            />
          </label>
          <div className="max-w-[20rem] opacity-80">
            Drag & drop the Free Text to move it around
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          <label className="mr-auto flex w-fit max-w-[400px] cursor-pointer flex-col">
            <span>Background</span>
            <input
              ref={backgroundInputRef}
              type="file"
              accept="image/png, image/jpeg"
              name="background"
              className="max-w-full cursor-pointer"
              onChange={handleBackgroundUpdate}
            />
          </label>
          <button
            type="button"
            className={
              resetPending
                ? "w-fit rounded border border-red-800 bg-red-800 px-2 py-0.5 font-semibold text-white"
                : "w-fit rounded border px-2 py-0.5"
            }
            onClick={handleReset}
            onBlur={() => setResetPending(false)}
          >
            {resetPending ? "Really Reset?" : "Reset all"}
          </button>
          <button
            type="button"
            className="w-fit rounded border px-2 py-0.5"
            onClick={toggleDownloadActive}
          >
            {downloadActive ? "Edit Thumbnail" : "Render Thumbnail"}
          </button>
        </div>
      </div>
      <div className="overflow-scroll">
        {downloadActive ? (
          <DownloadWrapper
            className="aspect-video w-[1600px]"
            fileBaseName={`thumbnail${game ? "_" + lowerSanitize(game) : ""}`}
            downloadPosition="top-left"
          >
            {({ onLoad }) => (
              <ThumbnailLayout onLoad={onLoad} {...thumbnailLayoutProps} />
            )}
          </DownloadWrapper>
        ) : (
          <ThumbnailLayout
            {...thumbnailLayoutProps}
            onFreeTextMove={handleFreeTextMove}
            onGameFontSizeScroll={handleGameFontSizeScroll}
            onStreamerFontSizeScroll={handleStreamerFontSizeScroll}
            onFreeTextFontSizeScroll={handleFreeTextFontSizeScroll}
          />
        )}
      </div>
    </PageContainer>
  );
};
