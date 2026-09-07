/**
 * Vitest 5 browser mode injects every vite `define` entry onto
 * globalThis verbatim, after Vite's own env injection, so a string
 * value (an expression by Vite's contract, like the plugin's quoted
 * version) lands with its quotes intact (vitest-dev/vitest#11164).
 * Strip the string entries from the test-side map, leaving them to
 * Vite, which is what vitest 4 did. Remove once the fix ships.
 */
export function vitestDefineWorkaround() {
  return {
    name: 'quasar:vitest-define-workaround',
    enforce: 'post',
    configResolved(config) {
      const defines = config.test?.defines
      if (defines === void 0) return

      config.test.defines = Object.fromEntries(
        Object.entries(defines).filter(([, value]) => typeof value !== 'string')
      )
    }
  }
}
