/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DatabasePropertyUnion,
  NotionProperty,
  DatabaseQueryType,
  NotionDatabase,
} from "~/apis/notion.db.server";
import { BaseTable, BaseTableHeader } from "./BaseTable";
import { ComponentProps, useMemo } from "react";
import clsx from "clsx";

type Props = {
  data: Record<string, DatabasePropertyUnion>[];
  overwrittenHeaderBuilders?: typeof headerBuilders & {
    [key in DatabaseQueryType]: (key: string, options: HeaderOptions) => BaseTableHeader;
  };
  database: NotionDatabase;
} & Omit<ComponentProps<typeof BaseTable>, "headers" | "records">;

export function NotionTable({ data, database, ...props }: Props) {
  const headers = useMemo(
    () =>
      Object.keys(database).map((key) => {
        //@ts-expect-error | Need time to implements all types
        return headerBuilders[database[key].type](key) as BaseTableHeader;
      }),
    [database],
  );

  return <BaseTable headers={headers} records={data} {...props} />;
}

//Header is built from builders function for some Reasons
// 1: Each types are built totally Isolated, easy for changes. And each type can have multiple implementations.
// 2: All types are typesafe. Adding generics will make the full records typesafe as well
// 3: builders functions can be passed as a props with type (key:string, options:HeaderOptions) => BaseTableHeader
// 4: HeaderOptions can have overwritable render function
// 5: headerBuilders can easily be overwritten with overwrittenHeaderBuilders
// => All pieces are small and only connected by typescript. So that it can be composed and reused easily

type HeaderOptions = {
  resizable?: boolean;
  render?: (value: any, record: any) => React.ReactNode;
};

function buildTitleHeader(key: string, options: HeaderOptions = {}): BaseTableHeader {
  type Record = NotionProperty["title"];

  return {
    title: key,
    resizable: options.resizable ?? true,
    field: key,
    render: (value: Record) => (
      <div>
        {Array.isArray(value.title)
          ? (value.title[0]?.plain_text ?? "")
          : `Unknown yet ${JSON.stringify(value)}`}
      </div>
    ),
  };
}
function buildRichTextHeader(key: string, options: HeaderOptions = {}): BaseTableHeader {
  type Record = Extract<NotionProperty["richText"], { rich_text: unknown[] }>;

  return {
    title: key,
    resizable: options.resizable ?? true,
    field: key,
    render: (value: Record) => (
      <div>
        {Array.isArray(value.rich_text)
          ? // ? <div dangerouslySetInnerHTML={{ __html: value.rich_text[0]. }} />
            value.rich_text.map((e, idx) => {
              let className = "";
              if (e.annotations.bold) className += "font-bold ";
              if (e.annotations.italic) className += "italic ";
              if (e.annotations.color)
                className += `${notionRichTextColorClasses[e.annotations.color]} `;
              if (e.annotations.strikethrough) className += "line-through ";
              if (e.annotations.underline || e.href) className += "underline ";

              return e.href ? (
                <a
                  href={e.href}
                  className={className + "cursor-pointer transition-colors hover:text-blue-600"}
                  key={idx}
                  target="_blank"
                  rel="noreferrer"
                >
                  {e.plain_text}
                </a>
              ) : (
                <span className={className} key={idx}>
                  {e.plain_text}
                </span>
              );
            })
          : // JSON.stringify(value.rich_text)
            `Unknown yet ${JSON.stringify(value)}`}
      </div>
    ),
  };
}
function buildMultiSelectHeader(key: string, options: HeaderOptions = {}): BaseTableHeader {
  //TODO: Dont know about this MultiSelectDatabasePropertyConfigResponse type yet, so ignore it for now
  type Record = Extract<NotionProperty["multiSelect"], { multi_select: unknown[] }>;

  return {
    title: key,
    resizable: options.resizable ?? true,
    field: key,
    render: (value: Record) => (
      <div className="flex flex-wrap gap-1">
        {value.multi_select.map((i) => (
          <span
            className={clsx(notionBgClasses[i.color || "default"], "rounded-md px-1.5 py-1")}
            key={i.id}
          >
            {i.name}
          </span>
        ))}
      </div>
    ),
  };
}
function buildDateHeader(key: string, options: HeaderOptions = {}): BaseTableHeader {
  type Record = NotionProperty["date"];

  return {
    title: key,
    resizable: options.resizable ?? true,
    field: key,
    render: (value: Record) => <div className="">{value.date?.start}</div>,
  };
}
function buildSelectHeader(key: string, options: HeaderOptions = {}): BaseTableHeader {
  //TODO: Dont know about this SelectDatabasePropertyConfigResponse type yet, so ignore it for now
  type Record = Exclude<NotionProperty["select"], { select: { options: unknown } }>;

  return {
    title: key,
    resizable: options.resizable ?? true,
    field: key,
    render: (value: Record) => (
      <div>
        <span className={clsx(notionBgClasses[value.select?.color || "default"], "rounded-md p-1")}>
          {value.select?.name}
        </span>
      </div>
    ),
  };
}

