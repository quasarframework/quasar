import { QField } from "quasar";
import { ComponentPublicInstance } from "vue";

export type QFormChildComponent = ComponentPublicInstance &
  Pick<QField, "validate" | "resetValidation">;
