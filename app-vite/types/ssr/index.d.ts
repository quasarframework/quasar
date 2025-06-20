import { HasSsr } from "quasar";
import { QSsrContext } from "./context";

export type HasSsrParam = HasSsr<{ ssrContext?: QSsrContext | null }>;

export { SsrDriver } from "./driver";
export {
  RenderParams,
  RenderVueParams,
  RenderError,
  RenderErrorParams,

  SsrMiddlewareCallback,
  SsrCreateCallback,
  SsrInjectDevMiddlewareCallback,
  SsrListenCallback,
  SsrCloseCallback,
  SsrServeStaticContentCallback,
  SsrRenderPreloadTagCallback,
} from './ssrmiddleware';
export { QSsrContext };
