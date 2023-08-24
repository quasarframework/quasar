/**
 * Keeps track of enabled features through interface declaration merging capabilities.
 */
export interface QuasarFeatureFlags {
  [index: string]: boolean;
}

/**
 * Helper to create flag-guards.
 *
 * Example: to enable 'ssr' types create a `ssr-flag.d.ts` with this content
 *
 * ```typescript
 * // This import enable module augmentation instead of module overwrite
 * import 'quasar';
 *
 * declare module 'quasar' {
 *   // This will be merged with other definitions
 *   //  thanks to interface declaration merging
 *   interface QuasarFeatureFlags {
 *     ssr: true; // The object key is the feature flag name
 *   }
 * }
 * ```
 *
 * and flag-guard your types like this
 *
 * ```typescript
 * type HasSsr<T, U> = IsFeatureEnabled<'ssr', T, U>;
 * ```
 *
 * You can then use it like this for intersection types (where null type is `{}`)
 *
 * ```typescript
 * type Intersection = {...} & HasSsr<{ ssrContext?: QSsrContext | null }, {}>;
 * ```
 *
 * and like this for discriminated unions (where null type is `never`)
 *
 * ```typescript
 * type Union = {...} | HasSsr<{ ssrContext?: QSsrContext | null }, never>;
 * ```
 */
export type IsFeatureEnabled<
  O extends string,
  T,
  U = {}
> = QuasarFeatureFlags[O] extends true ? T : U;

export type HasSsr<T, U = {}> = IsFeatureEnabled<"ssr", T, U>;
export type HasStore<T, U = {}> = IsFeatureEnabled<"store", T, U>;

export type HasPwa<T, U = {}> = IsFeatureEnabled<"pwa", T, U>;

export type HasCapacitor<T, U = {}> = IsFeatureEnabled<"capacitor", T, U>;
export type HasCordova<T, U = {}> = IsFeatureEnabled<"cordova", T, U>;
export type HasBex<T, U = {}> = IsFeatureEnabled<"bex", T, U>;
