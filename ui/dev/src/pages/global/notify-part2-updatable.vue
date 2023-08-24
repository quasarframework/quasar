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

      <q-btn
        label="Docs example"
        flat
        color="primary"
        @click="showNotif"
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
          caption: `${ percentage }%`
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
    },

    showNotif () {
      const notif = this.$q.notify({
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
          caption: `${ percentage }%`
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
</script>
