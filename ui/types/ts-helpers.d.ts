export type StringDictionary<T extends string> = Required<
  { [index in T]: string }
>;
