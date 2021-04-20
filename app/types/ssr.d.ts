import { Request, Response } from "express";
import { HasSsr } from "quasar";

interface QSsrContext {
  req: Request;
  res: Response;
}

export type HasSsrParam = HasSsr<{ ssrContext?: QSsrContext | null }>;
