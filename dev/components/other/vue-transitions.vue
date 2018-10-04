<template>
  <div>
    <div class="q-layout-padding">
      <h5>"Slide" Transition</h5>

      <div class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on the Toggle below to see the transition in action.
      </div>

      <div class="q-mt-xl q-mb-xs">
        <q-toggle v-model="visibleVShow" label="Visible with v-show" />
      </div>
      <q-slide-transition @show="log('show')" @hide="log('hide')">
        <div v-show="visibleVShow" style="margin: 0">
          <img
            class="responsive"
            src="~assets/quasar.jpg"
          >
        </div>
      </q-slide-transition>

      <div class="q-mt-xl q-mb-xs">
        <q-toggle v-model="visibleVIf" label="Visible with v-if" />
      </div>
      <q-slide-transition @show="log('show')" @hide="log('hide')">
        <div v-if="visibleVIf" style="margin: 0">
          <img
            class="responsive"
            src="~assets/quasar.jpg"
          >
        </div>
      </q-slide-transition>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visibleVShow: true,
      visibleVIf: true
    }
  },
  methods: {
    log (msg) {
      console.log(msg)
    }
  }
}
</script>
