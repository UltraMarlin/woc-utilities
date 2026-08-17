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
        pixel: ["DePixelHalbfett", "sans-serif"],
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
        schedule25: {
          light: "#FFF0F4",
          dark: "#150477",
        },
        yellow26: "#e8cb56",
        purpleShadow26: "#472457",
        purpleAccent26: "#4f1f66",
      },
      dropShadow: {
        "layout-dark": "4px 4px 0 #150477",
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
        { values: flattenColorPalette(theme("colors")), type: "color" },
      );
    }),
  ],
};
