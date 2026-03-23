type WebStorageGetMethodReturnType =
  | Date
  | RegExp
  | number
  | boolean
  | string
  | object;

type WebStorageGetKeyMethodReturnType = string;

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

export type WebStorageGetKeyMethodType = <
  T extends WebStorageGetKeyMethodReturnType = WebStorageGetKeyMethodReturnType
>(
  index: number
) => T | null;

export type WebStorageGetAllKeysMethodType = () => string[];
