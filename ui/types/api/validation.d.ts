// Keep in sync with ui/src/utils/patterns.js
export type EmbeddedValidationRule =
  | "date"
  | "time"
  | "fulltime"
  | "timeOrFulltime"
  | "email"
  | "hexColor"
  | "hexaColor"
  | "hexOrHexaColor"
  | "rgbColor"
  | "rgbaColor"
  | "rgbOrRgbaColor"
  | "hexOrRgbColor"
  | "hexaOrRgbaColor"
  | "anyColor";

type EmbeddedValidationRuleFn<T = any> = (value: T) => boolean;
export type ValidationRule<T = any> =
  | EmbeddedValidationRule
  | ((
      value: T,
      rules: Record<EmbeddedValidationRule, EmbeddedValidationRuleFn<T>>
    ) => boolean | string | Promise<boolean | string>);
