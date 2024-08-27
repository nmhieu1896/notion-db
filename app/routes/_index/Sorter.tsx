import { Button as BaseButton } from "react-aria-components";
import { useFormContext } from "react-hook-form";
import Button from "~/components/button/Button";
import Show from "~/components/conditions/Show";
import { Popover } from "~/components/popover/Popover";
import { FormSelect } from "~/components/select/FormSelect";
import { ChevronDown } from "~/icons/chevron";
import { CloseIcon } from "~/icons/close";
import { PlusIcon } from "~/icons/plus";
import { useOptions } from "./hooks";

export type FormSorters = {
  sorter: {
    direction: "ascending" | "descending";
    property: string;
  }[];
};

export function Sorter() {
  const { propertyOptions } = useOptions();
  const { getValues, watch, setValue } = useFormContext<FormSorters>();
  const numsOfSorters = watch("sorter")?.length || 0;

  const removeSorter = (i: number) => () => {
    const sorter = getValues("sorter");
    setValue("sorter", [...sorter.slice(0, i), ...sorter.slice(i + 1)]);
  };

  return (
    <Popover
      trigger={
        <Button
          className="ml-auto flex items-center gap-2"
          as={BaseButton}
          variant="filled"
          color="blue"
        >
          <span>Sorter</span>
          <Show when={numsOfSorters > 0}>
            <span>({numsOfSorters})</span>
          </Show>
          <ChevronDown />
        </Button>
      }
    >
      <div className="grid gap-2">
        {Array.from({ length: numsOfSorters }, (_, i) => (
          <div className="flex gap-2 [&_>_*:not(:last-child)]:grow" key={i}>
            <FormSelect
              name={`sorter.${i}.property`}
              triggerClassName="w-full justify-between"
              options={propertyOptions}
              defaultSelectedKey={propertyOptions[0].value}
            />
            <FormSelect
              name={`sorter.${i}.direction`}
              options={directions}
              defaultSelectedKey="ascending"
              triggerClassName="w-full justify-between"
            />
            <Button
              aria-label="Remove sorter"
              variant="text"
              color="gray"
              onClick={removeSorter(i)}
            >
              <CloseIcon />
            </Button>
          </div>
        ))}

        <Button
          variant="text"
          color="blue"
          className="flex items-center gap-2"
          onClick={() =>
            setValue("sorter", [
              ...(getValues("sorter") || []),
              { property: propertyOptions[0].value, direction: "ascending" },
            ])
          }
        >
          <span>Add Sorter</span>
          <PlusIcon />
        </Button>
      </div>
    </Popover>
  );
}

const directions = [
  { value: "ascending", label: "Ascending" },
  { value: "descending", label: "Descending" },
];
