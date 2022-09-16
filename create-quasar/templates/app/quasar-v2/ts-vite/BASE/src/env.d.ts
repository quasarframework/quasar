/* eslint-disable */
import { StyleValue } from 'vue';

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      class?: any;
      style?: StyleValue;
    }
  }
}

export {};