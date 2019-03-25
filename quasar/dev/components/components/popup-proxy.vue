<template>
  <div class="q-layout-padding row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <h6>
        Width {{ $q.screen.width }} --> {{ type }}
      </h6>

      <div class="popup-surface-test">
        <div>Handles click</div>

        <q-popup-proxy>
          <q-banner>
            <q-icon slot="avatar" name="signal_wifi_off" color="primary" />

            <input v-model="text">
            You have lost connection to the internet. This app is offline.

            <q-btn label="Close" v-close-popup />
          </q-banner>
        </q-popup-proxy>
      </div>

      <div class="popup-surface-test">
        <div>Handles click - touch position</div>

        <q-popup-proxy touch-position>
          <q-banner>
            <q-icon slot="avatar" name="signal_wifi_off" color="primary" />

            <input v-model="text">
            You have lost connection to the internet. This app is offline.

            <q-btn label="Close" v-close-popup />
            <div>Popup text.</div>

            <q-btn slot="action" flat color="primary" label="close" v-close-popup />
          </q-banner>
        </q-popup-proxy>
      </div>

      <div class="popup-surface-test">
        <div>Handles right-click (context)</div>

        <q-popup-proxy context-menu>
          <q-banner>
            <q-icon slot="avatar" name="signal_wifi_off" color="primary" />

            <input v-model="text">
            You have lost connection to the internet. This app is offline.
            <q-btn label="Close" v-close-popup />
          </q-banner>
        </q-popup-proxy>
      </div>

      <div class="popup-surface-test">
        <div>Handles right-click (context) - touch-position</div>

        <q-popup-proxy context-menu touch-position>
          <q-banner>
            <q-icon slot="avatar" name="signal_wifi_off" color="primary" />

            <input v-model="text">
            You have lost connection to the internet. This app is offline.
            <q-btn label="Close" v-close-popup />
            <div>Popup text.</div>

            <q-btn slot="action" flat color="primary" label="close" v-close-popup />
          </q-banner>
        </q-popup-proxy>
      </div>

      <div class="q-mt-xl">
        <!-- With QPopupProxy -->
        <q-input filled v-model="input" mask="date" :rules="['date']">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy :breakpoint="600" @before-show="onBeforeShow1" @show="onShow1" @before-hide="onBeforeHide1" @hide="onHide1">
                <q-date v-model="input" filled />
                <q-btn label="Close" v-close-popup />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <!-- With QMenu -->
        <q-input filled v-model="input" mask="date" :rules="['date']">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-menu :breakpoint="600" @before-show="onBeforeShow2" @show="onShow2" @before-hide="onBeforeHide2" @hide="onHide2">
                <q-date v-model="input" filled />
                <q-btn label="Close" v-close-popup />
              </q-menu>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div class="q-mt-xl">
        <p>Model is: {{ model }}</p>
        <q-btn push color="primary" label="Open Popup">
          <q-popup-proxy v-model="model">
            <q-banner>
              <template v-slot:avatar>
                <q-icon name="signal_wifi_off" color="primary" />
              </template>
              You have lost connection to the internet. This app is offline.
              <q-btn color="primary" label="Close" @click="model = false" />
            </q-banner>
          </q-popup-proxy>
        </q-btn>
      </div>

      <div class="q-mt-xl">
        <p>v-close-popup Model is: {{ model }}</p>
        <q-btn push color="primary" label="Open Popup">
          <q-popup-proxy>
            <q-banner>
              <template v-slot:avatar>
                <q-icon name="signal_wifi_off" color="primary" />
              </template>
              You have lost connection to the internet. This app is offline.
              <q-btn color="primary" label="Close" v-close-popup />
            </q-banner>
          </q-popup-proxy>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: '',
      type: this.$q.screen.width < 600 ? 'dialog' : 'menu',
      input: '',
      date: '2018/11/03',
      model: false
    }
  },

  watch: {
    '$q.screen.width' (width) {
      const type = width < 450
        ? 'dialog'
        : 'menu'

      if (this.type !== type) {
        this.type = type
      }
    }
  },

  methods: {
    onBeforeShow1 () {
      console.log('onBeforeShow1')
    },
    onShow1 () {
      console.log('onShow1')
    },
    onBeforeHide1 () {
      console.log('onBeforeHide1')
    },
    onHide1 () {
      console.log('onHide1')
    },

    onBeforeShow2 () {
      console.log('onBeforeShow2')
    },
    onShow2 () {
      console.log('onShow2')
    },
    onBeforeHide2 () {
      console.log('onBeforeHide2')
    },
    onHide2 () {
      console.log('onHide2')
    }
  }
}
</script>

<style lang="stylus">
.popup-surface-test
  width 200px
  height 50px
  background white
  border 1px solid #999
  display flex
  align-items center
  justify-content center
  border-radius 5px

  > div
    user-select none

  & + &
    margin-top 16px
</style>
