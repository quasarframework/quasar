import type { ConfigureCallback } from "./configuration";

import type { BootCallback } from "./boot";
import type { PrefetchCallback } from "./prefetch";
import type { RouteCallback } from "./route";
import type { StoreCallback } from "./store";

import type {
  SsrMiddlewareCallback,
  SsrInjectDevMiddlewareCallback,
  SsrCreateCallback,
  SsrListenCallback,
  SsrCloseCallback,
  SsrServeStaticContentCallback,
  SsrRenderPreloadTagCallback
} from "./ssr";

/** Some arguments are available only if you enable the related mode: `store` when using the Store, `ssrContext` when using SSR, etc */

export function defineConfig(callback: ConfigureCallback): ConfigureCallback;

export function defineBoot(
  callback: BootCallback
): BootCallback;

export function definePreFetch(
  callback: PrefetchCallback
): PrefetchCallback;

export function defineRouter(
  callback: RouteCallback
): RouteCallback;

export function defineStore(callback: StoreCallback): StoreCallback;

export function defineSsrMiddleware(
  callback: SsrMiddlewareCallback
): SsrMiddlewareCallback;

export function defineSsrCreate(
  callback: SsrCreateCallback
): SsrCreateCallback;

export function defineSsrInjectDevMiddleware(
  callback: SsrInjectDevMiddlewareCallback,
): SsrInjectDevMiddlewareCallback;


export function defineSsrListen(
  callback: SsrListenCallback
): SsrListenCallback;

export function defineSsrClose(
  callback: SsrCloseCallback
): SsrCloseCallback;

export function defineSsrServeStaticContent(
  callback: SsrServeStaticContentCallback
): SsrServeStaticContentCallback;

export function defineSsrRenderPreloadTag(
  callback: SsrRenderPreloadTagCallback
): SsrRenderPreloadTagCallback;
