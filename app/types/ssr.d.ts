import { Request, Response } from "express";
import { HasSsr } from "quasar";

interface QSsrContext {
  req: Request;
  res: Response;

  /**
   * The $q object
   */
  $q?: object;

  /**
   * The state of the Vuex store;
   * gets filled in by Vuex itself
   */
  state?: any;

  /** The global "nonce" attribute to use */
  nonce?: string;

  /**
   * Registers a function to be executed server-side after
   * app has been rendered with Vue. You might need this
   * to access ssrContext again after it has been fully processed.
   * Example: ssrContext.onRendered(() => { ... })
   */
  onRendered?: (fn: () => void) => void;

  /**
   * Set this to a function which will be executed server-side
   * after the app has been rendered with Vue.
   * We recommend using the "onRendered" instead.

   * Purpose: backward compatibility with Vue ecosystem packages
   * (like @vue/apollo-ssr)
   * Example: ssrContext.rendered = () => { ... }
   */
  rendered?: () => void | void;
}

export type HasSsrParam = HasSsr<{ ssrContext?: QSsrContext | null }>;
