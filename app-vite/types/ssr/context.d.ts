import { QVueGlobals } from "quasar";
import { HasStoreParam } from "../store";
import { SsrDriverTypes } from "./driver";

export interface QSsrContext extends HasStoreParam {
  url?: string;
  originalUrl?: string;
  req: SsrDriverTypes["request"];
  res: SsrDriverTypes["response"];

  /**
   * The $q object
   */
  $q: QVueGlobals;

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
