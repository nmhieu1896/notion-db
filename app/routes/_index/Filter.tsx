/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { Button as BaseButton } from "react-aria-components";
import { useFormContext } from "react-hook-form";
import Button from "~/components/button/Button";
import Show from "~/components/conditions/Show";
import Switch from "~/components/conditions/Switch";
import { FormDatePicker } from "~/components/date-picker/FormDatePicker";
import { FormInput } from "~/components/input/FormInput";
import { Popover } from "~/components/popover/Popover";
import { FormMultiSelect } from "~/components/select/FormMultiSelect";
import { FormSelect } from "~/components/select/FormSelect";
import { ChevronDown } from "~/icons/chevron";
import { CloseIcon } from "~/icons/close";
import { PlusIcon } from "~/icons/plus";
import { useOptions, ValueType } from "./hooks";

type Properties = ReturnType<typeof useOptions>;

export function Filter() {
  const properties = useOptions();
  return (
    <Popover
      trigger={
        <Button className="flex items-center gap-2" as={BaseButton} variant="filled" color="gray">
          <span>Filter</span>
          <ChevronDown />
        </Button>
      }
    >
      <div className="">
        <WhereClause name="where" properties={properties} />
      </div>
    </Popover>
  );
}

export type Filters = [
  {
    property?: string;
    method?: string;
    value?: any;
    operator?: string;
    valueType?: ValueType;
  },
  Filters,
];
export type FormFilters = Record<string, Filters | undefined>;
type WhereProps = {
  name: string;
  properties: Properties;
};

// Recursively render this component
// The idea is all filters are group, and each group must be started with and/or
// Only the first item of the group is for filter, the second must be another group
// With recursion, more than 2 level nested deep is also supports.
// => each group has only 1 property filter. This can be changed easily.
function WhereClause({ name, properties }: WhereProps) {
  const { getValues, setValue, watch } = useFormContext<FormFilters>();
  const numsOfFilters = watch(`${name}`)?.length || 0;
  // ------------------
  const { propertyOptions, propertiesMapper } = properties;
  const selectedProperty = watch(`${name}.0`) as never as Filters[0];
  //propertiesValues decide actions/methods for the property and the value type
  const propertiesValues = propertiesMapper[selectedProperty?.property as string] as
    | (typeof propertiesMapper)[string]
    | undefined;
  const valueType = propertiesValues?.methods?.find(
    (item) => item.value === selectedProperty?.method,
  )?.valueType;

  // ------------------
  const operator = selectedProperty?.operator as "and" | "or";

  const onRemoveFilter = (i: number) => () => {
    const filters = getValues(name);
    //@ts-expect-error | type is right
    setValue(name, [...filters.slice(0, i), ...filters.slice(i + 1)]);
  };

  return (
    <div
      className={clsx("grid gap-2", {
        "rounded-lg border border-borderColor p-2": name !== "where",
      })}
    >
      <Show when={numsOfFilters > 0}>
        <div className="grid grid-cols-[80px_1fr_34px] items-center gap-2">
          <FormSelect
            name={`${name}.0.operator`}
            options={operators}
            defaultSelectedKey="and"
            triggerClassName="[&_svg]:ml-0 w-full"
          />
          <div className="flex grow items-center gap-2">
            <FormSelect
              name={`${name}.0.property`}
              triggerClassName="w-max grow"
              options={propertyOptions}
              defaultSelectedKey={propertyOptions[0].value}
              onChange={(val) => {
                const methods = propertiesMapper[val].methods;
                setValue(`${name}.0.method`, methods[0].value);
                setValue(`${name}.0.valueType`, methods[0].valueType);
                setValue(`${name}.0.value`, null);
              }}
            />
            <FormSelect
              name={`${name}.0.method`}
              triggerClassName="w-max grow"
              options={propertiesValues?.methods || []}
              defaultSelectedKey={propertiesValues?.methods?.[0]?.value || ""}
              onChange={(val) => {
                const selectedMethod = propertiesValues?.methods.find((item) => item.value === val);
                setValue(`${name}.0.valueType`, selectedMethod?.valueType);
              }}
            />
            {/* -------------- Render Input Types based on value type --------------- */}
            <Switch.Root>
              {/* Special case for is_empty and is_not_empty */}
              <Switch.Case
                when={
                  selectedProperty?.method === "is_empty" ||
                  selectedProperty?.method === "is_not_empty"
                }
              >
                <FormInput hidden checked={true} type="checkbox" name={`${name}.0.value`} />
              </Switch.Case>
              <Switch.Case when={valueType === "number" || valueType === "rich_text"}>
                <FormInput
                  name={`${name}.0.value`}
                  placeholder="Value"
                  className="h-10 w-max grow"
                />
              </Switch.Case>
              <Switch.Case when={valueType === "select" || valueType === "status"}>
                <FormSelect
                  name={`${name}.0.value`}
                  triggerClassName="w-max grow"
                  options={propertiesValues?.options || []}
                  defaultSelectedKey={propertiesValues?.methods?.[0]?.value || ""}
                />
              </Switch.Case>
              <Switch.Case when={valueType === "multi_select"}>
                <FormMultiSelect
                  name={`${name}.0.value`}
                  triggerClassName="w-max grow flex-wrap max-w-[350px]"
                  options={propertiesValues?.options || []}
                />
              </Switch.Case>
              <Switch.Case when={valueType === "checkbox"}>
                <FormInput type="checkbox" name={`${name}.0.value`} />
              </Switch.Case>
              <Switch.Case
                when={
                  valueType === "date" ||
                  valueType === "created_time" ||
                  valueType === "last_edited_time"
                }
              >
                <FormDatePicker name={`${name}.0.value`} />
              </Switch.Case>
              <Switch.Case when={true}>
                <div />
              </Switch.Case>
            </Switch.Root>
            {/* -------------- Render Input Types based on value type --------------- */}
          </div>
        </div>
      </Show>
      {Array.from({ length: numsOfFilters - 1 }, (_, i) => {
        return (
          <div className="grid grid-cols-[80px_1fr_34px] items-start gap-2" key={i}>
            <p className="mt-5 text-right capitalize">{operator}</p>
            {/* Recursively render WhereClause */}
            <WhereClause name={`${name}.${i + 1}`} properties={properties} />
            <Button onClick={onRemoveFilter(i + 1)}>
              <CloseIcon />
            </Button>
          </div>
        );
      })}
      <Button
        variant="text"
        color="blue"
        className="flex items-center gap-2"
        onClick={() => {
          //If there is no filter, add one with default value
          const firstProperty = propertyOptions[0];
          const firstMethod = propertiesMapper[firstProperty.value].methods[0];
          const defaultObj = {
            property: propertyOptions[0].value,
            method: firstMethod.value,
            valueType: firstMethod.valueType,
            operator: "and",
          };
          //@ts-expect-error | type is right
          if (!getValues(name)?.length) setValue(name, [defaultObj]);
          //@ts-expect-error | type is right
          else setValue(name, [...getValues(name), [defaultObj]]);
        }}
      >
        <span>Add Filter</span>
        <PlusIcon />
      </Button>
    </div>
  );
}

const operators = [
  { value: "and", label: "And" },
  { value: "or", label: "Or" },
];
