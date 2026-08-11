import type { HasSsr } from "quasar";
// oxlint-disable-next-line unicorn/prefer-export-from
import type {
  QSsrContext,
  RenderParams,
  RenderVueParams
} from "./ssrcontext.d.ts";

export type HasSsrParam = HasSsr<{ ssrContext?: QSsrContext | null }>;

export type { SsrDriver } from "./driver";
export * from "./ssrmiddleware";

export type { QSsrContext, RenderParams, RenderVueParams };
