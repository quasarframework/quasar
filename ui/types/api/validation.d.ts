// Keep in sync with ui/src/utils/patterns.js
export type EmbeddedValidationRule = "date" | "dateStrict" | "time" | "timeStrict" | "fulltime" | "timeOrFulltime" | "hexColor" | "hexaColor" | "hexOrHexaColor" | "rgbColor" | "rgbaColor" | "rgbOrRgbaColor" | "hexOrRgbColor" | "hexaOrRgbaColor" | "anyColor";

export type ValidationRule<T = any> = EmbeddedValidationRule | ((value: T) => boolean | string);
