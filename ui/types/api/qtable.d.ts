import { QTableProps } from "quasar";

export type QTableColumn<
  Row extends Record<string, any> = any,
  Key = keyof Row extends string ? keyof Row : string,
  Field = Key | ((row: Row) => any)
> = Omit<NonNullable<QTableProps["columns"]>[number], "field" | "format"> & {
  field: Field;
  format?: (val: any, row: Row) => string;
};
