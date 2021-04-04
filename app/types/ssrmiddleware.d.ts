import { Express, Request, Response } from "express";

interface RenderVueParams {
  req: Request;
  res: Response;
}

interface RenderError extends Error {
  code: Response["statusCode"];
  url: Request["url"];
}

interface RenderErrorParams extends RenderVueParams {
  err: RenderError;
}

interface SsrMiddlewareFolders {
  root: string;
  public: string;
}

interface SsrMiddlewareRender {
  vue: (params: RenderVueParams) => Promise<string>;
  error: (params: RenderErrorParams) => void;
}

interface SsrMiddlewareParams {
  app: Express;
  resolveUrlPath: (url: string) => string;
  folders: SsrMiddlewareFolders;
  publicPath: string;
  render: SsrMiddlewareRender;
}

export type SsrMiddlewareCallback = (
  params: SsrMiddlewareParams
) => void | Promise<void>;
