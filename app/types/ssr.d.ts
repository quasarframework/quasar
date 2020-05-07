import { Request, Response } from "express";
import { HasSsr } from "quasar";

declare module "quasar" {
  interface QSsrContext {
    req: Request;
    res: Response;
    url: Request["url"];
  }

  type HasSsrParam = HasSsr<{ ssrContext?: QSsrContext | null }>;
}
