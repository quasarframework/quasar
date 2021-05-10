import { Request, Response } from "express";
import { HasSsr } from "quasar";

interface QSsrContext {
  req: Request;
  res: Response;
  url: Request["url"];
}

export type HasSsrParam = HasSsr<{ ssrContext?: QSsrContext | null }>;
