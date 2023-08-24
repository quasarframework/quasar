<template>
  <div>
    <div class="q-layout-padding">
      <div class="q-my-md">
        Notify the user something is going on behind the scenes.
      </div>
      <div>
        {{ stateInner }} | {{ stateOuter }}
      </div>
      <div class="q-gutter-sm">
        <q-btn push color="secondary" @click="noMessage">
          Show
        </q-btn>
        <q-btn push color="primary" @click="withHtmlMessage">
          HTML Message
        </q-btn>
        <q-btn push color="primary" @click="withMessageSanitized">
          Sanitized Message
        </q-btn>
        <q-btn push color="secondary" @click="withBox">
          With box
        </q-btn>
      </div>
      <div class="q-my-md">
        ...with a custom spinner, colors and size.
      </div>
      <q-btn push color="secondary" @click="customLoading">
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
        <q-btn class="q-mt-md" push color="secondary" @click="showMultiple">
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

      <div class="q-my-md">
        Show with groups
      </div>
      <div class="row q-gutter-sm">
        <q-btn push color="black" @click="showGroup1">
          One.1 > Two.1 > One.2
        </q-btn>

        <q-btn push color="black" @click="showGroup2">
          One.1 > Two.1 > Three.1 > One.2
        </q-btn>

        <q-btn push color="black" @click="showGroup3">
          One.1 > Default
        </q-btn>

        <q-btn push color="black" @click="showGroup4">
          One.1
        </q-btn>

        <q-btn push color="black" @click="showGroup5">
          hide(group): One.1 > Two.1 > Three.1 > One.2
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Loading,
  QSpinnerFacebook,
  QSpinnerGears,
  useQuasar
} from 'quasar'

import { ref, computed, onMounted } from 'vue'

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

  setup () {
    const showCount = ref(3)
    const $q = useQuasar()

    onMounted(() => {
      $q.loading.setDefaults({
        spinnerColor: 'amber'
      })
      $q.loading.show({
        message: 'With defaults'
      })
      setTimeout(() => {
        $q.loading.show({
          message: 'Discarded defaults',
          ignoreDefaults: true
        })
        setTimeout(() => {
          $q.loading.hide()
          $q.loading.setDefaults({
            spinnerColor: void 0
          })
        }, 1000)
      }, 1000)
    })

    return {
      showCount,
      stateInner: computed(() => $q.loading.isActive),
      stateOuter: computed(() => Loading.isActive),

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
      withHtmlMessage () {
        show({
          message: 'Some <b class="text-orange">important</b> process is in progress. Hang on...',
          html: true
        })
      },
      withMessageSanitized () {
        show({
          message: 'Some <b class="text-orange">important</b> process is in progress. Hang on...'
        })
      },
      withBox () {
        show({
          message: 'Please wait...',
          boxClass: 'bg-white text-grey-9'
        })
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
        for (let i = 0; i < showCount.value; i++) {
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
      },

      showGroup1 () {
        const one = $q.loading.show({
          group: 'one',
          message: 'One.1'
        })

        setTimeout(() => {
          one({ message: 'One.2' })

          const two = $q.loading.show({
            group: 'two',
            message: 'Two.1'
          })

          setTimeout(() => {
            two()
            setTimeout(() => {
              one()
            }, 1000)
          }, 1000)
        }, 1000)
      },

      showGroup2 () {
        const one = $q.loading.show({
          group: 'one',
          message: 'One.1'
        })

        setTimeout(() => {
          one({
            spinner: QSpinnerGears,
            message: 'One.2'
          })

          const two = $q.loading.show({
            group: 'two',
            message: 'Two.1'
          })

          setTimeout(() => {
            const third = $q.loading.show({
              group: 'third',
              message: 'Three.1'
            })
            two()

            setTimeout(() => {
              third()
              setTimeout(() => {
                one()
              }, 1000)
            }, 1000)
          }, 1000)
        }, 1000)
      },

      showGroup3 () {
        const one = $q.loading.show({
          group: 'one',
          message: 'One.1'
        })

        setTimeout(() => {
          one({ message: 'One.2' })

          $q.loading.show({
            message: 'Default'
          })

          setTimeout(() => {
            $q.loading.hide()
            one()
          }, 1000)
        }, 1000)
      },

      showGroup4 () {
        const one = $q.loading.show({
          group: 'one',
          message: 'One.1'
        })

        setTimeout(() => {
          one()
          one()
          $q.loading.hide()
          one()
        }, 1000)
      },

      showGroup5 () {
        $q.loading.show({
          group: 'one',
          message: 'One.1'
        })

        setTimeout(() => {
          $q.loading.show({
            group: 'one',
            spinner: QSpinnerGears,
            message: 'One.2'
          })

          $q.loading.show({
            group: 'two',
            message: 'Two.1'
          })

          setTimeout(() => {
            $q.loading.show({
              group: 'third',
              message: 'Three.1'
            })
            $q.loading.hide('two')

            setTimeout(() => {
              $q.loading.hide('third')
              setTimeout(() => {
                $q.loading.hide('one')
              }, 1000)
            }, 1000)
          }, 1000)
        }, 1000)
      }
    }
  }
}
</script>
