<template>
  <div>
    <div class="q-layout-padding">
      <p class="caption">
        Notify the user something is going on under the covers.
      </p>
      <div class="q-gutter-sm">
        <q-btn push color="secondary" @click="noMessage()">
          Show
        </q-btn>
        <q-btn push color="primary" @click="withMessage()">
          Show With Message
        </q-btn>
        <q-btn push color="primary" @click="withMessageSanitized()">
          Show With Message (Sanitized)
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
      <p class="caption">
        Show multiple times in a row
      </p>
      <div>
        <q-input v-model.number="showCount" type="number" min="1" max="10" style="max-width: 150px;" filled />
        <q-btn class="q-mt-md" push color="secondary" @click="showMultiple()">
          Show Multiple Times
        </q-btn>
      </div>
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
  /*
  mounted () {
    this.$q.loading.hide()
    this.$q.loading.hide()
    this.$q.loading.show()
    this.$q.loading.hide()
    this.$q.loading.show()
    this.$q.loading.show()
    this.$q.loading.hide()
    this.$q.loading.show({
      message: 'gigi'
    })
    setTimeout(() => {
      this.$q.loading.hide()
    }, 5000)
  },
  */

  data () {
    return {
      showCount: 3
    }
  },

  mounted () {
    this.$q.loading.setDefaults({
      spinnerColor: 'amber'
    })
    this.$q.loading.show({
      message: 'With defaults'
    })
    setTimeout(() => {
      this.$q.loading.show({
        message: 'Discarded defaults',
        ignoreDefaults: true
      })
      setTimeout(() => {
        this.$q.loading.hide()
        this.$q.loading.setDefaults({
          spinnerColor: void 0
        })
      }, 1000)
    }, 1000)
  },

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
      show({ message: 'Some <b class="text-negative">important</b> process is in progress. Hang on...' })
    },
    withMessageSanitized () {
      show({ message: 'Some <b class="text-negative">important</b> process is in progress. Hang on...', sanitize: true })
    },
    changeMessage () {
      Loading.show({ message: 'First message. Gonna change it in 3 seconds...' })
      setTimeout(() => {
        show({
          spinner: QSpinnerGears,
          spinnerColor: 'red',
          messageColor: 'black',
          backgroundColor: 'yellow',
          message: 'Updated message'
        })
      }, 3000)
    },
    async showMultiple () {
      for (let i = 0; i < this.showCount; i++) {
        Loading.show()

        await new Promise(resolve => setTimeout(resolve, 2000))

        Loading.hide()
      }
    }
  }
}
</script>
