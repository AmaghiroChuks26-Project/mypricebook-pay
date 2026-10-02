import type { ReactNode } from "react";

export interface TableColumn<Row> {
  key: string;
  label: string;
  render: (row: Row) => ReactNode;
  align?: "left" | "right";
}

interface DataTableProps<Row> {
  columns: TableColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  caption: string;
}

export function DataTable<Row>({ caption, columns, rowKey, rows }: DataTableProps<Row>) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.align === "right" ? "cell-right" : ""} scope="col">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  data-label={column.label}
                  className={column.align === "right" ? "cell-right" : ""}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}