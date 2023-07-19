import { EmbeddedValidationRule } from "../api/validation";

interface Patterns {
  /**
   * Test against particular patterns.
   */
  testPattern: Record<EmbeddedValidationRule, (value: any) => boolean>;
}

export declare const patterns: Patterns;
