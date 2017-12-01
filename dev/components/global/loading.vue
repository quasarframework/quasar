<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        Notify the user something is going on under the covers.
      </p>
      <div class="group">
        <q-btn push color="secondary" @click="noMessage()">
          Show
        </q-btn>
        <q-btn push color="primary" @click="withMessage()">
          Show With Message
        </q-btn>
      </div>
      <p class="caption">
        ...with a custom spinner, colors and size.
      </p>
      <q-btn push color="secondary" @click="customLoading()">
        Show custom Loading
      </q-btn>
      <p class="caption">
        Change Message while Being Displayed
      </p>
      <q-btn push color="secondary" @click="changeMessage()">
        Show & Change
      </q-btn>
    </div>
  </div>
</template>

<script>
import {
  Loading,
  QSpinnerFacebook,
  QSpinnerGears
} from 'quasar'

function show (options) {
  Loading.show(options)

  setTimeout(() => {
    Loading.hide()
  }, 3000)
}

export default {
  methods: {
    noMessage () {
      show()
    },
    customLoading () {
      show({
        spinner: QSpinnerFacebook,
        spinnerColor: 'amber',
        spinnerSize: 140,
        message: 'Some important process is in progress. Hang on...',
        messageColor: 'orange'
      })
    },
    withMessage () {
      show({message: 'Some important process is in progress. Hang on...'})
    },
    changeMessage () {
      Loading.show({message: 'First message. Gonna change it in 3 seconds...'})
      setTimeout(() => {
        show({
          spinner: QSpinnerGears,
          spinnerColor: 'amber',
          message: 'Updated message'
        })
      }, 3000)
    }
  }
}
</script>
