// Keep in sync with ui/src/utils/patterns.js
export type EmbeddedValidationRule = "date" | "time" | "fulltime" | "timeOrFulltime" | "email" | "hexColor" | "hexaColor" | "hexOrHexaColor" | "rgbColor" | "rgbaColor" | "rgbOrRgbaColor" | "hexOrRgbColor" | "hexaOrRgbaColor" | "anyColor";

export type ValidationRule<T = any> = EmbeddedValidationRule | ((value: T) => boolean | string | Promise<boolean | string>);
