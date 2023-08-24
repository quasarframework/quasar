<template>
  <div class="q-pa-md">
    <q-btn no-caps color="purple" @click="showNotif" label="Show updatable notification" />
  </div>
</template>

<script>
import { useQuasar } from 'quasar'

export default {
  setup () {
    const $q = useQuasar()

    return {
      showNotif () {
        const notif = $q.notify({
          group: false, // required to be updatable
          timeout: 0, // we want to be in control when it gets dismissed
          spinner: true,
          message: 'Uploading file...',
          caption: '0%'
        })

        // we simulate some progress here...
        let percentage = 0
        const interval = setInterval(() => {
          percentage = Math.min(100, percentage + Math.floor(Math.random() * 22))

          // we update the dialog
          notif({
            caption: `${percentage}%`
          })

          // if we are done...
          if (percentage === 100) {
            notif({
              icon: 'done', // we add an icon
              spinner: false, // we reset the spinner setting so the icon can be displayed
              message: 'Uploading done!',
              timeout: 2500 // we will timeout it in 2.5s
            })
            clearInterval(interval)
          }
        }, 500)
      }
    }
  }
}
</script>
