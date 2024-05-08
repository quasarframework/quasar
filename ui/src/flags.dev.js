/**
 * Quasar runtime flags are needed only if NOT using
 * Quasar CLI or @quasar/vite-plugin or vue-cli-plugin-quasar
 */

let attachPoint = null

function getAttachPoint () {
  if (attachPoint !== null) return attachPoint
  return (
    attachPoint = typeof globalThis !== 'undefined'
      ? globalThis
      : (
          typeof self !== 'undefined'
            ? self
            : (
                typeof window !== 'undefined'
                  ? window
                  : (
                      typeof global !== 'undefined'
                        ? global
                        : {}
                    )
              )
        )
  )
}

if (typeof __QUASAR_SSR__ !== 'boolean') {
  getAttachPoint().__QUASAR_SSR__ = false
}
if (typeof __QUASAR_SSR_CLIENT__ !== 'boolean') {
  getAttachPoint().__QUASAR_SSR_CLIENT__ = false
}
if (typeof __QUASAR_SSR_PWA__ !== 'boolean') {
  getAttachPoint().__QUASAR_SSR_PWA__ = false
}
