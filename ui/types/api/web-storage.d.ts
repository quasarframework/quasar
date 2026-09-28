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
 * The typed keys of each storage area, for `useStorage()`. Augment them
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
 * when given, sets the type by what it returns.
 */
// oxlint-disable-next-line typescript/no-empty-object-type
export interface LocalStorageItems {}

// oxlint-disable-next-line typescript/no-empty-object-type
export interface SessionStorageItems {}

export interface WebStorageRefOptions<T> {
  default?: () => T;
  deep?: boolean;
  disabled?: MaybeRefOrGetter<boolean>;
  onError?: (err: Error) => void;
}

// what a default types the ref as: a String, Number or Boolean default
// leaves every value of that type assignable (declare the key in
// LocalStorageItems/SessionStorageItems for a union)
type WebStorageValueOf<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T;

// assigning null removes the item (or resets it to the default)
export type WebStorageRef<T = WebStorageGetMethodReturnType | null> = Ref<
  T,
  T | null
> & {
  stop: () => void;
};

export interface WebStorageUseStorageMethodType<Items> {
  <K extends keyof Items & string>(
    key: K,
    options: WebStorageRefOptions<Items[K]> & { default: () => Items[K] }
  ): WebStorageRef<Items[K]>;
  <K extends keyof Items & string>(
    key: K,
    options?: WebStorageRefOptions<Items[K]>
  ): WebStorageRef<Items[K] | null>;
  <K extends string, T extends WebStorageGetMethodReturnType>(
    key: K extends keyof Items ? never : K,
    options: WebStorageRefOptions<T> & { default: () => T }
  ): WebStorageRef<WebStorageValueOf<T>>;
  <
    K extends string,
    T extends WebStorageGetMethodReturnType = WebStorageGetMethodReturnType
  >(
    key: K extends keyof Items ? never : K,
    options?: WebStorageRefOptions<T>
  ): WebStorageRef<T | null>;
}

export type LocalStorageUseStorageMethodType =
  WebStorageUseStorageMethodType<LocalStorageItems>;

export type SessionStorageUseStorageMethodType =
  WebStorageUseStorageMethodType<SessionStorageItems>;
