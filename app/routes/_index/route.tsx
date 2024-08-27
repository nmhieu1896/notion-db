import { type MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate, useNavigation, useSearchParams } from "@remix-run/react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { NotionDatabase } from "~/apis/notion.db.server";
import Button from "~/components/button/Button";
import { NotionTable } from "~/components/table/NotionTable";
import { Filter, FormFilters } from "./Filter";
import { routeLoader } from "./loader.server";
import { FormSorters, Sorter } from "./Sorter";

export const meta: MetaFunction = () => {
  return [
    { title: "Notion Table" },
    { name: "description", content: "Welcome to test notion table!" },
  ];
};

export const loader = routeLoader;

export default function Index() {
  const [searchParams] = useSearchParams();
  const formMethods = useForm<FormFilters & FormSorters>({
    //@ts-expect-error | Convert search params back to Filters and sorters, define type for this will take lots of time
    defaultValues: {
      sorter: searchParams.get("sorts")
        ? JSON.parse(decodeURIComponent(searchParams.get("sorts") as string))
        : undefined,
      where: searchParams.get("filter")
        ? JSON.parse(decodeURIComponent(searchParams.get("filter") as string))
        : undefined,
    },
  });
  const { getValues, setValue } = formMethods;
  const { data, database } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { state } = useNavigation();
  const isLoading = state === "loading";

  const applyFilters = () => {
    const { sorter, where } = getValues();
    const searchParams = new URLSearchParams();
    if (sorter && sorter.length)
      searchParams.set("sorts", encodeURIComponent(JSON.stringify(sorter)));
    if (where && Object.keys(where).length > 0) {
      searchParams.set("filter", encodeURIComponent(JSON.stringify(where)));
    }
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  const resetFilters = () => {
    setValue("where", undefined);
    setValue("sorter", []);
    navigate("/", { replace: true });
  };

  useEffect(() => {
    // @ts-expect-error | for manual testing only, remove soon
    window.getValues = formMethods.getValues;
  }, [formMethods.getValues]);

  return (
    <FormProvider {...formMethods}>
      <div className="p-4 font-sans">
        <h1 className="text-center text-3xl">Notion Table</h1>
        <div className="h-4" />

        <div className="my-4 flex gap-4">
          <Sorter />
          <div className="h-8 w-0.5 bg-neutral-400" />
          <Filter />
          <div className="h-8 w-0.5 bg-neutral-400" />
          <Button variant="text" color="blue" onClick={resetFilters} isLoading={isLoading}>
            Reset
          </Button>
          <div className="h-8 w-0.5 bg-neutral-400" />
          <Button variant="outlined" color="blue" onClick={applyFilters} isLoading={isLoading}>
            Apply
          </Button>
        </div>

        <NotionTable data={data} database={database as NotionDatabase} isLoading={isLoading} />
      </div>
    </FormProvider>
  );
}
