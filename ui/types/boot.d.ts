import Vue, { ComponentOptions, VueConstructor } from "vue";
import VueRouter from "vue-router";
import { HasSsr, HasStore } from "./feature-flag";

export interface QSsrContext {
  req: {
    headers: Record<string, string>;
  };
  res: {
    setHeader(name: string, value: string): void;
  };
}

export type HasSsrBootParams = HasSsr<{ ssrContext?: QSsrContext | null }>;
export type HasStoreBootParams<S = any> = HasStore<{ store: S }>;

export interface BootFileParams<TStore = any>
  extends HasSsrBootParams,
    HasStoreBootParams<TStore> {
  app: ComponentOptions<Vue>;
  Vue: VueConstructor<Vue>;
  router: VueRouter;
  urlPath: string;
  redirect: (url: string) => void;
}
