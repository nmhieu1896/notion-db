/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { ComponentProps, JSXElementConstructor } from "react";
import {
  Cell as BaseCell,
  Column as BaseColumn,
  ColumnResizer as BaseColumnResizer,
  Row as BaseRow,
  Table as BaseTable,
  TableBody as BaseTableBody,
  TableHeader as BaseTableHeader,
} from "react-aria-components";

type ExtProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  ComponentProps<T> & {
    children?: React.ReactNode;
  };

export function Cell({ className = "", ...props }: ExtProps<typeof BaseCell>) {
  return (
    <BaseCell
      className={clsx(
        className,
        "p-2 text-text-primary",
        `border-b border-b-neutral-400 [&:not(:last-child)]:border-r`,
      )}
      {...props}
    />
  );
}

type eXtendedColumnProps = ExtProps<typeof BaseColumn>;
export function Column({ className = "", ...props }: eXtendedColumnProps) {
  return (
    <BaseColumn
      className={clsx(
        className,
        `border-b border-t border-neutral-400 [&:not(:last-child)]:border-r`,
      )}
      {...props}
    />
  );
}

export function ColumnResizer({ className = "", ...props }: ExtProps<typeof BaseColumnResizer>) {
  return (
    <BaseColumnResizer
      aria-label="Resize column"
      className={clsx(className, "h-8 w-2 cursor-ew-resize bg-red-600")}
      {...props}
    />
  );
}

export function ResizableColumn({ className = "", children, ...props }: ExtProps<typeof Column>) {
  return (
    <Column className={clsx(className, "group p-0")} {...props} isRowHeader>
      <div className="relative flex h-10 w-full p-2 text-text-tertiary">
        {children}
        <ColumnResizer
          className={clsx(
            "group absolute -right-4 top-0 z-[1] opacity-0 transition-all",
            "hover:opacity-100 active:opacity-100 group-hover:opacity-100",
            // w-8 for large area of interaction
            // small children div is for UI indicator
            "h-full w-8 cursor-ew-resize bg-transparent",
          )}
        >
          <div
            className={clsx(
              "absolute left-2 top-0 box-content h-full w-2 bg-green-300 transition-all",
              "border-l-4 border-r-4 border-mainBg",
              "group-active:border-green-300 group-active:bg-transparent",
            )}
          ></div>
        </ColumnResizer>
      </div>
    </Column>
  );
}

export function Row({ className = "", ...props }: ExtProps<typeof BaseRow>) {
  return <BaseRow className={clsx(className)} {...props} />;
}

export function Table({ className = "", ...props }: ExtProps<typeof BaseTable>) {
  return <BaseTable aria-label="Table" className={clsx(className)} {...props} />;
}

export function TableBody({ className = "", ...props }: ExtProps<typeof BaseTableBody>) {
  return <BaseTableBody className={clsx(className)} {...props} />;
}

export function TableHeader({ className = "", ...props }: ExtProps<typeof BaseTableHeader>) {
  return <BaseTableHeader className={clsx(className)} {...props} />;
}
