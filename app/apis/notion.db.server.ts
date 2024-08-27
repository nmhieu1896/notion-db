import { notionClient } from "./notion.client.server";

// Because Notion Client doesn't export types
// So using types require manual extracting
export type QueryDatabaseResponse = Awaited<ReturnType<typeof notionClient.databases.query>>;
// Result is union of 4 types, one of them dont have properties, remove it from the results
export type DatabaseQueryResult = Extract<
  QueryDatabaseResponse["results"][0],
  { properties: unknown }
>;
export type DatabasePropertyUnion =
  DatabaseQueryResult["properties"][keyof DatabaseQueryResult["properties"]];
export type DatabaseQueryType = DatabasePropertyUnion["type"];

export type TitleType = Extract<DatabasePropertyUnion, { type: "title" }>;
export type NumberType = Extract<DatabasePropertyUnion, { type: "number" }>;
export type StatusType = Extract<DatabasePropertyUnion, { type: "status" }>;
export type SelectType = Extract<DatabasePropertyUnion, { type: "select" }>;
export type MultiSelectType = Extract<DatabasePropertyUnion, { type: "multi_select" }>;
export type DateType = Extract<DatabasePropertyUnion, { type: "date" }>;
export type CheckboxType = Extract<DatabasePropertyUnion, { type: "checkbox" }>;
export type RichTextType = Extract<DatabasePropertyUnion, { type: "rich_text" }>;
export type TimestampType = Extract<
  DatabasePropertyUnion,
  { type: "last_edited_time" } | { type: "created_time" }
>;

export type NotionProperty = {
  title: TitleType;
  number: NumberType;
  status: StatusType;
  select: SelectType;
  multiSelect: MultiSelectType;
  date: DateType;
  checkbox: CheckboxType;
  richText: RichTextType;
  timestamp: TimestampType;
};

export async function queryDatabase(args: Parameters<typeof notionClient.databases.query>[0]) {
  const data = await notionClient.databases.query(args);
  const results = data.results.map((i) => {
    const item = i as DatabaseQueryResult;
    return item.properties;
  }) satisfies Record<string, DatabasePropertyUnion>[];

  return results;
}

export type NotionDatabase = Awaited<
  ReturnType<typeof notionClient.databases.retrieve>
>["properties"];
export async function retrieveDatabase(args: Parameters<typeof notionClient.databases.query>[0]) {
  const data = await notionClient.databases.retrieve(args);
  return data.properties;
}
