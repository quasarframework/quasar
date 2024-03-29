import { QDialog } from "quasar";
import { MetaOptions } from "./meta";
import { Ref } from "vue";
import { QVueGlobals } from "./globals";

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

export function useHydration(): {
  isHydrated: Ref<boolean>;
};

export function useInterval(): {
  registerInterval(fn: () => void, interval: string | number): void;
  removeInterval(): void;
};

export function useId(opts?: {
  getValue?: () => string | null | undefined;
  required?: boolean;
}): {
  id: Ref<string>;
};

export function useMeta(options: MetaOptions | (() => MetaOptions)): void;

export function useQuasar(): QVueGlobals;

export function useRenderCache(): {
  getCache: <T = any>(key: string, defaultValue?: T | (() => T)) => T;
  setCache: <T = any>(key: string, value: T) => void;
  hasCache: (key: string) => boolean;
  clearCache: (key?: string) => void;
};

export function useSplitAttrs(): {
  attributes: Ref<Record<string, string | null | undefined>>;
  listeners: Ref<Record<string, (...args: any[]) => any>>;
};

export function useTick(): {
  registerTick(fn: () => void): void;
  removeTick(): void;
};

export function useTimeout(): {
  registerTimeout(fn: () => void, delay?: string | number): void;
  removeTimeout(): void;
};
