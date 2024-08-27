/* eslint-disable @typescript-eslint/no-explicit-any */

import { queryDatabase, retrieveDatabase } from "~/apis/notion.db.server";
import { ValueType } from "./hooks";
import { promiseAllSettled } from "~/utils/promise";
import { json } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Filters } from "./Filter";

type FormattedFilters = {
  [key in "and" | "or"]: (
    | ({ property: string } & { [key in ValueType]: Record<string, string> })
    | FormattedFilters
  )[];
};
// Format filters from the form to the format that can be used in the database query
// this function should be composed by multiple functions that parse only one type of value
export function formatFilters(filters: Filters) {
  const operator = (filters[0]?.operator || "and") as "and" | "or";
  const result = { [operator]: [] } as never as FormattedFilters;
  if (filters[0]?.property && filters[0]?.method && filters[0]?.valueType) {
    // parse type of value.
    const parsedValue =
      filters[0].method === "is_empty" || filters[0].method === "is_not_empty"
        ? true
        : filters[0].valueType === "number"
          ? Number(filters[0].value)
          : filters[0].valueType === "multi_select"
            ? Array.from(filters[0].value)
            : filters[0].valueType === "checkbox"
              ? Boolean(filters[0].value)
              : filters[0].value;

    let obj: any;
    if (filters[0].valueType === "multi_select") {
      // multi select is not allow to use array, so split it to multiple conditions
      const conditions = (parsedValue as string[]).map((selected) => ({
        property: filters[0].property,
        multi_select: {
          [filters[0].method as string]: selected,
        },
      }));
      if (filters[0].method === "contains") obj = { or: conditions };
      else obj = { and: conditions };
    } else {
      //Not multi select, just follow format of notion.
      obj = {
        property: filters[0].property,
        [filters[0].valueType]: {
          [filters[0].method]: parsedValue,
        },
      };
    }
    result[operator].push(obj);
  }

  for (let i = 1; i < filters.length; i++) {
    // @ts-expect-error | Recursive type is hard, so let put it like this.
    if (filters[i]) result[operator].push(formatFilters(filters[i]));
  }
  return result;
}

export const routeLoader = async ({ request }: LoaderFunctionArgs) => {
  const searchParams = Object.fromEntries(new URL(request.url).searchParams);
  let sorts: any = undefined;
  let filter: any = undefined;
  try {
    if (searchParams.sorts) sorts = JSON.parse(decodeURIComponent(searchParams.sorts));
    if (searchParams.filter)
      filter = formatFilters(JSON.parse(decodeURIComponent(searchParams.filter)));
  } catch (e) {
    console.log("PARSER:ERROR", e);
  }

  const databasePromise = retrieveDatabase({
    database_id: ENV.DATABASE_ID,
  });
  const dataPromise = queryDatabase({
    database_id: ENV.DATABASE_ID,
    sorts: sorts,
    filter: filter,

    // TODO: apply algorithm to flatten nested filters
    // filter: {
    //   and: [
    //     {
    //       or: [
    //         { property: "Company", multi_select: { contains: "Google" } },
    //         { property: "Company", multi_select: { contains: "Reach.io" } },
    //       ],
    //     },
    //     {
    //       and: [
    //         {
    //           or: [
    //             { property: "Food", multi_select: { contains: "Tuna" } },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // },
  });

  const [database, data] = await promiseAllSettled([databasePromise, dataPromise]);
  return json({ data: data || ([] as Awaited<ReturnType<typeof queryDatabase>>), database });
};
export type LoaderType = typeof routeLoader;
