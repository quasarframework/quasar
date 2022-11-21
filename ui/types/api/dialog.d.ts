// Error on "quasar" import shown in IDE is normal, as we only have Components/Directives/Plugins types after the build step
// The import will work correctly at runtime
import { QInputProps, QOptionGroupProps } from "quasar";

// Taken from https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

// https://html.spec.whatwg.org/multipage/input.html#attr-input-type
type InputType =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";
type DatalessInputType = Extract<InputType, "submit" | "reset">;

type PromptInputType = "textarea" | Exclude<InputType, DatalessInputType>;

export type QDialogInputPrompt<T = string> = {
  /**
   * The initial value of the input
   */
  model: T;
  /**
   * Optional property to determine the input field type
   *
   * @defaultValue "text"
   */
  type?: PromptInputType;

  /**
   * Is typed content valid?
   *
   * @param val The value of the input
   * @returns The text passed validation or not
   */
  isValid?: (value: T) => boolean;
} & Partial<Omit<QInputProps, "modelValue" | "onUpdate:modelValue" | "type">> &
  Partial<NonFunctionProperties<HTMLInputElement>>;

type SelectionPromptType = NonNullable<QOptionGroupProps["type"]>
export type QDialogSelectionPrompt<
  // As this gets used as is in generated types, we must define default values for generic params.
  // Example: `options?: QDialogSelectionPrompt;` <- notice the missing type params.
  // We can't use "radio" as the default either, because that would make it the only value.
  TType extends SelectionPromptType = SelectionPromptType,
  TModel = TType extends "radio" ? string : readonly any[]
> = {
  /**
   * The value of the selection
   * If the `type` is "radio"(default), the value is a string, otherwise it's an array
   */
  model: TModel;

  /**
   * The type of the selection
   *
   * @defaultValue "radio"
   */
  type?: TType;

  /**
   * The list of options to interact with
   * Equivalent to `options` prop of the `QOptionGroup` component
   */
  items?: QOptionGroupProps["options"];

  /**
   * Is the model valid?
   *
   * @param model The current model (If the `type` is "radio"(default), the value is a string, otherwise it's an array)
   * @returns The selection passed validation or not
   */
  isValid?: (value: TModel) => boolean;
} & Partial<
  Omit<
    QOptionGroupProps,
    "modelValue" | "onUpdate:modelValue" | "type" | "options"
  >
> &
  Partial<NonFunctionProperties<HTMLElement>>;
