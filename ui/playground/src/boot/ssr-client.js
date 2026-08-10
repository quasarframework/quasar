export default function bootSsrClient({ app, router }) {
  console.log(
    '[Quasar] On route change we deliberately load page from server -- in order to test hydration errors'
  )

  // expose the client takeover to the e2e sweep
  // (/ui/test/e2e-ssr/ssr-hydration.test.js): the CLI client entry
  // calls $q.onSSRHydrated right after the hydrating mount returns,
  // so every hydration mismatch has been reported by the time it runs
  const $q = app.config.globalProperties.$q
  const notifyHydrated = $q.onSSRHydrated
  $q.onSSRHydrated = () => {
    notifyHydrated()
    window.__E2E_SSR_HYDRATED__ = true
  }

  let reload = false
  router.beforeEach(to => {
    if (reload) {
      setTimeout(() => {
        window.location.href = to.fullPath
      }, 0)
      return false
    }
    reload = true
    return true
  })
}
