<template>
  <div>
    <div class="q-layout-padding">
      <p class="caption">
        Notify the user something is going on under the covers.

        <q-toggle v-model="update" label="Update without transition" />
      </p>
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

      <p class="caption">
        Show for a short time - check .q-body--loading class on body
      </p>
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
      showCount: 3,
      update: false
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
      message: 'With defaults',
      update: this.update
    })
    setTimeout(() => {
      this.$q.loading.show({
        message: 'Discarded defaults',
        ignoreDefaults: true,
        update: this.update
      })
      setTimeout(() => {
        this.$q.loading.hide()
        this.$q.loading.setDefaults({
          spinnerColor: void 0,
          update: this.update
        })
      }, 1000)
    }, 1000)
  },

  methods: {
    noMessage () {
      show({ update: this.update })
    },
    customLoading () {
      show({
        spinner: QSpinnerFacebook,
        spinnerColor: 'amber',
        spinnerSize: 140,
        message: 'Some important process is in progress. Hang on...',
        messageColor: 'orange',
        update: this.update
      })
    },
    withMessage () {
      show({
        message: 'Some <b class="text-negative">important</b> process is in progress. Hang on...',
        update: this.update
      })
    },
    withMessageSanitized () {
      show({
        message: 'Some <b class="text-negative">important</b> process is in progress. Hang on...',
        sanitize: true,
        update: this.update
      })
    },
    changeMessage () {
      Loading.show({
        message: 'First message. Gonna change it in 3 seconds...',
        update: this.update
      })
      setTimeout(() => {
        show({
          spinner: QSpinnerGears,
          spinnerColor: 'red',
          messageColor: 'black',
          backgroundColor: 'yellow',
          message: 'Updated message',
          update: this.update
        })
      }, 3000)
    },
    async showMultiple () {
      for (let i = 0; i < this.showCount; i++) {
        Loading.show({ update: this.update })

        await new Promise(resolve => setTimeout(resolve, 2000))

        Loading.hide()
      }
    },

    shortLoading (timeout) {
      if (timeout === void 0) {
        Loading.show({ delay: 500, update: this.update })
        Loading.show({ delay: 500, update: this.update })
        Loading.hide()
      }
      else {
        show({ delay: 500, update: this.update }, timeout)
        Loading.show({ delay: 500, update: this.update })
      }
    }
  }
}
</script>
