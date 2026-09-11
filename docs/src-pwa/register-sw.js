import { register } from 'register-service-worker'
import { Notify } from 'quasar'
import { mdiCached } from '@quasar/extras/mdi-v7'

// the updated worker waits (quasar.config.js > pwa > skipWaiting: false)
// until a page posts SKIP_WAITING; the old worker keeps serving the old,
// complete precache to every tab until then
let waitingWorker = null

// handle of the "downloading" / "update available" notification
let updateNotif = null

// set by the Refresh action of this page; the other pages learn about the
// activation through "controllerchange" only
let refreshRequested = false

// whether this page is controlled; the first "controllerchange" of a fresh
// visit is the initial install claiming it (nothing stale can exist then)
let controlled =
  'serviceWorker' in navigator && navigator.serviceWorker.controller !== null

// WebKit keeps the scripts a document preloaded (<link rel="modulepreload">)
// in an in-memory cache and reuses them across the following reload without
// asking the service worker, for as long as the old document is around.
// The filenames are stable (build > useFilenameHashes: false), so a reload
// after the updated worker took over would run the new entry file with old
// chunks ("Importing binding name '...' is not found", blank page).
// A fetch() of the same URL evicts such an entry, so every precached script
// is fetched through the new worker before anything reloads. The eviction
// happens when the request is issued, so a failed fetch still did its job.
async function evictPrecachedScripts() {
  const urls = []

  for (const name of await caches.keys()) {
    if (!name.includes('precache')) continue

    const cache = await caches.open(name)
    for (const req of await cache.keys()) {
      const url = req.url.split('?')[0]
      if (url.endsWith('.js')) urls.push(url)
    }
  }

  await Promise.allSettled(
    urls.map(url =>
      fetch(url).then(res => {
        if (res.body !== null) return res.body.cancel()
      })
    )
  )
}

function requestRefresh() {
  refreshRequested = true

  Notify.create({
    classes: 'doc-notify',
    group: false,
    timeout: 0,
    spinner: true,
    color: 'grey-9',
    position: 'bottom-left',
    message: 'Refreshing the docs...'
  })

  if (waitingWorker !== null) {
    waitingWorker.postMessage({ type: 'SKIP_WAITING' })
  }

  // no "controllerchange" means the old worker still serves its own
  // complete build, so a plain reload is safe
  setTimeout(() => {
    window.location.reload()
  }, 5000)
}

function getUpdateAvailableProps() {
  return {
    spinner: false,
    icon: mdiCached,
    message: 'Updated docs are available.',
    timeout: 0,
    multiLine: true,
    actions: [
      {
        label: 'Refresh',
        noCaps: true,
        color: 'amber',
        handler: requestRefresh
      },
      {
        label: 'Dismiss',
        noCaps: true,
        color: 'white'
      }
    ]
  }
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', async () => {
    const wasControlled = controlled
    controlled = true

    if (!wasControlled) return

    await evictPrecachedScripts()

    if (refreshRequested) {
      window.location.reload()
      return
    }

    // another tab asked for the update; this page now runs the old app
    // against the new precache, so any not-yet-loaded chunk can mismatch
    if (updateNotif !== null) {
      updateNotif()
      updateNotif = null
    }

    Notify.create({
      classes: 'doc-notify',
      group: false,
      timeout: 0,
      icon: mdiCached,
      color: 'grey-9',
      position: 'bottom-left',
      multiLine: true,
      message:
        'The docs were updated in another tab. Refresh to keep browsing; page loads may fail until you do.',
      actions: [
        {
          label: 'Refresh',
          noCaps: true,
          color: 'amber',
          handler() {
            window.location.reload()
          }
        }
      ]
    })
  })
}

register(import.meta.env.QUASAR_SERVICE_WORKER_FILE, {
  updatefound() {
    // also fires while installing the very first service worker,
    // where there is no update to notify about
    if (navigator.serviceWorker.controller === null) return

    updateNotif = Notify.create({
      classes: 'doc-notify',
      group: false,
      timeout: 0,
      spinner: true,
      color: 'grey-9',
      position: 'bottom-left',
      message: 'Downloading docs update...'
    })
  },

  updated(registration) {
    // the initial install can report "installed" after it already claimed
    // the page (nothing waits then); an update that another tab already
    // activated is handled by "controllerchange" instead
    if (registration.waiting === null) return

    waitingWorker = registration.waiting

    if (updateNotif !== null) {
      // morph the "downloading" notification in place
      updateNotif(getUpdateAvailableProps())
      updateNotif = null
    } else {
      // an update finished installing without us seeing it start
      // (e.g. it was already waiting when the page registered)
      Notify.create({
        classes: 'doc-notify',
        group: false,
        color: 'grey-9',
        position: 'bottom-left',
        ...getUpdateAvailableProps()
      })
    }
  },

  error() {
    // don't leave a spinner up for a failed install
    if (updateNotif !== null) {
      updateNotif()
      updateNotif = null
    }
  }
})
