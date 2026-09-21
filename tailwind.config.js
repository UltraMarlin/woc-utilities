import plugin from "tailwindcss/plugin";
import flattenColorPaletteImport from "tailwindcss/lib/util/flattenColorPalette";

const flattenColorPalette =
  flattenColorPaletteImport.default ?? flattenColorPaletteImport;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        standard: ["Carlito"],
        ubuntu: ["Ubuntu"],
        explorer: ["Explorer", "Pally", "sans-serif"],
        lilita: ["Lilita One"],
        bubbly: ["Bubbly"],
        pally: ["Pally", "sans-serif"],
        exo: ["Exo2", "sans-serif"],
        smash: ["cc-smash", "sans-serif"],
        "smash-open": ["cc-smash-open", "sans-serif"],
      },
      colors: {
        night: {
          highlight: "#ACE1B2",
          background: "#00141E",
        },
        day: {
          highlight: "#203737",
          background: "#E1DFAC",
        },
        yellow26: "#e8cb56",
        purpleShadow26: "#472457",
        purpleAccent26: "#4f1f66",
        purpleLight26: "#68438c",
      },
      dropShadow: {
        "layout-dark": "4px 4px 0 #150477",
      },
      keyframes: {
        bgGoalsWidgetOverlay: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "1270px 0" }, // 635 * 2
        },
        blink: {
          "0%": { "border-right-width": "3px" },
          "50%": { "border-right-width": "0px" },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(-4px)",
            "animation-timing-function": "cubic-bezier(0.7,0,1,1)",
          },
          "50%": {
            transform: "translateY(0px)",
            "animation-timing-function": "cubic-bezier(0,0,0.2,1)",
          },
        },
        donationAlert: {
          "0%, 100%": {
            transform: "scale(1)",
            "animation-timing-function": "cubic-bezier(0.8,0,1,1)",
          },
          "50%": {
            transform: "scale(0.95)",
            "animation-timing-function": "cubic-bezier(0,0,0.2,1)",
          },
        },
        scrollX: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(var(--max-scroll-x), 0)" },
        },
        scrollY: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(0, var(--max-scroll-y))" },
        },
      },
      animation: {
        bgGoalsWidgetOverlay: "bgGoalsWidgetOverlay 10s linear infinite",
        blink: "blink step-end infinite 1.25s",
        donationAlert: "donationAlert infinite 1920ms",
        float: "float infinite ease-in 3s",
        scrollX: "scrollX 10s cubic-bezier(0.37, 0, 0.63, 1) infinite",
        scrollY: "scrollY 30s ease-in-out infinite",
      },
    },
  },
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "smash-shadow": (value) => ({
            "--smash-shadow-color": value,
          }),
        },
        { values: flattenColorPalette(theme("colors")), type: "color" }
      );
    }),
  ],
};
