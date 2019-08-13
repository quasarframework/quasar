import Vue, { ComponentOptions, VueConstructor } from 'vue';
import VueRouter from 'vue-router';

export interface QSsrContext {
    req: {
        headers: Record<string, string>;
    };
    res: {
        setHeader(name: string, value: string): void;
    };
}

export interface BootFileParams<TStore = any> {
    app: Vue;
    Vue: VueConstructor<Vue>;
    store: TStore;
    router: VueRouter;
    ssrContext?: QSsrContext | null;
}