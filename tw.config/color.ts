type Color = Record<`${number}`, `#${string}`>;
export const neutral: Color = {
  100: "#f9fafb",
  200: "#f2f4f7",
  300: "#eaecf0",
  400: "#d0d5dd",
  500: "#98a2b3",
  600: "#667085",
  700: "#475467",
  800: "#344054",
  900: "#1d2939",
  1000: "#101828",
} as const;

export const green: Color = {
  100: "#e1fbf7",
  200: "#c2f8ef",
  300: "#73eeda",
  400: "#43e8cd",
  500: "#1adabb",
  600: "#14a991",
  700: "#0f7867",
  800: "#0c5a4d",
  900: "#133f37",
} as const;

export const orange: Color = {
  100: "#fcf1e3",
  200: "#fae3c7",
  300: "#f7d5ac",
  400: "#f0b56b",
  500: "#eda247",
  600: "#e99022",
  700: "#ce7b14",
  800: "#aa6511",
  900: "#854f0d",
} as const;

export const red: Color = {
  100: "#fae0e2",
  200: "#f4c0c5",
  300: "#efa1a9",
  400: "#e9818c",
  500: "#de4252",
  600: "#d62537",
  700: "#b61f2e",
  800: "#961a26",
  900: "#76141e",
} as const;

export const blue: Color = {
  100: "#dbeffd",
  200: "#b6dffc",
  300: "#92cffa",
  400: "#6ebff8",
  500: "#49aff7",
  600: "#0b8eeb",
  700: "#0979c8",
  800: "#0864a5",
  900: "#064e81",
} as const;
