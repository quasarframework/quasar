/**
 * Tiny wrapper around tokenx for smoke-print token counts.
 * Short-circuits on empty input so callers don't need to guard.
 */

import { estimateTokenCount } from 'tokenx'

/**
 * @param {string} text Input text. An empty/falsy string returns 0.
 * @returns {number} Approximate token count.
 */
export function countTokens(text) {
  if (!text) {
    return 0
  }
  return estimateTokenCount(text)
}
