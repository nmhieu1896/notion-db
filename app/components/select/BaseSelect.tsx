import clsx from "clsx";
import { Key, Popover } from "react-aria-components";
import { SelectValue, RootSelect, ListBox, Trigger, ListBoxItem } from "~/builders/select";
import { ChevronDown } from "~/icons/chevron";

type Props = {
  options: Array<{ value: string; label: string }>;
  defaultValue?: string;
  triggerClassName?: string;
  defaultSelectedKey?: string;
  onValueChange?: (value: string) => void;
  value?: string;
};

export function BaseSelect({
  options,
  defaultValue,
  triggerClassName,
  defaultSelectedKey,
  onValueChange,
  value,
}: Props) {
  return (
    <RootSelect
      onSelectionChange={onValueChange as (keys: Key) => void}
      selectedKey={value}
      defaultSelectedKey={defaultSelectedKey}
      aria-label="Single select"
      placeholder="Select"
    >
      <Trigger className={triggerClassName}>
        <SelectValue defaultValue={defaultValue || "Select"} aria-label="Select an option" />
        <ChevronDown className="ml-4" />
      </Trigger>
      <Popover>
        <ListBox>
          {options.map((item) => (
            <ListBoxItem
              key={item.value}
              value={item}
              id={item.value}
              textValue={item.label}
              aria-label={item.label}
            >
              {({ isSelected }) => {
                return (
                  <div
                    className={clsx("cursor-pointer rounded px-2 py-1", {
                      "bg-blue-100": isSelected,
                    })}
                  >
                    {item.label}
                  </div>
                );
              }}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </RootSelect>
  );
}
