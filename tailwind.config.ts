import type { Config } from "tailwindcss";
import { green, orange, red, blue, neutral } from "./tw.config/color";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neutral,
        green,
        orange,
        red,
        blue,
        info: {
          DEFAULT: blue["500"],
        },
        success: {
          DEFAULT: green["500"],
        },
        warning: {
          DEFAULT: orange["500"],
        },
        error: {
          DEFAULT: red["500"],
        },
        border: {
          DEFAULT: neutral["400"],
        },
        mainBg: {
          DEFAULT: neutral["100"],
        },
        notion: {
          default: "rgba(227, 226, 224, 0.5)",
          gray: "rgb(227, 226, 224)",
          brown: "rgb(238, 224, 218)",
          orange: "rgb(250, 222, 201)",
          yellow: "rgb(249, 228, 188)",
          green: "rgb(219, 237, 219)",
          blue: "rgb(211, 229, 239)",
          purple: "rgb(232, 222, 238)",
          pink: "rgb(245, 224, 233)",
          red: "rgb(255, 226, 221)",
        },
        text: {
          primary: neutral["1000"],
          secondary: neutral["800"],
          tertiary: neutral["600"],
          hightlight: blue["600"],
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
