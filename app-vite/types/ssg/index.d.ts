import type { HasSsg } from "quasar";
import type { QSsrContext, RenderVueParams } from "../ssr/ssrcontext.d.ts";
import type { QuasarContext } from "../configuration/context.d.ts";

export type HasSsgParam = HasSsg<{ ssrContext?: QSsrContext | null }>;

interface SsgRenderPreloadTagCallbackOptions {
  ssrContext: RenderVueParams;
}

export type SsgRenderPreloadTagCallback = (
  file: string,
  options: SsgRenderPreloadTagCallbackOptions
) => string;

export interface SsgGetPagesParams {
  ctx: QuasarContext;
}

export interface SsgPage {
  /**
   * The vue-router route to render.
   * It must be a valid route in your Vue Router configuration.
   */
  route: string;
  /**
   * Optional label to identify the SSG page in logs.
   */
  label?: string;
  /**
   * Optional directory to place the generated HTML file in.
   * Must use relative path to the dist folder.
   * It will be joined with the quasar.config > build > distDir.
   * If not provided, the route will be used to determine the directory.
   */
  dir?: string;
  /**
   * Optional filename to use for the generated HTML file.
   * @default 'index.html'
   */
  filename?: string;
  /**
   * Optional SSR context to use when rendering the page.
   * If not provided, the default SSR context will be used.
   * @type ssrContext {@link QSsrContext}
   */
  ssrContext?: QSsrContext;
}

export type SsgGetPagesCallback = (
  params: SsgGetPagesParams
) => SsgPage[] | Promise<SsgPage[]>;
