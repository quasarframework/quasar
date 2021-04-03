import { Express, Request, Response } from "express";

interface RenderVueParams {
  req: Request;
  res: Response;
}

interface RenderError extends Error {
  url: Request["url"];
}

interface RenderErrorParams extends RenderVueParams {
  err: RenderError;
}

interface SsrMiddlewareRender {
  vue: (params: RenderVueParams) => Promise<string>;
  error: (params: RenderErrorParams) => void;
}

interface SsrMiddlewareParams {
  app: Express;
  resolveUrlPath: (url: string) => string;
  publicPath: string;
  render: SsrMiddlewareRender;
}

export type SsrMiddlewareCallback = (
  params: SsrMiddlewareParams
) => void | Promise<void>;
