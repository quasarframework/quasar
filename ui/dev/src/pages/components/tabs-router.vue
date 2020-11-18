<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 1600px">
      <q-tabs
        no-caps
        class="bg-orange text-white shadow-2"
      >
        <q-route-tab replace :to="{ query: { tab: '1', noScroll: true } }" label="Activate in 2s" @click="navDelay" />
        <q-route-tab replace :to="{ query: { tab: '2', noScroll: true } }" label="Do nothing" @click="navCancel" />
        <q-route-tab replace :to="{ query: { tab: '3', noScroll: true } }" label="Navigate to the second tab" @click="navRedirect" />
        <q-route-tab replace :to="{ query: { tab: '4', noScroll: true } }" label="Navigate immediatelly" @click="navPass" />

        <q-route-tab replace :to="{ query: { tab: '5', noScroll: true } }" label="With button" @click="navPass">
          <q-btn unelevated :label="`Click (${ clickCounter })`" @click.stop.prevent="onClick" />
        </q-route-tab>
      </q-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      clickCounter: 0
    }
  },

  methods: {
    navDelay (e, go) {
      e.navigate = false // we cancel the default navigation

      // console.log('triggering navigation in 2s')
      setTimeout(() => {
        // console.log('navigating as promised 2s ago')
        go()
      }, 2000)
    },

    navCancel (e) {
      e.navigate = false // we cancel the default navigation
    },

    navRedirect (e, go) {
      e.navigate = false // we cancel the default navigation

      go({ query: { tab: '2', noScroll: true } })
    },

    navPass () {},

    onClick () {
      this.clickCounter += 1
    }
  }
}
</script>
