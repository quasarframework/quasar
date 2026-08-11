import { register } from 'register-service-worker'
import { Notify } from 'quasar'
import { mdiCached } from '@quasar/extras/mdi-v7'

register(import.meta.env.QUASAR_SERVICE_WORKER_FILE, {
  updated() {
    Notify.create({
      color: 'negative',
      icon: mdiCached,
      message: 'Updated content is available. Please refresh the page.',
      timeout: 0,
      multiLine: true,
      position: 'top',
      actions: [
        {
          label: 'Refresh',
          color: 'yellow',
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
    })
  }
})
