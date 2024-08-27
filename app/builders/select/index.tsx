import clsx from "clsx";
import { ComponentProps } from "react";
import {
  ListBox as BaseListBox,
  ListBoxItem as BaseListBoxItem,
  SelectValue as BaseSelectValue,
  Button as BaseButton,
  Select as BaseSelect,
} from "react-aria-components";

export function RootSelect({ className, ...props }: ComponentProps<typeof BaseSelect>) {
  return <BaseSelect className={clsx(className, "")} {...props} />;
}

export function ListBox({ className, ...props }: ComponentProps<typeof BaseListBox>) {
  return (
    <BaseListBox
      aria-label="List of options"
      className={clsx(
        className,
        "border-borderColor shadow-popover rounded-lg border bg-mainBg p-1",
      )}
      {...props}
    />
  );
}

export function ListBoxItem({ className, ...props }: ComponentProps<typeof BaseListBoxItem>) {
  return <BaseListBoxItem className={clsx(className)} {...props} />;
}

export function SelectValue({ className, ...props }: ComponentProps<typeof BaseSelectValue>) {
  return (
    <BaseSelectValue
      className={clsx(
        className,
        `[&:[data-placeholder="true"]]:leading-24 text-14 text-text-primary`,
        `data-[placeholder="true"]:px-2 data-[placeholder="true"]:py-1`,
      )}
      {...props}
    />
  );
}

export function Trigger({ className, ...props }: ComponentProps<typeof BaseButton>) {
  return (
    <BaseButton
      className={clsx(
        className,
        "border-borderColor lead-24 flex items-center rounded-lg border bg-white px-2 py-1",
      )}
      {...props}
    />
  );
}
