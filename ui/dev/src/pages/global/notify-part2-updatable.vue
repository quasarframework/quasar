<template>
  <div class="q-layout-padding row justify-center" style="width: 500px; max-width: 90vw;">
    <div class="q-gutter-md">
      <q-btn
        label="Simple"
        flat
        color="primary"
        @click="showSimple"
        no-caps
      />

      <q-btn
        icon="cached"
        label="Spinner"
        flat
        color="primary"
        @click="showSpinner"
        no-caps
      />

      <q-btn
        label="Type: ongoing"
        flat
        color="primary"
        @click="showOngoing"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { QSpinnerGears } from 'quasar'

export default {
  methods: {
    showSimple () {
      const notif = this.$q.notify({
        group: false,
        timeout: 0,
        message: 'Please wait...'
      })

      setTimeout(() => {
        notif({
          message: 'Hmm... done!',
          timeout: 1000
        })
      }, 2000)
    },

    showSpinner () {
      const notif = this.$q.notify({
        group: false,
        timeout: 0,
        spinner: true,
        message: 'Uploading...',
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
            spinner: QSpinnerGears,
            message: 'Uploading done!'
          })
          clearInterval(interval)
          setTimeout(() => {
            notif()
          }, 1000)
        }
      }, 500)
    },

    showOngoing () {
      const notify = this.$q.notify({
        type: 'ongoing',
        message: 'Something is happening...'
      })

      setTimeout(() => {
        notify({
          type: 'warning',
          message: 'Hmm, I guess I was wrong',
          timeout: 2000
        })
      }, 3000)
    }
  }
}
</script>
