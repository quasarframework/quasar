import type { IncomingMessage, ServerResponse } from "node:http";
import type { Http2ServerRequest, Http2ServerResponse } from "node:http2";
import type {
  Server as HttpsServer,
  ServerOptions as HttpsServerOptions
} from "node:https";

import type { SsrDriverTypes } from "./driver.d.ts";
import type { RenderVueParams } from "./ssrcontext.d.ts";

export type HttpRedirectStatusCode = 301 | 302 | 303 | 307 | 308;

export interface SsrRenderRouteNotFoundError {
  readonly routeNotFound: true;
}
export interface SsrRenderRedirectError {
  readonly redirectHttpStatusCode: HttpRedirectStatusCode;
  readonly redirectUrl: string;
}

interface SsrMiddlewareResolve {
  /**
   * Whenever you define a route (with app.use(), app.get(), app.post() etc),
   * you should use the resolve.urlPath() method so that you'll also keep
   * into account the configured publicPath (quasar.config file > build > publicPath).
   */
  readonly urlPath: (url: string) => string;
  /**
   * Resolve folder path to the root (of the project in dev and of the
   * distributables in production). Under the hood, it does a path.join()
   * @param paths paths to join
   */
  readonly root: (...paths: string[]) => string;
  /**
   * Resolve folder path to the "/public" folder. Under the hood, it does a path.join()
   * @param paths paths to join
   */
  readonly public: (...paths: string[]) => string;
  /**
   * Resolve folder path to the "/src-ssr/server-assets" folder. Under the hood, it does a path.join()
   * @param paths paths to join
   */
  readonly serverAssets: (...paths: string[]) => string;
}

interface SsrMiddlewareFolders {
  /**
   * The root folder absolute path of the project in development
   * and of the distributables in production.
   */
  readonly root: string;
  /**
   * The "/public" folder absolute path
   * at runtime (dev or prod).
   */
  readonly public: string;
  /**
   * The "/src-ssr/server-assets" folder absolute path
   * at runtime (dev or prod).
   */
  readonly serverAssets: string;
}

interface SsrCreateParams {
  /**
   * On dev: devServer port;
   * On prod: process.env.PORT or quasar.config > ssr > prodPort
   */
  readonly port: number;
  /**
   * If you use HTTPS in development, this will hold the HTTPS server options
   * from your /quasar.config file.
   *
   * @type options {@link HttpsServerOptions}
   */
  readonly devHttpsOptions?: HttpsServerOptions;
  /**
   * Util fns to resolve paths.
   * @param resolve {@link SsrMiddlewareResolve}
   */
  readonly resolve: SsrMiddlewareResolve;
  /**
   * The configured quasar.config file > build > publicPath
   */
  readonly publicPath: string;
  /**
   * Absolute paths to important folders at runtime (dev or prod).
   * @param folders {@link SsrMiddlewareFolders}
   */
  readonly folders: SsrMiddlewareFolders;
  /**
   * Uses Vue and Vue Router to render the requested URL path.
   *
   * @throws {Error | SsrRenderRouteNotFoundError | SsrRenderRedirectError} when the rendering fails
   * @returns the rendered HTML string to return to the client
   */
  readonly render: (ssrContext: RenderVueParams) => Promise<string>;
}

export type SsrCreateCallback = (
  params: SsrCreateParams
) => SsrDriverTypes["app"] | Promise<SsrDriverTypes["app"]>;

interface SsrServeStaticContentParams extends SsrCreateParams {
  /**
   * Webserver app instance or whatever is returned from src-ssr/server -> create()
   */
  readonly app: SsrDriverTypes["app"];
}

interface SsrServeStaticFnParams {
  /**
   * The URL path to serve the static content at (without publicPath).
   */
  urlPath: string;

  /**
   * The sub-path from the publicFolder or an absolute path.
   */
  pathToServe: string;

  /**
   * Other custom options...
   */
  // Keep this in sync with ssr-prod-webserver
  opts?: { maxAge?: number };
}

type SsrServeStaticFn = (
  params: SsrServeStaticFnParams
) => void | Promise<void>;

export type SsrServeStaticContentCallback = (
  params: SsrServeStaticContentParams
) => SsrServeStaticFn | Promise<SsrServeStaticFn>;

type SsrRenderErrorFn = (params: {
  /**
   * The caught error that caused the render to fail.
   * It can be an instance of Error or any other value
   * thrown by the render() function.
   */
  err: unknown;
  req: SsrDriverTypes["request"];
}) => { errorHeaders: Record<string, string>; errorHtml: string };

interface SsrMiddlewareServe {
  /**
   * It's essentially a wrapper to serve static content with a few convenient tweaks:
   * - the pathToServe is a path resolved to the "public" folder out of the box
   * - the opts are the same as for express.static()
   * - opts.maxAge is used by default, taking into account the
   *    quasar.config file > ssr > maxAge configuration;
   *    this sets how long the respective file(s) can live in browser's cache
   *
   * The return value is whatever you return from by src-ssr/server -> serveStaticContent()
   *
   * @type static {@link SsrServeStaticFn}
   */
  readonly static: SsrServeStaticFn;
  /**
   * Displays a wealth of useful debug information (including the stack trace).
   * Warning: It's available only in development and NOT in production.
   *
   * @type devError {@link SsrRenderErrorFn}
   */
  readonly devError: SsrRenderErrorFn;
}

interface SsrMiddlewareParams extends SsrServeStaticContentParams {
  /**
   * @type serve {@link SsrMiddlewareServe}
   */
  readonly serve: SsrMiddlewareServe;
}

export type SsrMiddlewareCallback = (
  params: SsrMiddlewareParams
) => void | Promise<void>;

interface SsrListenHandlerResult {
  handler: SsrDriverTypes["listenResult"] | void;
}

export type SsrListenCallback = (
  params: SsrMiddlewareParams
) =>
  | SsrDriverTypes["listenResult"]
  | SsrListenHandlerResult
  | Promise<SsrDriverTypes["listenResult"]>
  | Promise<SsrListenHandlerResult>;

interface SsrCloseParams extends SsrMiddlewareParams {
  listenResult: SsrDriverTypes["listenResult"];
}

export type SsrCloseCallback = (params: SsrCloseParams) => any | Promise<any>;

interface SsrRenderPreloadTagCallbackOptions {
  ssrContext: RenderVueParams;
}

export type SsrRenderPreloadTagCallback = (
  file: string,
  options: SsrRenderPreloadTagCallbackOptions
) => string;

/**
 * The middleware to inject into the SSR webserver.
 * It is a Node.js middleware function that will be executed
 * for every request that the SSR webserver receives.
 */
type SsrInjectDevMiddlewareParam = (
  req: IncomingMessage | Http2ServerRequest,
  res: ServerResponse | Http2ServerResponse,
  next: (err?: Error) => void
) => unknown | Promise<unknown>;

type SsrInjectDevMiddlewareFn = (
  middleware: SsrInjectDevMiddlewareParam
) => void | Promise<void>;

export type SsrInjectDevMiddlewareCallback = (
  params: SsrMiddlewareParams
) => SsrInjectDevMiddlewareFn | Promise<SsrInjectDevMiddlewareFn>;
