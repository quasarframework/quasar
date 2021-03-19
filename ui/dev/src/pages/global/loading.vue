<template>
  <div>
    <div class="q-layout-padding">
      <div class="q-my-md">
        Notify the user something is going on under the covers.
      </div>
      <div>
        {{ state }}
      </div>
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
      <div class="q-my-md">
        ...with a custom spinner, colors and size.
      </div>
      <q-btn push color="secondary" @click="customLoading()">
        Show custom Loading
      </q-btn>
      <div class="q-my-md">
        Change Message while Being Displayed
      </div>
      <div class="q-gutter-sm">
        <q-btn push color="secondary" @click="changeMessage">
          Show & Change
        </q-btn>
        <q-btn push color="secondary" @click="changeMessage2">
          Show & Change 2
        </q-btn>
      </div>
      <div class="q-my-md">
        Show multiple times in a row
      </div>
      <div>
        <q-input v-model.number="showCount" type="number" min="1" max="10" style="max-width: 150px;" filled />
        <q-btn class="q-mt-md" push color="secondary" @click="showMultiple()">
          Show Multiple Times
        </q-btn>
      </div>

      <div class="q-my-md">
        Show for a short time - check .q-body--loading class on body
      </div>
      <div class="row q-gutter-sm">
        <q-btn push color="black" @click="shortLoading()">
          Show and hide
        </q-btn>
        <q-btn push color="black" @click="shortLoading(0)">
          Show for 0ms
        </q-btn>
        <q-btn push color="black" @click="shortLoading(500)">
          Show for 500ms
        </q-btn>
        <q-btn push color="black" @click="shortLoading(1000)">
          Show for 1000ms
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

function show (options, timeout = 3000) {
  Loading.show(options)

  setTimeout(() => {
    Loading.hide()
  }, timeout)
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

  computed: {
    state () {
      return Loading.isActive
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
    changeMessage2 () {
      Loading.show({ message: 'First message. Gonna change it in 1.5 seconds...' })
      setTimeout(() => {
        Loading.show({
          spinner: QSpinnerGears,
          message: 'Updated message'
        })
        setTimeout(() => {
          Loading.show({
            spinnerColor: 'red',
            messageColor: 'black',
            backgroundColor: 'yellow',
            message: 'Updated message 2'
          })
          setTimeout(() => {
            Loading.hide()
          }, 2500)
        }, 2500)
      }, 2500)
    },

    async showMultiple () {
      for (let i = 0; i < this.showCount; i++) {
        Loading.show()

        await new Promise(resolve => setTimeout(resolve, 2000))

        Loading.hide()
      }
    },

    shortLoading (timeout) {
      if (timeout === void 0) {
        Loading.show({ delay: 500 })
        Loading.show({ delay: 500 })
        Loading.hide()
      }
      else {
        show({ delay: 500 }, timeout)
        Loading.show({ delay: 500 })
      }
    }
  }
}
</script>
