import { register } from 'register-service-worker'
import { Notify } from 'quasar'
import { mdiCached } from '@quasar/extras/mdi-v7'

// dismiss/update handle for the "downloading update" notification
let updateNotif = null

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
        handler() {
          window.location.reload()
        }
      },
      {
        label: 'Dismiss',
        color: 'white',
        handler() {}
      }
    ]
  }
}

register(import.meta.env.QUASAR_SERVICE_WORKER_FILE, {
  updatefound() {
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
