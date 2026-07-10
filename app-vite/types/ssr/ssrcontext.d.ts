import type { QVueGlobals } from "quasar";
import type { HasStoreParam } from "../store.d.ts";
import type { SsrDriverTypes } from "./driver.d.ts";

/**
 * Quasar SSR context object.
 */
export interface QSsrContext extends HasStoreParam {
  url?: string;
  originalUrl?: string;
  req: SsrDriverTypes["request"];
  res: SsrDriverTypes["response"];

  /**
   * The $q object
   */
  readonly $q: QVueGlobals;

  /** The global "nonce" attribute to use */
  nonce?: string;

  /**
   * Registers a function to be executed server-side after
   * app has been rendered with Vue. You might need this
   * to access ssrContext again after it has been fully processed.
   * Example: ssrContext.onRendered(() => { ... })
   */
  onRendered: (fn: () => void) => void;

  /**
   * Set this to a function which will be executed server-side
   * after the app has been rendered with Vue.
   * We recommend using the "onRendered" instead.

   * Purpose: backward compatibility with Vue ecosystem packages
   * (like @vue/apollo-ssr)
   * Example: ssrContext.rendered = () => { ... }
   */
  rendered?: () => void;
}

export interface RenderParams extends Pick<
  QSsrContext,
  "req" | "res" | "url" | "originalUrl"
> {}

export interface RenderVueParams extends RenderParams, Record<string, any> {}
