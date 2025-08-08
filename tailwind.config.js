/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["DePixelHalbfett", "sans-serif"],
        standard: ["Carlito"],
        ubuntu: ["Ubuntu"],
        explorer: ["Explorer"],
        lilita: ["Lilita One"],
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
      },
      dropShadow: {
        "layout-dark": "4px 4px 0 #150477",
      },
    },
  },
  plugins: [],
};
