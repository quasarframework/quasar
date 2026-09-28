import { MaybeRefOrGetter, Ref } from "vue";

export type CookiesGetMethodType = <T = string | null>(name: string) => T;

// what get() hands back: a String, or the Object/Array a JSON cookie holds
type CookieValue = string | object;

/**
 * The typed cookie names, for `useCookie()`. Augment it once to have
 * your cookies checked at every call:
 *
 *   declare module "quasar" {
 *     interface CookieValues {
 *       theme: "light" | "dark";
 *     }
 *   }
 *
 * A cookie that is not declared accepts any cookie value; its default,
 * when given, sets the type by what it returns.
 */
// oxlint-disable-next-line typescript/no-empty-object-type
export interface CookieValues {}

export interface CookieRefOptions<T> {
  default?: () => T;
  deep?: boolean;
  disabled?: MaybeRefOrGetter<boolean>;
  expires?: number | string | Date;
  path?: string;
  domain?: string;
  sameSite?: "Lax" | "Strict" | "None";
  httpOnly?: boolean;
  secure?: boolean;
  other?: string;
}

// what a default types the ref as: a String default leaves every
// String assignable (declare the cookie in CookieValues for a union)
type CookieValueOf<T> = T extends string ? string : T;

// assigning null removes the cookie (or resets it to the default)
export type CookieRef<T = CookieValue | null> = Ref<T, T | null> & {
  stop: () => void;
};

export interface CookiesUseCookieMethodType {
  <K extends keyof CookieValues & string>(
    name: K,
    options: CookieRefOptions<CookieValues[K]> & {
      default: () => CookieValues[K];
    }
  ): CookieRef<CookieValues[K]>;
  <K extends keyof CookieValues & string>(
    name: K,
    options?: CookieRefOptions<CookieValues[K]>
  ): CookieRef<CookieValues[K] | null>;
  <K extends string, T extends CookieValue>(
    name: K extends keyof CookieValues ? never : K,
    options: CookieRefOptions<T> & { default: () => T }
  ): CookieRef<CookieValueOf<T>>;
  <K extends string, T extends CookieValue = CookieValue>(
    name: K extends keyof CookieValues ? never : K,
    options?: CookieRefOptions<T>
  ): CookieRef<T | null>;
}
