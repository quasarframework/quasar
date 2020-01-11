export type LooseDictionary = { [index in string]: any };

export type StringDictionary<T extends string> = Required<
  { [index in T]: string }
>;
