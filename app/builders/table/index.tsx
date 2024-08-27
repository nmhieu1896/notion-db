/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { ComponentProps, createContext, JSXElementConstructor } from "react";
import {
  Cell as BaseCell,
  Column as BaseColumn,
  ColumnResizer as BaseColumnResizer,
  Row as BaseRow,
  Table as BaseTable,
  TableBody as BaseTableBody,
  TableHeader as BaseTableHeader,
} from "react-aria-components";
import Show from "~/components/conditions/Show";

type ExtProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  ComponentProps<T> & {
    children?: React.ReactNode;
  };

export function Cell({ className = "", ...props }: ExtProps<typeof BaseCell>) {
  return (
    <BaseCell
      className={clsx(
        className,
        "min-w-min p-2 text-tableCell text-text-primary",
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
        "text-tableHead text-text-tertiary",
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

export function ResizableColumn({
  className = "",
  children,
  ...props
}: ExtProps<typeof Column> & { resizable?: boolean }) {
  return (
    <Column className={clsx(className, "group p-0")} {...props}>
      <div
        className={clsx("relative flex h-10 w-full cursor-move p-2")}
        role="button"
        tabIndex={0}
        draggable
      >
        {children}
        <Show when={props.resizable !== false}>
          <ColumnResizer
            className={clsx(
              "group/resizer absolute -right-4 top-0 z-[1] opacity-0 transition-all",
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
                "group-active/resizer:border-green-300 group-active/resizer:bg-transparent",
              )}
            ></div>
          </ColumnResizer>
        </Show>
      </div>
    </Column>
  );
}

export function Row({ className = "", ...props }: ExtProps<typeof BaseRow>) {
  return <BaseRow className={clsx(className)} {...props} />;
}

export function Table({ className = "", ...props }: ExtProps<typeof BaseTable>) {
  return (
    <BaseTable aria-label="Table" className={clsx(className, "!w-auto min-w-min")} {...props} />
  );
}

export function TableBody({ className = "", ...props }: ExtProps<typeof BaseTableBody>) {
  return <BaseTableBody className={clsx(className)} {...props} />;
}

export function TableHeader({ className = "", ...props }: ExtProps<typeof BaseTableHeader>) {
  return <BaseTableHeader className={clsx(className, "lmao")} {...props} />;
}

const dragProvider = createContext({});
export function DraggableTableContainer({ children }: any) {
  return (
    <dragProvider.Provider value={{}}>
      <div className="relative max-w-full overflow-auto">{children}</div>
    </dragProvider.Provider>
  );
}
