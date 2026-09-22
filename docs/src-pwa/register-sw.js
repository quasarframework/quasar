import { register } from 'register-service-worker'
import { Notify } from 'quasar'
import { mdiCached } from '@quasar/extras/mdi-v7'

// The chunk filenames are stable (build > useFilenameHashes: false), so a
// page must never run one build's entry with another build's chunks. The
// updated worker therefore waits (quasar.config.js > pwa > skipWaiting:
// false) and the browser activates it by itself once no quasar.dev tab,
// window or app uses the current one; every page keeps being served by
// the worker it loaded with until then.

register(import.meta.env.QUASAR_SERVICE_WORKER_FILE, {
  updated(registration) {
    // the initial install can report "installed" after it already claimed
    // the page (nothing waits then)
    if (registration.waiting === null) return

    Notify.create({
      classes: 'doc-notify',
      group: false,
      timeout: 0,
      icon: mdiCached,
      color: 'grey-9',
      position: 'bottom-left',
      multiLine: true,
      message:
        'A new docs version is ready. Close all quasar.dev tabs and windows (or quit the installed app) to switch to it.',
      actions: [
        {
          label: 'Dismiss',
          noCaps: true,
          color: 'white'
        }
      ]
    })
  }
})
