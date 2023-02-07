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

export function useMeta(options: MetaOptions | (() => MetaOptions)): void;

export function useQuasar(): QVueGlobals;
