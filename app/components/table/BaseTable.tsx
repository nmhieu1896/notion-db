/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { ResizableTableContainer } from "react-aria-components";

import { Cell, ResizableColumn, Row, Table, TableBody, TableHeader } from "~/builders/table";

export type BaseTableHeader = {
  title: string;
  resizable: boolean;
  field: string;
  render?: (value: any, record: any) => React.ReactNode;
};

type Props = {
  headers: BaseTableHeader[];
  records: Record<string, any>[];
  isLoading?: boolean;
};

export const BaseTable = ({ headers, records, isLoading }: Props) => {
  return (
    <div
      className={clsx("relative max-w-full overflow-auto bg-white", {
        "bg-slate-200 opacity-60 transition-all": isLoading,
      })}
    >
      <ResizableTableContainer>
        <Table>
          <TableHeader>
            {headers.map(({ title, resizable, field }, idx) => {
              return (
                <ResizableColumn
                  isRowHeader={idx === 0}
                  key={field}
                  resizable={resizable && idx !== headers.length - 1}
                >
                  {title}
                </ResizableColumn>
              );
            })}
          </TableHeader>
          <TableBody>
            {records.map((record, i) => (
              <Row key={i}>
                {headers.map((header) => (
                  <Cell key={header.field}>
                    {header.render
                      ? header.render(record[header.field], record)
                      : record[header.field]}
                  </Cell>
                ))}
              </Row>
            ))}
          </TableBody>
        </Table>
      </ResizableTableContainer>
    </div>
  );
};
