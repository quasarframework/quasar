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
              </q-menu>
            </q-icon>
          </template>
        </q-input>
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
      date: '2018/11/03'
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
