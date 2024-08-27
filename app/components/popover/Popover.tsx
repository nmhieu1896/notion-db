import {
  DialogTrigger,
  Button as BaseButton,
  OverlayArrow,
  Popover as RootPopover,
  Dialog,
} from "react-aria-components";
import Button from "../button/Button";
import { ComponentProps } from "react";
import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  triggerProps?: ComponentProps<typeof Button>;
  trigger?: ReturnType<typeof Button>;
};

export function Popover({ children, triggerProps, trigger }: Props) {
  return (
    <DialogTrigger>
      {trigger || <Button as={BaseButton} {...triggerProps} />}

      <RootPopover
        className={clsx(
          "overflow-auto border border-borderColor bg-mainBg shadow-popover",
          "rounded-xl p-4",
        )}
      >
        <OverlayArrow />
        <Dialog>{children}</Dialog>
      </RootPopover>
    </DialogTrigger>
  );
}
