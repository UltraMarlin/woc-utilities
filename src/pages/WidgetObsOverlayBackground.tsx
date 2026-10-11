import cn from "classnames";
import { useSearchParams } from "react-router-dom";

import { getTheme } from "../utils/layout/getTheme";

import lightBackgroundAnimation from "../assets/layout/Animation BG Light_1.webm";
import darkBackgroundAnimation from "../assets/layout/Animation Dark BG_1.webm";

const cutout =
  "path('M 0 0 L 0 1080 L 1920 1080 L 1920 902 L 324 902 L 324 -1 Z')";

const CLIP_PATH_ENABLED = true;

export const WidgetObsOverlayBackground = () => {
  const [searchParams] = useSearchParams();
  const theme = searchParams.get("theme");
  const noThemeSelected = theme === null || theme === "";
  const validTheme = getTheme(theme);
  const fullBg = searchParams.get("full");

  return (
    <>
      <div
        className={cn(
          "grid h-[1080px] w-[1920px] overflow-hidden *:col-start-1 *:row-start-1",
          {
            grayscale: noThemeSelected,
            "bg-yellow26": theme === "light",
            "bg-purpleDark26": theme === "dark",
          }
        )}
        style={{
          clipPath: CLIP_PATH_ENABLED && fullBg === null ? cutout : undefined,
        }}
      >
        <video
          src={
            validTheme === "light"
              ? lightBackgroundAnimation
              : darkBackgroundAnimation
          }
          autoPlay
          muted
          loop
          width={1920}
          height={1080}
        />
      </div>
      {noThemeSelected && (
        <div className="absolute right-[5px] top-[5px] z-10 max-w-[520px] bg-[#990000] px-4 py-2 font-sans text-xl font-semibold text-white">
          No theme provided on the{" "}
          <span className="font-black">Layout Background</span>. Please provide
          your preferred theme by adding &theme=light or &theme=dark to the
          layout URL.
        </div>
      )}
    </>
  );
};
