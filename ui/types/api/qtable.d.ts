// Error on "quasar" import shown in IDE is normal, as we only have Components/Directives/Plugins types after the build step
// The import will work correctly at runtime
import { QTableProps } from "quasar";

export type QTableColumn<
  Row extends Record<string, any> = any,
  Key = keyof Row extends string ? keyof Row : string,
  Field = Key | ((row: Row) => any)
> = Omit<NonNullable<QTableProps["columns"]>[number], "field" | "format"> & {
  field: Field;
  format?: (val: any, row: Row) => string;
};
