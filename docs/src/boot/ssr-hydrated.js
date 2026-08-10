// dev + ssr only (see quasar.config.js): exposes the client takeover
// to the e2e sweep (/docs/test/e2e-ssr/ssr-hydration.test.js). The
// CLI client entry calls $q.onSSRHydrated right after the hydrating
// mount returns, so every hydration mismatch has been reported by the
// time it runs.
export default function bootSsrHydrated({ app }) {
  const $q = app.config.globalProperties.$q
  const notifyHydrated = $q.onSSRHydrated

  $q.onSSRHydrated = () => {
    notifyHydrated()
    window.__E2E_SSR_HYDRATED__ = true
  }
}
