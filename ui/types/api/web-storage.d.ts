import { MaybeRefOrGetter, Ref } from "vue";

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
 * The typed keys of each storage area, for `useItem()`. Augment them
 * once to have your keys checked at every call:
 *
 *   declare module "quasar" {
 *     interface LocalStorageItems {
 *       theme: "light" | "dark";
 *     }
 *     interface SessionStorageItems {
 *       draft: { title: string };
 *     }
 *   }
 *
 * A key that is not declared accepts any storable value; its default,
 * when given, sets the type.
 */
// oxlint-disable-next-line typescript/no-empty-object-type
export interface LocalStorageItems {}

// oxlint-disable-next-line typescript/no-empty-object-type
export interface SessionStorageItems {}

export interface WebStorageUseItemOptions<T> {
  default?: T;
  deep?: boolean;
  disabled?: MaybeRefOrGetter<boolean>;
  onError?: (err: Error) => void;
}

export type WebStorageItemRef<T = WebStorageGetMethodReturnType | null> =
  Ref<T> & {
    stop: () => void;
  };

export interface WebStorageUseItemMethodType<Items> {
  <K extends keyof Items & string>(
    key: K,
    options: WebStorageUseItemOptions<Items[K]> & { default: Items[K] }
  ): WebStorageItemRef<Items[K]>;
  <K extends keyof Items & string>(
    key: K,
    options?: WebStorageUseItemOptions<Items[K]>
  ): WebStorageItemRef<Items[K] | null>;
  <K extends string, T extends WebStorageGetMethodReturnType>(
    key: K extends keyof Items ? never : K,
    options: WebStorageUseItemOptions<T> & { default: T }
  ): WebStorageItemRef<T>;
  <
    K extends string,
    T extends WebStorageGetMethodReturnType = WebStorageGetMethodReturnType
  >(
    key: K extends keyof Items ? never : K,
    options?: WebStorageUseItemOptions<T>
  ): WebStorageItemRef<T | null>;
}

export type LocalStorageUseItemMethodType =
  WebStorageUseItemMethodType<LocalStorageItems>;

export type SessionStorageUseItemMethodType =
  WebStorageUseItemMethodType<SessionStorageItems>;
