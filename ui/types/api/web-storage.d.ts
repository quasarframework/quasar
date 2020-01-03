type WebStorageGetMethodReturnType =
  | Date
  | RegExp
  | number
  | boolean
  | string
  | object;

export type WebStorageGetItemMethodType = <
  T extends WebStorageGetMethodReturnType = string
>(
  key: string
) => T | null;

export type WebStorageGetIndexMethodType = <
  T extends WebStorageGetMethodReturnType = string
>(
  index: number
) => T | null;
