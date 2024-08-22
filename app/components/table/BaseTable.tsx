/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResizableTableContainer } from "react-aria-components";

import {
  Cell,
  Column,
  ResizableColumn,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "~/builders/table";

export type BaseTableHeader = {
  title: string;
  resizable: boolean;
  field: string;
  render?: (value: any, record: any) => React.ReactNode;
};

type Props = {
  headers: BaseTableHeader[];
  records: Record<string, any>[];
};

export const BaseTable = ({ headers, records }: Props) => {
  return (
    <div className="max-w-full overflow-auto">
      <ResizableTableContainer>
        <Table>
          <TableHeader>
            {headers.map(({ title, resizable, field }, idx) => {
              //Not allow to resize the last column
              const Col = resizable && idx !== headers.length - 1 ? ResizableColumn : Column;
              return <Col key={field}>{title}</Col>;
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
