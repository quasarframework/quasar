import { Notify } from 'quasar'
import { mdiCached } from '@quasar/extras/mdi-v7'

// The chunk filenames are stable (build > useFilenameHashes: false), so a
// page must never run one build's entry with another build's chunks. The
// updated worker therefore waits (no skipWaiting in src-pwa/sw/custom-sw.js)
// and the browser activates it by itself once no quasar.dev tab, window or
// app uses the current one; every page keeps being served by the worker it
// loaded with until then.

const dismissAction = {
  label: 'Dismiss',
  noCaps: true,
  color: 'amber'
}

const downloadingProps = {
  icon: void 0,
  spinner: true,
  message: 'Downloading docs update...',
  actions: []
}

const updateReadyProps = {
  icon: mdiCached,
  spinner: false,
  message:
    'A new docs version is ready. Close all docs tabs and windows and reopen to switch to it.',
  actions: [dismissAction]
}

function notify(props) {
  return Notify.create({
    classes: 'doc-notify',
    group: false,
    timeout: 0,
    color: 'grey-9',
    position: 'bottom-left',
    multiLine: true,
    ...props
  })
}

// handle of the update notification while one is on screen (Notify's
// update function keeps its identity across updates)
let updateNotif = null

// morphs the update notification in place, or shows one when none is on
// screen (none yet, the user dismissed it, or the previous update failed)
function showUpdate(props) {
  if (updateNotif !== null) {
    updateNotif(props)
    return
  }

  const notif = notify({
    ...props,
    onDismiss() {
      if (updateNotif === notif) {
        updateNotif = null
      }
    }
  })

  updateNotif = notif
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
  }

  notify({
    icon: mdiCached,
    message:
      'The docs were updated in the meantime and this page is outdated. Close this tab and reopen to keep browsing.',
    actions: [dismissAction]
  })
}

// the page runs the build of the worker that serves it: once that worker
// gets replaced, the page is outdated
function watchController(worker) {
  worker.addEventListener('statechange', () => {
    if (worker.state === 'redundant') {
      notifyStale()
    }
  })
}

// the update being installed; a newer one supersedes it
let trackedWorker = null

// "downloading" while the update installs, then "ready" once it waits
function trackUpdate(registration, worker) {
  // The very first install is no update to notify about. Read live: a
  // first-visit page gets claimed by that install and can see a later
  // update (another tab's navigation checks for one).
  if (
    worker === null ||
    navigator.serviceWorker.controller === null ||
    staleNotified
  ) {
    return
  }

  trackedWorker = worker
  showUpdate(downloadingProps)

  worker.addEventListener('statechange', () => {
    // superseded by a newer update or by the stale notice
    if (trackedWorker !== worker || staleNotified) return

    if (worker.state === 'installed') {
      showUpdate(updateReadyProps)
    } else if (worker.state === 'redundant') {
      // failed install: don't leave a spinner up, but a previous update
      // may still be waiting
      if (registration.waiting !== null) {
        showUpdate(updateReadyProps)
      } else if (updateNotif !== null) {
        updateNotif()
      }
    }
  })
}

function watchUpdates(registration) {
  if (registration.installing !== null) {
    trackUpdate(registration, registration.installing)
  } else if (registration.waiting !== null && !staleNotified) {
    // it finished installing before the page got here
    showUpdate(updateReadyProps)
  }

  registration.addEventListener('updatefound', () => {
    trackUpdate(registration, registration.installing)
  })
}

// on window "load", so that the app booted (Notify included)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // the worker that served this page (null on the first visit and after
    // a reload that bypassed it)
    const controller = navigator.serviceWorker.controller

    if (controller !== null) {
      // the shell comes from the worker (index.html > data-build), the app
      // from whatever the browser reused
      if (
        document.documentElement.dataset.build !== import.meta.env.DOCS_BUILD_ID
      ) {
        notifyStale()
      }

      watchController(controller)
    } else {
      // the worker that claims the page serves it from then on
      navigator.serviceWorker.addEventListener(
        'controllerchange',
        () => {
          if (navigator.serviceWorker.controller !== null) {
            watchController(navigator.serviceWorker.controller)
          }
        },
        { once: true }
      )
    }

    let watched = false
    const watch = registration => {
      if (watched || registration === void 0) return
      watched = true
      watchUpdates(registration)
    }

    // The browser checks for an update right after the navigation, and
    // register() queues behind that check: it resolves only once the update
    // finished installing. getRegistration() does not wait, so the page can
    // tell an update is installing. On the first visit there is nothing to
    // get yet, and register() resolves before the install starts.
    navigator.serviceWorker
      .getRegistration()
      .then(watch)
      .catch(() => {})

    navigator.serviceWorker
      .register(import.meta.env.QUASAR_SERVICE_WORKER_FILE)
      .then(watch)
      .catch(err => {
        console.error('Docs service worker registration failed:', err)
      })
  })
}
