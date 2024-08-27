import clsx from "clsx";
import { MouseEvent, useEffect, useId, useState } from "react";
import {
  Button as BaseButton,
  DialogTrigger,
  Popover,
  type Selection,
} from "react-aria-components";
import { ListBox, ListBoxItem } from "~/builders/select";
import Button from "~/components/button/Button";
import { CloseIcon } from "~/icons/close";

type Props = {
  onValueChange?: (value: string[]) => void;
  value?: string[];
  triggerClassName?: string;
  options: Array<{ value: string; label: string }>;
};

export const BaseMultiSelect = ({ onValueChange, value, triggerClassName, options }: Props) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const listboxId = useId();

  const onSelectionChange = (keys: Set<string>) => {
    setSelected(Array.from(keys));
    onValueChange?.(Array.from(keys));
  };

  const unselect =
    (value: string) => (e: React.KeyboardEvent<HTMLDivElement> | MouseEvent<HTMLElement>) => {
      if (e.type === "keydown" && !["Enter", " "].includes((e as React.KeyboardEvent).key)) return;
      e.stopPropagation();

      const newSelected = selected.filter((item) => item !== value);

      setSelected(newSelected);
      onValueChange?.(newSelected);
      // focus on the next item to unselect, only focus if unselect is triggered by keyboard
      // If no item is selected, focus on the trigger button
      if (e.type !== "keydown") return;
      // RAC have their events, timeout to make sure this focus is not overwritten
      setTimeout(() => {
        if (selected.length)
          document.getElementById(`${listboxId}-unselect-${Array.from(selected)[0]}`)?.focus();
        else document.getElementById(`${listboxId}-trigger`)?.focus();
      }, 150);
    };

  const toggleOpen = (e: React.KeyboardEvent<HTMLDivElement> | MouseEvent<HTMLElement>) => {
    if (e.type === "keydown") {
      // shift + d to unselect all
      const keyEvent = e as React.KeyboardEvent;
      if (keyEvent.key.toLowerCase() === "d" && keyEvent.shiftKey) {
        setSelected([]);
        return document.getElementById(`${listboxId}-trigger`)?.focus();
      }
    }
    //toggle on space and enter
    if (e.type === "keydown" && !["Enter", " "].includes((e as React.KeyboardEvent).key)) return;
    setOpen((open) => !open);
  };

  //Effect handle focus when open popover
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    if (!open) return;

    // If the dialog is opened
    // avoid tab to focus on element outside of the dialog
    root.inert = true;
    // focus on the first item of list box
    requestAnimationFrame(() => {
      const firstItem = document.getElementById(listboxId)?.childNodes[0] as HTMLDivElement;
      firstItem?.focus();
    });

    return () => {
      root.inert = false;
    };
  }, [listboxId, open]);

  // Effect overwrite escape key.
  // Default behavior is unselect all items
  useEffect(() => {
    if (!open) return;
    function keydown(e: KeyboardEvent) {
      if (e.key !== "Escape") return; //only overwrite escape key
      setOpen(false);
      e.stopPropagation();
    }
    window.addEventListener("keydown", keydown, { capture: true });
    return () => window.removeEventListener("keydown", keydown);
  }, [open]);

  useEffect(() => {
    if (value) setSelected(value);
    else setSelected([]);
  }, [value]);

  return (
    <DialogTrigger
      isOpen={open}
      onOpenChange={(val) => {
        if (!val) setOpen(false);
      }}
    >
      <Button
        id={`${listboxId}-trigger`}
        onClick={toggleOpen}
        onKeyDown={toggleOpen}
        as={BaseButton}
        className={clsx("flex gap-2", triggerClassName)}
        variant="outlined"
      >
        {selected.length > 0 ? (
          Array.from(selected).map((item) => (
            <div key={item} className="flex items-center gap-1 rounded bg-neutral-300 px-2 py-1">
              <span>{item}</span>
              <div
                id={`${listboxId}-unselect-${item}`}
                role="button"
                aria-label={`unselect ${item}`}
                tabIndex={0}
                onClick={unselect(item)}
                onKeyDown={unselect(item)}
                className="border p-1 hover:border-blue-500"
              >
                <CloseIcon />
              </div>
            </div>
          ))
        ) : (
          <div className="px-2 py-1 text-14 leading-24">
            <span>Select something</span>
          </div>
        )}
      </Button>
      <Popover>
        <ListBox
          id={listboxId}
          selectedKeys={selected}
          onSelectionChange={onSelectionChange as (keys: Selection) => void}
          selectionMode="multiple"
        >
          {options.map((item) => (
            <ListBoxItem
              className="[&:not(:last-child)]:mb-1"
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
    </DialogTrigger>
  );
};
