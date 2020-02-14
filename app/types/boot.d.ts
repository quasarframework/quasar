import { Request, Response } from "express";
import { HasSsr, HasStore } from "quasar";
import Vue, { ComponentOptions, VueConstructor } from "vue";
import VueRouter from "vue-router";

declare module "quasar" {
  interface QSsrContext {
    req: Request;
    res: Response;
    url: Request["url"];
  }

  type HasSsrBootParams = HasSsr<{ ssrContext?: QSsrContext | null }>;
  type HasStoreBootParams<S = any> = HasStore<{ store: S }>;

  interface BootFileParams<TStore>
    extends HasSsrBootParams,
      HasStoreBootParams<TStore> {
    app: ComponentOptions<Vue>;
    Vue: VueConstructor<Vue>;
    router: VueRouter;
    urlPath: string;
    redirect: (url: string) => void;
  }

  type BootCallback<TStore> = (
    params: BootFileParams<TStore>
  ) => void | Promise<void>;
}
