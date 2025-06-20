import { IncomingMessage, ServerResponse } from "node:http";
import { Http2ServerRequest, Http2ServerResponse } from "node:http2";
import {
  Server as HttpsServer,
  ServerOptions as HttpsServerOptions,
} from "node:https";
import { SsrDriverTypes } from "./driver";
import { QSsrContext } from "./context";

export interface RenderParams
  extends Pick<QSsrContext, "req" | "res" | "url" | "originalUrl"> {}

export interface RenderVueParams extends RenderParams, Record<string, any> {}

export interface RenderError extends Error {
  code: number;
  url: string;
}

interface RenderErrorParams extends RenderParams {
  err: RenderError;
}

interface SsrMiddlewareResolve {
  /**
   * Whenever you define a route (with app.use(), app.get(), app.post() etc), you should use the resolve.urlPath() method so that you'll also keep into account the configured publicPath (quasar.config file > build > publicPath).
   */
  urlPath(url: string): string;
  /**
   * Resolve folder path to the root (of the project in dev and of the distributables in production). Under the hood, it does a path.join()
   * @param paths paths to join
   */
  root(...paths: string[]): string;
  /**
   * Resolve folder path to the "public" folder. Under the hood, it does a path.join()
   * @param paths paths to join
   */
  public(...paths: string[]): string;
}

interface SsrMiddlewareFolders {
  root: string;
  public: string;
}

interface SsrCreateParams {
  /**
   * Terminal PORT env var or the default configured port
   * for the SSR webserver
   */
  port: number;
  /**
   * `devHttpsApp` will be automatically made available in `listen`
   * and middleware callback parameters if you use HTTPS in development.
   *
   * But, you can also ignore `devHttpsApp` and use this to configure
   * the `app` to handle HTTPS requests.
   */
  devHttpsOptions: HttpsServerOptions;
  resolve: SsrMiddlewareResolve;
  publicPath: string;
  folders: SsrMiddlewareFolders;
  /**
   * Uses Vue and Vue Router to render the requested URL path.
   *
   * @returns the rendered HTML string to return to the client
   */
  render: (ssrContext: RenderVueParams) => Promise<string>;
}

export type SsrCreateCallback = (
  params: SsrCreateParams,
) => SsrDriverTypes["app"] | Promise<SsrDriverTypes["app"]>;

interface SsrServeStaticContentParams extends SsrCreateParams {
  app: SsrDriverTypes["app"];
}

interface SsrServeStaticFnParams {
  /**
   * The URL path to serve the static content at (without publicPath).
   *
   * @default '/'
   */
  urlPath?: string;

  /**
   * The sub-path from the publicFolder or an absolute path.
   *
   * @default '.' (public folder itself)
   */
  pathToServe?: string;

  /**
   * Other custom options...
   */
  // Keep this in sync with ssr-prod-webserver
  opts?: { maxAge?: number };
}

type SsrServeStaticFn = (
  params: SsrServeStaticFnParams,
) => void | Promise<void>;

export type SsrServeStaticContentCallback = (
  params: SsrServeStaticContentParams,
) => SsrServeStaticFn;

interface SsrMiddlewareServe {
  /**
   * It's essentially a wrapper over express.static() with a few convenient tweaks:
   * - the pathToServe is a path resolved to the "public" folder out of the box
   * - the opts are the same as for express.static()
   * - opts.maxAge is used by default, taking into account the quasar.config file > ssr > maxAge configuration; this sets how long the respective file(s) can live in browser's cache
   */
  static: SsrServeStaticFn;
  /**
   * Displays a wealth of useful debug information (including the stack trace).
   * Warning: It's available only in development and NOT in production.
   */
  error(ssrContext: RenderErrorParams): void;
}

interface SsrMiddlewareParams extends SsrServeStaticContentParams {
  serve: SsrMiddlewareServe;
  /**
   * If you use HTTPS in development, this will be the
   * actual server that listens for clients.
   * It is a Node https.Server instance wrapper over the original "app".
   */
  devHttpsApp?: HttpsServer;
}

export type SsrMiddlewareCallback = (
  params: SsrMiddlewareParams,
) => void | Promise<void>;

interface SsrListenHandlerResult {
  handler: SsrDriverTypes["listenResult"] | void;
}

export type SsrListenCallback = (
  params: SsrMiddlewareParams,
) =>
  | SsrDriverTypes["listenResult"]
  | SsrListenHandlerResult
  | Promise<SsrDriverTypes["listenResult"]>
  | Promise<SsrListenHandlerResult>;

interface SsrCloseParams extends SsrMiddlewareParams {
  listenResult: SsrDriverTypes["listenResult"];
}

export type SsrCloseCallback = (params: SsrCloseParams) => void;

interface SsrRenderPreloadTagCallbackOptions {
  ssrContext: RenderVueParams;
}

export type SsrRenderPreloadTagCallback = (
  file: string,
  options: SsrRenderPreloadTagCallbackOptions,
) => string;

/**
 * The middleware to inject into the SSR webserver.
 * It is a Node.js middleware function that will be executed
 * for every request that the SSR webserver receives.
 */
type SsrInjectDevMiddlewareParam = (
  req: IncomingMessage | Http2ServerRequest,
  res: ServerResponse | Http2ServerResponse,
  next: (err?: Error) => void,
) => unknown | Promise<unknown>;

type SsrInjectDevMiddlewareFn = (
  middleware: SsrInjectDevMiddlewareParam,
) => void | Promise<void>;

export type SsrInjectDevMiddlewareCallback = (
  params: SsrMiddlewareParams,
) => SsrInjectDevMiddlewareFn | Promise<SsrInjectDevMiddlewareFn>;
