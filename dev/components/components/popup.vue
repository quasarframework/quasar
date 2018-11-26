<template>
  <div class="q-layout-padding row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <h6>
        Width {{ $q.screen.width }} --> {{ type }}
      </h6>

      <div class="popup-surface-test">
        <div>Handles click</div>

        <q-popup>
          <q-banner>
            <q-icon slot="avatar" name="signal_wifi_off" color="primary" />

            You have lost connection to the internet. This app is offline.
          </q-banner>
        </q-popup>
      </div>

      <div class="popup-surface-test">
        <div>Handles right-click (context)</div>

        <q-popup context-menu>
          <q-banner>
            <q-icon slot="avatar" name="signal_wifi_off" color="primary" />

            You have lost connection to the internet. This app is offline.
          </q-banner>
        </q-popup>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: this.$q.screen.width < 600 ? 'dialog' : 'menu'
    }
  },

  watch: {
    '$q.screen.width' (width) {
      const type = width < 600
        ? 'dialog'
        : 'menu'

      if (this.type !== type) {
        this.type = type
      }
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
