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

/**
 * The keys of the reactive `items` view of each storage area. Augment
 * them to type your own keys:
 *
 *   declare module "quasar" {
 *     interface LocalStorageItems {
 *       theme?: "light" | "dark" | null;
 *     }
 *     interface SessionStorageItems {
 *       draft?: { title: string } | null;
 *     }
 *   }
 */
export interface LocalStorageItems {
  [key: string]: WebStorageGetMethodReturnType | null | undefined;
}

export interface SessionStorageItems {
  [key: string]: WebStorageGetMethodReturnType | null | undefined;
}
