import { Express, Request, RequestHandler, Response, Handler, NextFunction } from "express";
import { ServeStaticOptions } from "serve-static";

interface RenderParams {
  req: Request;
  res: Response;
}

interface RenderVueParams extends RenderParams, Record<string, any> {}

interface RenderError extends Error {
  code: Response["statusCode"];
  url: Request["url"];
}

interface RenderErrorParams extends RenderParams {
  err: RenderError;
}

interface SsrMiddlewareServe {
  /**
   * It's essentially a wrapper over express.static() with a few convenient tweaks:
   * - the pathFromPublicFolder is a path resolved to the "public" folder out of the box
   * - the opts are the same as for express.static()
   * - opts.maxAge is used by default, taking into account the quasar.config.js > ssr > maxAge configuration; this sets how long the respective file(s) can live in browser's cache
   */
  static(
    path: string,
    options?: ServeStaticOptions<Response>
  ): RequestHandler<Response>;
  /**
   * Displays a wealth of useful debug information (including the stack trace).
   * Warning: It's available only in development and NOT in production.
   */
  error(ssrContext: RenderErrorParams): void;
}

type SsrMiddlewareRender = (ssrContext: RenderVueParams) => Promise<string>;

interface SsrMiddlewareFolders {
  root: string;
  public: string;
}

interface SsrMiddlewareResolve {
  /**
   * Whenever you define a route (with app.use(), app.get(), app.post() etc), you should use the resolve.urlPath() method so that you'll also keep into account the configured publicPath (quasar.config.js > build > publicPath).
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

interface SsrMiddlewareParams {
  app: Express;
  resolve: SsrMiddlewareResolve;
  publicPath: string;
  folders: SsrMiddlewareFolders;
  /**
   * Uses Vue and Vue Router to render the requested URL path.
   * @returns the rendered HTML string to return to the client
   */
  render: SsrMiddlewareRender;
  serve: SsrMiddlewareServe;
}

export type SsrMiddlewareCallback = (
  params: SsrMiddlewareParams
) => void | Promise<void>;

interface SsrHandlerParams {
  req: Request;
  res: Response;
  next: NextFunction;
}

interface SsrProductionExportParams extends SsrMiddlewareParams {
  /**
   * Terminal PORT env var or the default configured port
   * for the SSR webserver
   */
  port: number;
  /**
   * Wait for app to be initialized (run all SSR middlewares)
   * before starting to listen for clients
   */
  isReady(): Promise<void>;
  ssrHandler(
    params: SsrHandlerParams
  ): Promise<void>;
}

export type SsrProductionExportCallback = (
  params: SsrProductionExportParams
) => any;
