import type { LiteralUnion } from "quasar";

/**
 * Augment this interface to add custom colors.
 *
 * @example
 * ```ts
 * declare module "quasar" {
 *   interface CustomColors {
 *     custom: string;
 *   }
 * }
 * ```
 */
export interface CustomColors {}

export type BrandColor =
  | "primary"
  | "secondary"
  | "accent"
  | "dark"
  | "positive"
  | "negative"
  | "info"
  | "warning";
type Color =
  | "red"
  | "pink"
  | "purple"
  | "deep-purple"
  | "indigo"
  | "blue"
  | "light-blue"
  | "cyan"
  | "teal"
  | "green"
  | "light-green"
  | "lime"
  | "yellow"
  | "amber"
  | "orange"
  | "deep-orange"
  | "brown"
  | "grey"
  | "blue-grey";
type ColorShade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
type DetailedColor = `${Color}-${ColorShade}`;

export type NamedColor = LiteralUnion<
  BrandColor | Color | DetailedColor | keyof CustomColors
>;
