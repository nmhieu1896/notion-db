import "dotenv/config";

export function getServerEnv() {
  if (!process.env.NOTION_TOKEN) throw new Error("NOTION_TOKEN is not set");

  return {
    NOTION_TOKEN: process.env.NOTION_TOKEN,
    DATABASE_ID: process.env.DATABASE_ID,
  };
}

export function getClientEnv() {
  if (!process.env.DATABASE_ID) throw new Error("NOTION_TOKEN is not set");
  //Only include the variables that are needed for the client
  return {
    NOTION_TOKEN: process.env.NOTION_TOKEN,
    DATABASE_ID: process.env.DATABASE_ID,
  };
}

export type ENVType = ReturnType<typeof getClientEnv>;
