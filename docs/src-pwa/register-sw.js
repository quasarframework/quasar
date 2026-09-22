import { register } from 'register-service-worker'
import { Notify } from 'quasar'
import { mdiCached } from '@quasar/extras/mdi-v7'

// The chunk filenames are stable (build > useFilenameHashes: false), so a
// page must never run one build's entry with another build's chunks. The
// updated worker therefore waits (no skipWaiting in src-pwa/sw/custom-sw.js)
// and the browser activates it by itself once no quasar.dev tab, window or
// app uses the current one; every page keeps being served by the worker it
// loaded with until then.

// handle of the "update ready" notification
let updateNotif = null

function notify(props) {
  return Notify.create({
    classes: 'doc-notify',
    group: false,
    timeout: 0,
    icon: mdiCached,
    color: 'grey-9',
    position: 'bottom-left',
    multiLine: true,
    actions: [
      {
        label: 'Dismiss',
        noCaps: true,
        color: 'amber'
      }
    ],
    ...props
  })
}

// A page that runs a previous build against the updated precache would
// fail to load chunks; a reload in the same web process reuses the stale
// scripts (WebKit), so only a new tab helps. Two ways to get there, both
// Safari: a page restored from the back/forward cache after the update got
// activated in between (the cached page did not count as a client), and a
// tab opened seconds after such a page got closed, whose scripts came from
// the process memory cache while the shell came from the worker.
let staleNotified = false

function notifyStale() {
  if (staleNotified) return
  staleNotified = true

  if (updateNotif !== null) {
    updateNotif()
    updateNotif = null
  }

  notify({
    message:
      'The docs were updated in the meantime and this page is outdated. Close this tab and open the docs again to keep browsing.'
  })
}

// the worker that served this page (null on the first visit)
const controller =
  'serviceWorker' in navigator ? navigator.serviceWorker.controller : null

// (the callbacks run after the app booted, Notify included)
register(import.meta.env.QUASAR_SERVICE_WORKER_FILE, {
  registered() {
    if (controller === null) return

    // the shell comes from the worker (index.html > data-build), the app
    // from whatever the browser reused
    if (
      document.documentElement.dataset.build !== import.meta.env.DOCS_BUILD_ID
    ) {
      notifyStale()
    }

    controller.addEventListener('statechange', () => {
      if (controller.state === 'redundant') {
        notifyStale()
      }
    })
  },

  updated(registration) {
    // the initial install can report "installed" after it already claimed
    // the page (nothing waits then)
    if (registration.waiting === null) return

    updateNotif = notify({
      message:
        'A new docs version is ready. Close all docs tabs and windows (or quit the installed app) to switch to it.'
    })
  }
})
