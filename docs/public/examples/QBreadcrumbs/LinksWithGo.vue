<template>
  <div class="q-pa-md q-gutter-sm">
    <q-breadcrumbs>
      <q-breadcrumbs-el label="Delayed" icon="widgets" to="/" @click="onDelayedClick" />
      <q-breadcrumbs-el label="Cancelled" icon="navigation" to="/" @click="onCancelledClick" />
      <q-breadcrumbs-el label="Redirected" icon="build" to="/" @click="onRedirectedClick" />
      <q-breadcrumbs-el label="Page" />
    </q-breadcrumbs>
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
