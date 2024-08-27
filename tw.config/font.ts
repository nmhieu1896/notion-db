import type { Config } from "tailwindcss";
type Font = NonNullable<Config["theme"]>["fontSize"];
export const sizes = {
  "14": 14 / 16 + "rem",
  "16": 16 / 16 + "rem",
  "18": 18 / 16 + "rem",
  "20": 20 / 16 + "rem",
  "22": 22 / 16 + "rem",
  "24": 24 / 16 + "rem",
  "26": 26 / 16 + "rem",
  "28": 28 / 16 + "rem",
  "30": 30 / 16 + "rem",
  "32": 32 / 16 + "rem",
  "34": 34 / 16 + "rem",
} satisfies Font;
