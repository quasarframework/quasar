import { Request, Response } from 'express';
import Vue, { ComponentOptions, VueConstructor } from 'vue';
import VueRouter from 'vue-router';

export interface QSsrContext {
    req: Request;
    res: Response;
    url: Request['url'];
}

export interface BootFileParams<TStore = any> {
    app: Vue;
    Vue: VueConstructor<Vue>;
    store: TStore;
    router: VueRouter;
    ssrContext?: QSsrContext | null;
}

type BootCallback = (params: BootFileParams) => void | Promise<void>;

export function boot(callback: BootCallback): BootCallback;
