import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { queryDatabase } from "~/apis/notion.db.server";
import { SelectBuilder } from "~/components/select/MultiSelect";
import { NotionTable } from "~/components/table/NotionTable";

export const meta: MetaFunction = () => {
  return [
    { title: "Notion Table" },
    { name: "description", content: "Welcome to test notion table!" },
  ];
};

export const loader = async () => {
  try {
    const data = await queryDatabase({
      database_id: "d3ef30c7b8b849ada57b570060e294fd",
      sorts: [
        {
          timestamp: "created_time",
          direction: "ascending",
        },
      ],
    });

    return json({ data, error: null });
  } catch (error) {
    console.log("🚀 ~ loader ~ error:", error);
    return json({
      data: [] as Awaited<ReturnType<typeof queryDatabase>>,
      error: error as Record<string, unknown>,
    });
  }
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  console.log(data);

  return (
    <div className="p-4 font-sans">
      <h1 className="text-3xl">Welcome to Remix</h1>

      <SelectBuilder />
      <div className="h-4" />
      <NotionTable data={data} />
    </div>
  );
}
