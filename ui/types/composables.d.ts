import { QDialog } from "quasar";
import { MetaOptions } from "./meta";
import { Ref } from "vue";
import { QVueGlobals } from "./globals";

interface useRenderCacheObject {
  getCache: <T = any>(key: string, defaultValue?: T) => T | undefined;
  getCacheByFn: <T = any>(key: string, fn: () => T) => T;
  setCache: <T = any>(key: string, value: T) => void;
  clearCache: (key?: string) => void;
}

export function useRenderCache(): useRenderCacheObject;

interface useDialogPluginComponent {
  <T = any>(): {
    dialogRef: Ref<QDialog | undefined>;
    onDialogHide: () => void;
    onDialogOK: (payload?: T) => void;
    onDialogCancel: () => void;
  };
  emits: ["ok", "hide"];
  emitsObject: {
    ok: (payload?: any) => true;
    hide: () => true;
  };
}

export const useDialogPluginComponent: useDialogPluginComponent;

interface UseFormChildOptions {
  validate: () => boolean | Promise<boolean>;
  resetValidation?: () => void;
  requiresQForm?: boolean;
}

export function useFormChild(options: UseFormChildOptions): void;

export function useMeta(options: MetaOptions | (() => MetaOptions)): void;

export function useQuasar(): QVueGlobals;

interface useTickObject {
  registerTick(fn: () => void): void;
  removeTick(): void;
}

export function useTick(): useTickObject;

interface useTimeoutObject {
  registerTimeout(fn: () => void, delay?: string | number): void;
  removeTimeout(): void;
}

export function useTimeout(): useTimeoutObject;