function buildNumberHeader(key: string, options: HeaderOptions = {}): BaseTableHeader {
  type Record = NotionProperty["number"];

  return {
    title: key,
    resizable: options.resizable ?? true,
    field: key,
    render: (value: Record) => (
      <div className="text-right">
        {typeof value.number === "object" ? (value.number?.format ?? "") : value.number}
      </div>
    ),
  };
}
function buildStatusHeader(key: string, options: HeaderOptions = {}): BaseTableHeader {
  //TODO: Dont know about this StatusDatabasePropertyConfigResponse type yet, so ignore it for now
  type Record = Exclude<NotionProperty["status"], { status: { options: unknown } }>;

  return {
    title: key,
    resizable: options.resizable ?? true,
    field: key,
    render: (value: Record) => (
      <div>
        <span className={clsx(notionBgClasses[value.status?.color || "default"], "rounded-md p-1")}>
          {value.status?.name ?? "STATUS error, FIX ME"}
        </span>
      </div>
    ),
  };
}
function buildCheckboxHeader(key: string, options: HeaderOptions = {}): BaseTableHeader {
  type Record = NotionProperty["checkbox"];

  return {
    title: key,
    resizable: options.resizable ?? true,
    field: key,
    render: (value: Record) => (
      <div>
        <input
          className="cursor-not-allowed"
          type="checkbox"
          onChange={(e) => e.preventDefault()}
          checked={!!value.checkbox}
        />
      </div>
    ),
  };
}
function buildTimestampHeader(key: string, options: HeaderOptions = {}): BaseTableHeader {
  type Record = NotionProperty["timestamp"];

  return {
    title: key,
    resizable: options.resizable ?? true,
    field: key,
    render: (value: Record) => (
      <div className="min-w-min">
        {/* @ts-expect-error | TODO: Dont know what to do with this yet */}
        {value.created_time || value.last_edited_time}
      </div>
    ),
  };
}

export const headerBuilders = {
  title: buildTitleHeader,
  multi_select: buildMultiSelectHeader,
  date: buildDateHeader,
  select: buildSelectHeader,
  number: buildNumberHeader,
  status: buildStatusHeader,
  checkbox: buildCheckboxHeader,
  rich_text: buildRichTextHeader,
  created_time: buildTimestampHeader,
  last_edited_time: buildTimestampHeader,
};

const notionBgClasses = {
  default: "bg-notionBg-default",
  gray: "bg-notionBg-gray",
  brown: "bg-notionBg-brown",
  orange: "bg-notionBg-orange",
  yellow: "bg-notionBg-yellow",
  green: "bg-notionBg-green",
  blue: "bg-notionBg-blue",
  purple: "bg-notionBg-purple",
  pink: "bg-notionBg-pink",
  red: "bg-notionBg-red",
};
const notionRichTextColorClasses = {
  default: "text-notionRichText-default",
  gray: "text-notionRichText-gray",
  brown: "text-notionRichText-brown",
  orange: "text-notionRichText-orange",
  yellow: "text-notionRichText-yellow",
  green: "text-notionRichText-green",
  blue: "text-notionRichText-blue",
  purple: "text-notionRichText-purple",
  pink: "text-notionRichText-pink",
  red: "text-notionRichText-red",
  default_background: "bg-notionBg-default",
  gray_background: "bg-notionBg-gray",
  brown_background: "bg-notionBg-brown",
  orange_background: "bg-notionBg-orange",
  yellow_background: "bg-notionBg-yellow",
  green_background: "bg-notionBg-green",
  blue_background: "bg-notionBg-blue",
  purple_background: "bg-notionBg-purple",
  pink_background: "bg-notionBg-pink",
  red_background: "bg-notionBg-red",
};
