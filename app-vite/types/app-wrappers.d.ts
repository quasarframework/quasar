import type { ConfigureCallback } from "./configuration.d.ts";

import type { BootCallback } from "./boot.d.ts";
import type { PrefetchCallback } from "./prefetch.d.ts";
import type { RouteCallback } from "./route.d.ts";
import type { StoreCallback } from "./store.d.ts";

import type {
  SsrCloseCallback,
  SsrCreateCallback,
  SsrInjectDevMiddlewareCallback,
  SsrListenCallback,
  SsrMiddlewareCallback,
  SsrRenderPreloadTagCallback,
  SsrServeStaticContentCallback
} from "./ssr/index.d.ts";

import type {
  SsgGetPagesCallback,
  SsgRenderPreloadTagCallback
} from "./ssg/index.d.ts";

import type {
  IndexAPICallback,
  InstallAPICallback,
  PromptsAPICallback,
  UninstallAPICallback
} from "./app-extension.d.ts";

/** Some arguments are available only if you enable the related mode: `store` when using the Store, `ssrContext` when using SSR, etc */

/**
 * Define the function that returns your Quasar configuration object.
 * @param callback {@link ConfigureCallback}
 */
export function defineConfig(callback: ConfigureCallback): ConfigureCallback;

/**
 * Define the boot function.
 * @param callback {@link BootCallback}
 */
export function defineBoot(callback: BootCallback): BootCallback;

/**
 * Define the preFetch function.
 * @param callback {@link PrefetchCallback}
 */
export function definePreFetch(callback: PrefetchCallback): PrefetchCallback;

/**
 * Define the function that creates the Vue Router instance.
 * @param callback {@link RouteCallback}
 */
export function defineRouter(callback: RouteCallback): RouteCallback;

/**
 * Define the function that creates the Pinia instance.
 * @param callback {@link StoreCallback}
 */
export function defineStore(callback: StoreCallback): StoreCallback;

/**
 * Define the SSR middleware function.
 * @param callback {@link SsrMiddlewareCallback}
 */
export function defineSsrMiddleware(
  callback: SsrMiddlewareCallback
): SsrMiddlewareCallback;

/**
 * Define the SSR create function.
 * @param callback {@link SsrCreateCallback}
 */
export function defineSsrCreate(callback: SsrCreateCallback): SsrCreateCallback;

/**
 * Define the SSR inject dev middleware function.
 * @param callback {@link SsrInjectDevMiddlewareCallback}
 */
export function defineSsrInjectDevMiddleware(
  callback: SsrInjectDevMiddlewareCallback
): SsrInjectDevMiddlewareCallback;

/**
 * Define the SSR listen function.
 * @param callback {@link SsrListenCallback}
 */
export function defineSsrListen(callback: SsrListenCallback): SsrListenCallback;

/**
 * Define the SSR close function.
 * @param callback {@link SsrCloseCallback}
 */
export function defineSsrClose(callback: SsrCloseCallback): SsrCloseCallback;

/**
 * Define the SSR serve static content function.
 * @param callback {@link SsrServeStaticContentCallback}
 */
export function defineSsrServeStaticContent(
  callback: SsrServeStaticContentCallback
): SsrServeStaticContentCallback;

/**
 * Define the SSR render preload tag function.
 * @param callback {@link SsrRenderPreloadTagCallback}
 */
export function defineSsrRenderPreloadTag(
  callback: SsrRenderPreloadTagCallback
): SsrRenderPreloadTagCallback;

/**
 * Define the SSG render preload tag function.
 * @param callback {@link SsgRenderPreloadTagCallback}
 */
export function defineSsgRenderPreloadTag(
  callback: SsgRenderPreloadTagCallback
): SsgRenderPreloadTagCallback;

/**
 * Define the SSG get pages function.
 * @param callback {@link SsgGetPagesCallback}
 */
export function defineSsgGetPages(
  callback: SsgGetPagesCallback
): SsgGetPagesCallback;

/**
 * Define the index script function.
 * @param callback {@link IndexAPICallback}
 */
export function defineIndexScript(callback: IndexAPICallback): IndexAPICallback;

/**
 * Define the install script function.
 * @param callback {@link InstallAPICallback}
 */
export function defineInstallScript(
  callback: InstallAPICallback
): InstallAPICallback;

/**
 * Define the uninstall script function.
 * @param callback {@link UninstallAPICallback}
 */
export function defineUninstallScript(
  callback: UninstallAPICallback
): UninstallAPICallback;

/**
 * Define the prompts script function.
 * @param callback {@link PromptsAPICallback}
 */
export function definePromptsScript(
  callback: PromptsAPICallback
): PromptsAPICallback;
