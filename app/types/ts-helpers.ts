// Needed to prevent TS to collapse `'value1' | 'value2' | string` to `string`, which breaks first parameter autocomplete
// See: https://github.com/microsoft/TypeScript/issues/29729#issuecomment-832522611
export type LiteralUnion<T extends U, U = string> =
  | T
  | (U & Record<never, never>);
