/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["DePixelHalbfett", "sans-serif"],
      },
    },
  },
  plugins: [],
};
