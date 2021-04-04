import { Express, Request, Response } from "express";

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

interface SsrMiddlewareRender {
  vue: (ssrContext: RenderVueParams) => Promise<string>;
  error: (ssrContext: RenderErrorParams) => void;
}

interface SsrMiddlewareFolders {
  root: string;
  public: string;
}

interface SsrMiddlewareParams {
  app: Express;
  resolveUrlPath: (url: string) => string;
  publicPath: string;
  folders: SsrMiddlewareFolders;
  render: SsrMiddlewareRender;
}

export type SsrMiddlewareCallback = (
  params: SsrMiddlewareParams
) => void | Promise<void>;
