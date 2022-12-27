<template>
  <div class="q-pa-md q-gutter-sm">
    <q-item to="/" @click="onDelayedClick" dense>
      <q-item-section>Delayed navigation</q-item-section>
    </q-item>

    <q-item to="/" @click="onCancelledClick" dense>
      <q-item-section>Cancelled navigation</q-item-section>
    </q-item>

    <q-item to="/" @click="onRedirectedClick" dense>
      <q-item-section>Redirected navigation</q-item-section>
    </q-item>
  </div>
</template>

<script>
export default {
  setup () {
    function onDelayedClick (e, go) {
      e.preventDefault() // mandatory; we choose when we navigate

      // console.log('triggering navigation in 2s')
      setTimeout(() => {
        // console.log('navigating as promised 2s ago')
        go()
      }, 2000)
    }

    function onCancelledClick (e, go) {
      e.preventDefault() // mandatory; we choose when we navigate
      // then we never call go()
    }

    function onRedirectedClick (e, go) {
      e.preventDefault() // mandatory; we choose when we navigate

      // call this at your convenience
      go({
        to: '/start/pick-quasar-flavour' // we pick another route
        // replace: boolean; default is what the tab is configured with
        // returnRouterError: boolean
      }).then(_vueRouterResult => { /* ... */ })
        .catch(_vueRouterError => {
          /* ...will not reach here unless returnRouterError === true */
        })
    }

    return { onDelayedClick, onCancelledClick, onRedirectedClick }
  }
}
</script>
