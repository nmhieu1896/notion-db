/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatabasePropertyUnion, NotionProperty, DatabaseQueryType } from "~/apis/notion.db.server";
import { BaseTable, BaseTableHeader } from "./BaseTable";
import { useMemo } from "react";
import clsx from "clsx";

type Props = {
  data: Record<string, DatabasePropertyUnion>[];
  overwrittenHeaderBuilders?: typeof headerBuilders & {
    [key in DatabaseQueryType]: (key: string, options: HeaderOptions) => BaseTableHeader;
  };
};

export function NotionTable({ data }: Props) {
  const headers = useMemo(
    () =>
      Object.keys(data[0]).map((key) => {
        //@ts-expect-error | Need time to implements all types
        return headerBuilders[data[0][key].type](key) as BaseTableHeader;
      }),
    [data],
  );

  return <BaseTable headers={headers} records={data} />;
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
      <div className="text-blue-500">
        {Array.isArray(value.title)
          ? (value.title[0]?.plain_text ?? "NULL")
          : `Unknown yet ${JSON.stringify(value)}`}
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
            className={clsx(notionColorClasses[i.color || "default"], "rounded-md px-1.5 py-1")}
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
        <span
          className={clsx(notionColorClasses[value.select?.color || "default"], "rounded-md p-1")}
        >
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
        {typeof value.number === "object" ? (value.number?.format ?? "NULL") : value.number}
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
        <span
          className={clsx(notionColorClasses[value.status?.color || "default"], "rounded-md p-1")}
        >
          {value.status?.name ?? "STATUS error, FIX ME"}
        </span>
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
};

const notionColorClasses = {
  default: "bg-notion-default",
  gray: "bg-notion-gray",
  brown: "bg-notion-brown",
  orange: "bg-notion-orange",
  yellow: "bg-notion-yellow",
  green: "bg-notion-green",
  blue: "bg-notion-blue",
  purple: "bg-notion-purple",
  pink: "bg-notion-pink",
  red: "bg-notion-red",
};
