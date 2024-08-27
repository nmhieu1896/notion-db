import { useRouteLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import { NotionDatabase } from "~/apis/notion.db.server";

type Properties = Record<
  string,
  {
    type: string;
    methods: MethodOptionType[];
    options: { value: string; label: string }[] | null;
  }
>;

export function useOptions() {
  const { database } = useRouteLoaderData("routes/_index") as { database: NotionDatabase };

  const propertiesMapper: Properties = useMemo(
    () =>
      Object.keys(database).reduce((acc, key) => {
        const type = database[key].type;
        let options: { key: string; label: string }[] | null = null;
        if (["multi_select", "select", "status"].includes(type)) {
          const dataOptions =
            // @ts-expect-error | Require lots of effort to type this
            database[key]["select"] || database[key]["multi_select"] || database[key]["status"];
          options = dataOptions.options.map((option: Record<string, string>) => {
            return {
              value: option.name,
              label: option.name,
            };
          });
        }
        return {
          ...acc,
          [key]: {
            type: type,
            //@ts-expect-error | not support all types yet
            methods: optionsMapper[type],
            options,
          },
        };
      }, {}),
    [database],
  );
  const propertyOptions = Object.keys(propertiesMapper).map((key) => ({ value: key, label: key }));
  return { propertiesMapper, propertyOptions };
}

export type ValueType =
  | "number"
  | "rich_text"
  | "select"
  | "status"
  | "multi_select"
  | "checkbox"
  | "date"
  | "last_edited_time"
  | "created_time";
type MethodOptionType = {
  value: string;
  label: string;
  valueType: ValueType;
};

const richTextOptions: MethodOptionType[] = [
  { value: "contains", label: "Contains", valueType: "rich_text" },
  { value: "does_not_contain", label: "Not contains", valueType: "rich_text" },
  { value: "equals", label: "Equals", valueType: "rich_text" },
  { value: "does_not_equal", label: "Not Equals", valueType: "rich_text" },
  { value: "starts_with", label: "Starts with", valueType: "rich_text" },
  { value: "ends_with", label: "Ends with", valueType: "rich_text" },
  { value: "is_empty", label: "Is empty", valueType: "rich_text" },
  { value: "is_not_empty", label: "Is not empty", valueType: "rich_text" },
];

const numberOptions: MethodOptionType[] = [
  { value: "equals", label: "Equals", valueType: "number" },
  { value: "does_not_equal", label: "Not Equals", valueType: "number" },
  { value: "greater_than", label: "Greater than", valueType: "number" },
  { value: "greater_than_or_equal_to", label: "Not less than", valueType: "number" },
  { value: "less_than", label: "Less than", valueType: "number" },
  { value: "less_than_or_equal_to", label: "Not greater than", valueType: "number" },
  { value: "is_empty", label: "Is empty", valueType: "number" },
  { value: "is_not_empty", label: "Is not empty", valueType: "number" },
];

const selectOptions: MethodOptionType[] = [
  { value: "equals", label: "Equals", valueType: "select" },
  { value: "does_not_equal", label: "Not Equals", valueType: "select" },
  { value: "is_empty", label: "Is empty", valueType: "select" },
  { value: "is_not_empty", label: "Is not empty", valueType: "select" },
];
const multiSelectOptions: MethodOptionType[] = [
  { value: "contains", label: "Contains", valueType: "multi_select" },
  { value: "does_not_contain", label: "Not contains", valueType: "multi_select" },
  { value: "is_empty", label: "Is empty", valueType: "multi_select" },
  { value: "is_not_empty", label: "Is not empty", valueType: "multi_select" },
];

const checkboxOptions: MethodOptionType[] = [
  { value: "equals", label: "Equals", valueType: "checkbox" },
  { value: "does_not_equal", label: "Not Equals", valueType: "checkbox" },
];

const dateOptions: MethodOptionType[] = [
  { value: "equals", label: "Equals", valueType: "date" },
  { value: "does_not_equal", label: "Not Equals", valueType: "date" },
  { value: "after", label: "After", valueType: "date" },
  { value: "on_or_after", label: "On or after", valueType: "date" },
  { value: "before", label: "Before", valueType: "date" },
  { value: "on_or_before", label: "On or Before", valueType: "date" },
  { value: "is_empty", label: "Is empty", valueType: "date" },
  { value: "is_not_empty", label: "Is not empty", valueType: "date" },
];
const createdTimeOptions: MethodOptionType[] = [
  { value: "equals", label: "Equals", valueType: "created_time" },
  { value: "does_not_equal", label: "Not Equals", valueType: "created_time" },
  { value: "after", label: "After", valueType: "created_time" },
  { value: "on_or_after", label: "On or after", valueType: "created_time" },
  { value: "before", label: "Before", valueType: "created_time" },
  { value: "on_or_before", label: "On or Before", valueType: "created_time" },
  { value: "is_empty", label: "Is empty", valueType: "created_time" },
  { value: "is_not_empty", label: "Is not empty", valueType: "created_time" },
];
const lastEditedTimeOptions: MethodOptionType[] = [
  { value: "equals", label: "Equals", valueType: "last_edited_time" },
  { value: "does_not_equal", label: "Not Equals", valueType: "last_edited_time" },
  { value: "after", label: "After", valueType: "last_edited_time" },
  { value: "on_or_after", label: "On or after", valueType: "last_edited_time" },
  { value: "before", label: "Before", valueType: "last_edited_time" },
  { value: "on_or_before", label: "On or Before", valueType: "last_edited_time" },
  { value: "is_empty", label: "Is empty", valueType: "last_edited_time" },
  { value: "is_not_empty", label: "Is not empty", valueType: "last_edited_time" },
];

const statusOptions: MethodOptionType[] = [
  { value: "equals", label: "Equals", valueType: "status" },
  { value: "does_not_equal", label: "Not Equals", valueType: "status" },
  { value: "is_empty", label: "Is empty", valueType: "status" },
  { value: "is_not_empty", label: "Is not empty", valueType: "status" },
];

const optionsMapper = {
  rich_text: richTextOptions,
  title: richTextOptions,
  select: selectOptions,
  multi_select: multiSelectOptions,
  number: numberOptions,
  status: statusOptions,
  checkbox: checkboxOptions,
  date: dateOptions,
  created_time: createdTimeOptions,
  last_edited_time: lastEditedTimeOptions,
};
