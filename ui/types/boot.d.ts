import { Request, Response } from "express";
import Vue, { ComponentOptions, VueConstructor } from "vue";
import VueRouter from "vue-router";
import { HasSsr, HasStore } from "./feature-flag";

export interface QSsrContext {
  req: Request;
  res: Response;
  url: Request["url"];
}

export type HasSsrBootParams = HasSsr<{ ssrContext?: QSsrContext | null }>;
export type HasStoreBootParams<S = any> = HasStore<{ store: S }>;

export interface BootFileParams<TStore>
  extends HasSsrBootParams,
    HasStoreBootParams<TStore> {
  app: ComponentOptions<Vue>;
  Vue: VueConstructor<Vue>;
  router: VueRouter;
  urlPath: string;
  redirect: (url: string) => void;
}

export type BootCallback<TStore> = (params: BootFileParams<TStore>) => void | Promise<void>;
