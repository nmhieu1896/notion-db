import type { Config } from "tailwindcss";
import { green, orange, red, blue, neutral } from "./tw.config/color";
import { sizes } from "./tw.config/font";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppin: ["Poppins", "sans-serif"],
      },
      fontWeight: {
        bold: "500",
        regular: "400",
      },
      lineHeight: {
        ...sizes,
      },
      fontSize: {
        ...sizes,
        tableCell: [sizes["14"], { fontWeight: "400", lineHeight: sizes["24"] }],
        tableHead: [sizes["14"], { fontWeight: "400", lineHeight: sizes["24"] }],
      },
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
        borderColor: {
          DEFAULT: neutral["400"],
        },
        mainBg: {
          DEFAULT: neutral["100"],
        },
        notionBg: {
          default: "rgba(227, 226, 224, 0.5)",
          gray: "rgb(227, 226, 224)",
          brown: "rgb(238, 224, 218)",
          orange: "rgb(250, 222, 201)",
          yellow: "rgb(249, 228, 188)",
          green: "rgb(219, 237, 219)",
          blue: "rgb(211, 229, 239)",
          purple: "rgb(232, 222, 238)",
          pink: "rgb(245, 224, 233)",
          red: "rgb(244, 192, 197)",
        },
        notionRichText: {
          default: neutral["1000"],
          gray: "rgb(120, 119, 116)",
          brown: "rgb(159, 107, 83)",
          orange: "rgb(217, 115, 13)",
          yellow: "rgb(203, 145, 47)",
          green: "rgb(68, 131, 97)",
          blue: "rgb(51, 126, 169)",
          purple: "rgb(144, 101, 176)",
          pink: "rgb(193, 76, 138)",
          red: "rgb(212, 76, 71)",
        },
        text: {
          primary: neutral["1000"],
          secondary: neutral["800"],
          tertiary: neutral["600"],
          hightlight: blue["600"],
        },
      },
      boxShadow: {
        popover: "0px 0px 2px 1px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
