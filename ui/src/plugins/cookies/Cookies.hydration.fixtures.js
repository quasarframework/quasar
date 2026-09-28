import { h } from 'vue'

import { Cookies, useQuasar } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

export const STORED_COOKIE = 'hydration-theme'
export const MISSING_COOKIE = 'hydration-missing'

function fixtureFor(name) {
  return {
    setup() {
      const $q = useQuasar()
      const theme = $q.cookies.useCookie(name, { default: () => 'light' })
      return () => h('div', theme.value)
    }
  }
}

export const stored = fixtureFor(STORED_COOKIE)
export const missing = fixtureFor(MISSING_COOKIE)

export const quasarOptions = { plugins: { Cookies } }

// the request carries the stored cookie, as the browser will
export const requestHeaders = { cookie: `${STORED_COOKIE}=dark` }
