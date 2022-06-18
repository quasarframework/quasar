<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <q-tabs
        no-caps
        class="bg-orange text-white shadow-2"
      >
        <q-route-tab :to="{ query: { tab: '1', noScroll: true } }" replace label="Activate in 2s" @click="navDelay" />
        <q-route-tab :to="{ query: { tab: '2', noScroll: true } }" replace label="Do nothing" @click="navCancel" />
        <q-route-tab :to="{ query: { tab: '3', noScroll: true } }" replace label="Navigate to the second tab" @click="navRedirect" />
        <q-route-tab :to="{ query: { tab: '4', noScroll: true } }" replace label="Navigate immediatelly" @click="navPass" />
      </q-tabs>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    navDelay (e, go) {
      e.preventDefault() // we cancel the default navigation

      // console.log('triggering navigation in 2s')
      setTimeout(() => {
        // console.log('navigating as promised 2s ago')
        go()
      }, 2000)
    },

    navCancel (e) {
      e.preventDefault() // we cancel the default navigation
    },

    navRedirect (e, go) {
      e.preventDefault() // we cancel the default navigation
      go({ query: { tab: '2', noScroll: true } })
    },

    navPass () {}
  }
}
</script>
