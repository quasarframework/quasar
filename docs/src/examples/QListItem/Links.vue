<template>
  <div class="q-pa-md q-gutter-sm">
     <q-list bordered class="q-my-md" :dark="dark">
        <q-item to="/" exact>
          <q-item-section avatar>
            <q-icon name="bluetooth" />
          </q-item-section>
          <q-item-section>Inactive link</q-item-section>
        </q-item>

        <q-item :to="$route.path">
          <q-item-section avatar>
            <q-icon name="signal_wifi_off" />
          </q-item-section>
          <q-item-section>Active link</q-item-section>
        </q-item>

        <q-item to="/" exact>
          <q-item-section avatar>
            <q-icon name="bluetooth" />
          </q-item-section>
          <q-item-section>Inactive link</q-item-section>
        </q-item>

        <q-item :to="$route.path">
          <q-item-section avatar>
            <q-icon name="signal_wifi_off" />
          </q-item-section>
          <q-item-section>Active link</q-item-section>
        </q-item>

        <!-- check .my-link CSS class below -->
        <q-item to="/components/list-item" active-class="my-link">
          <q-item-section avatar>
            <q-icon name="signal_wifi_off" />
          </q-item-section>
          <q-item-section>Customized active link</q-item-section>
        </q-item>
      </q-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dark: false
    }
  }
}
</script>

<style lang="stylus">
@import '~quasar-variables'

.my-link
  color white
  background $deep-orange
</style>
