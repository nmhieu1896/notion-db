export function getServerEnv() {
  if (!process.env.NOTION_TOKEN) throw new Error("NOTION_TOKEN is not set");

  return {
    NOTION_TOKEN: process.env.NOTION_TOKEN,
  };
}

export function getClientEnv() {
  //Only include the variables that are needed for the client
  return {
    NOTION_TOKEN: process.env.NOTION_TOKEN,
  };
}

export type ENVType = ReturnType<typeof getClientEnv>;
