type WebStorageGetMethodReturnType =
  | Date
  | RegExp
  | number
  | boolean
  | string
  | object;

export type WebStorageGetItemMethodType = <
  T extends WebStorageGetMethodReturnType = WebStorageGetMethodReturnType
>(
  key: string
) => T | null;

export type WebStorageGetIndexMethodType = <
  T extends WebStorageGetMethodReturnType = WebStorageGetMethodReturnType
>(
  index: number
) => T | null;
