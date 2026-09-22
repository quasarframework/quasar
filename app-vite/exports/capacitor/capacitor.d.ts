import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Wraps Capacitor config with sensible defaults derived from Quasar's runtime
 * context (set as `process.env.QUASAR_*` when invoked through Quasar CLI).
 * Always defaults `webDir` to `'www'` (Quasar build output) and the splash
 * screen plugin's `androidScaleType` to `'CENTER_CROP'` (Icon Genie composes
 * the splash screens for it). In dev mode, injects `server.url` (and
 * `server.cleartext` for Android) unless the user has already set them.
 * User-set values always win.
 *
 * Accepts either a plain config object, a sync function, or an async function
 * that returns (or resolves to) a config.
 */
export function defineCapacitorConfig<T extends CapacitorConfig>(input: T): T;
export function defineCapacitorConfig<T extends CapacitorConfig>(
  input: () => T
): T;
export function defineCapacitorConfig<T extends CapacitorConfig>(
  input: () => Promise<T>
): Promise<T>;
