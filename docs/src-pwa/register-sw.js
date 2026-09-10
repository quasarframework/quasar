import { register } from 'register-service-worker'
import { Notify } from 'quasar'
import { mdiCached } from '@quasar/extras/mdi-v7'

// dismiss/update handle for the "downloading update" notification
let updateNotif = null

// whether the worker found by the latest "updatefound" already controls
// this page; the "updated" callback fires while it is still activating
let controllerChanged = false

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    controllerChanged = true
  })
}

// reloading before the new worker has claimed the page sends the
// navigation to the old worker, whose precache entries are being
// deleted by the new one; iOS home screen web apps then end up blank
function reloadWhenControlled() {
  if (controllerChanged) {
    window.location.reload()
    return
  }

  const timer = setTimeout(() => {
    window.location.reload()
  }, 3000)

  navigator.serviceWorker.addEventListener(
    'controllerchange',
    () => {
      clearTimeout(timer)
      window.location.reload()
    },
    { once: true }
  )
}

function getUpdatedProps() {
  return {
    spinner: false,
    icon: mdiCached,
    message: 'Updated content is available. Please refresh the page.',
    timeout: 0,
    multiLine: true,
    actions: [
      {
        label: 'Refresh',
        color: 'amber',
        handler: reloadWhenControlled
      },
      {
        label: 'Dismiss',
        color: 'white'
      }
    ]
  }
}

register(import.meta.env.QUASAR_SERVICE_WORKER_FILE, {
  updatefound() {
    controllerChanged = false

    // also fires while installing the very first service worker,
    // where there is no update to notify about
    if (navigator.serviceWorker.controller === null) return

    updateNotif = Notify.create({
      group: false,
      timeout: 0,
      spinner: true,
      color: 'grey-9',
      position: 'bottom-left',
      message: 'Downloading docs update...'
    })
  },

  updated() {
    if (updateNotif !== null) {
      // morph the "downloading" notification in place
      updateNotif(getUpdatedProps())
      updateNotif = null
    } else {
      // an update finished installing without us seeing it start
      // (e.g. it was already waiting when the page registered)
      Notify.create({
        group: false,
        color: 'grey-9',
        position: 'bottom-left',
        ...getUpdatedProps()
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
