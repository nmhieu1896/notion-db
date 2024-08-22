import Button from "~/components/button/Button";
import clsx from "clsx";
import { MouseEvent, useEffect, useId, useState } from "react";
import {
  DialogTrigger,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Button as BaseButton,
  type Selection,
} from "react-aria-components";

export const SelectBuilder = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set([]));
  const [open, setOpen] = useState(false);
  const listboxId = useId();

  const unselect =
    (value: string) => (e: React.KeyboardEvent<HTMLDivElement> | MouseEvent<HTMLElement>) => {
      if (e.type === "keydown" && !["Enter", " "].includes((e as React.KeyboardEvent).key)) return;
      e.stopPropagation();

      selected.delete(value);
      setSelected(new Set([...selected]));

      // focus on the next item to unselect, only focus if unselect is triggered by keyboard
      // If no item is selected, focus on the trigger button
      if (e.type !== "keydown") return;
      // RAC have their events, timeout to make sure this focus is not overwritten
      setTimeout(() => {
        if (selected.size)
          document.getElementById(`${listboxId}-unselect-${Array.from(selected)[0]}`)?.focus();
        else document.getElementById(`${listboxId}-trigger`)?.focus();
      }, 150);
    };

  const toggleOpen = (e: React.KeyboardEvent<HTMLDivElement> | MouseEvent<HTMLElement>) => {
    if (e.type === "keydown") {
      // shift + d to unselect all
      const keyEvent = e as React.KeyboardEvent;
      if (keyEvent.key.toLowerCase() === "d" && keyEvent.shiftKey) return setSelected(new Set([]));
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
      const firstItem = document
        .getElementById(listboxId)
        ?.getElementsByClassName("react-aria-ListBoxItem")[0] as HTMLDivElement;
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

  return (
    <DialogTrigger
      isOpen={open}
      onOpenChange={(val) => {
        if (!val) setOpen(false);
      }}
    >
      <Label>Favorite Animal</Label>
      <Button
        id={`${listboxId}-trigger`}
        onClick={toggleOpen}
        onKeyDown={toggleOpen}
        as={BaseButton}
      >
        {selected.size > 0 ? (
          Array.from(selected).map((item) => (
            <div key={item}>
              <span>{item}</span>
              <div
                id={`${listboxId}-unselect-${item}`}
                role="button"
                aria-label={`unselect ${item}`}
                tabIndex={0}
                onClick={unselect(item)}
                onKeyDown={unselect(item)}
                className="ml-2 border border-green-900 focus-visible:bg-green-500"
              >
                unselect
              </div>
            </div>
          ))
        ) : (
          <span>Select something</span>
        )}
      </Button>
      <Popover>
        <ListBox
          id={listboxId}
          selectedKeys={selected}
          onSelectionChange={setSelected as (keys: Selection) => void}
          selectionMode="multiple"
          aria-label="List of options"
          className="border-2 border-orange-500 bg-mainBg p-2"
        >
          {options.map((item) => (
            <ListBoxItem key={item.value} value={item} id={item.value} textValue={item.label}>
              {({ isSelected }) => {
                return (
                  <span
                    className={clsx({
                      "text-red-500": isSelected,
                    })}
                  >
                    {item.label}
                  </span>
                );
              }}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </DialogTrigger>
  );
};

// function isNotUserEvent(e: MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLDivElement>) {
//   if (e.type === "keydown") return false;
//   e = e as MouseEvent<HTMLElement>;
//   // event is emitted by RAC instead of user
//   return e.type === "click" && e.pageX === 0 && e.pageY === 0 && e.screenX === 0 && e.screenY === 0;
// }

const options = [
  { value: "aardvark", label: "Aardvark" },
  { value: "cat", label: "Cat" },
  { value: "dog", label: "Dog" },
  { value: "kangaroo", label: "Kangaroo" },
  { value: "panda", label: "Panda" },
  { value: "snake", label: "Snake" },
  { value: "turtle", label: "Turtle" },
  { value: "lizard", label: "Lizard" },
  { value: "crocodile", label: "Crocodile" },
  { value: "alligator", label: "Alligator" },
];
