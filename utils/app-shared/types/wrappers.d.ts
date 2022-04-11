// These wrappers are into `app`, instead of `ui`, because they are only relevant to people
//  using a Quasar CLI project: TS devs using `quasar` package via Vue CLI plugin don't have
//  boot files or `quasar.config.js` where to use them.
// They are placed in a standalone file into `ui` because they must be reachable as `quasar/wrappers`.
// Not being exposed from `quasar`, they won't trigger the package side-effects when required into
//  a file evaluated by Node (in `quasar.config.js`, `configure` would be imported as
//  `const { configure } = require('quasar')`).
// This is a precaution measure to avoid future hard-to-backtrack bugs.

declare module "quasar/wrappers" {
  import { BootCallback } from "@quasar/app-webpack";
  import { ConfigureCallback } from "@quasar/app-webpack";
  import { PrefetchCallback } from "@quasar/app-webpack";
  import { RouteCallback } from "@quasar/app-webpack";
  import { StoreCallback } from "@quasar/app-webpack";
  import { SsrMiddlewareCallback } from "@quasar/app-webpack";
  import { SsrProductionExportCallback } from "@quasar/app-webpack";

  /** Some arguments are available only if you enable the related mode: `store` when using the Store, `ssrContext` when using SSR, etc */
  function boot<TState = any>(
    callback: BootCallback<TState>
  ): BootCallback<TState>;

  function configure(callback: ConfigureCallback): ConfigureCallback;

  function preFetch<TState = any>(
    callback: PrefetchCallback<TState>
  ): PrefetchCallback<TState>;

  function route<TState = any>(
    callback: RouteCallback<TState>
  ): RouteCallback<TState>;

  function store(callback: StoreCallback): StoreCallback;

  function ssrMiddleware(
    callback: SsrMiddlewareCallback
  ): SsrMiddlewareCallback;

  function ssrProductionExport(
    callback: SsrProductionExportCallback
  ): SsrProductionExportCallback;
}
