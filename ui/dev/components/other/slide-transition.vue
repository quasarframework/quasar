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

      <div class="q-mt-xl q-mb-xs">
        <q-toggle v-model="visibleVShow2" label="Visible with v-show - with animated elements inside" />
      </div>
      <q-slide-transition @show="log('show')" @hide="log('hide')" :duration="5000">
        <div v-show="visibleVShow2" style="margin: 0">
          <q-btn label="Toggle - Button with animation" color="primary" class="q-ma-lg" @click="visibleVShow2 = !visibleVShow2" />
          <img
            class="responsive"
            src="~assets/quasar.jpg"
          >
        </div>
      </q-slide-transition>

      <div class="q-mt-xl q-mb-xs">
        <q-toggle v-model="visibleVIf2" label="Visible with v-if - with animated elements inside" />
      </div>
      <q-slide-transition @show="log('show')" @hide="log('hide')" :duration="5000">
        <div v-if="visibleVIf2" style="margin: 0">
          <q-btn label="Toggle - Button with animation" color="primary" class="q-ma-lg" @click="visibleVIf2 = !visibleVIf2" />
          <img
            class="responsive"
            src="~assets/quasar.jpg"
          >
        </div>
      </q-slide-transition>

      <div class="caption row col-gutter-sm items-center">
        V-Show test (height 0) - enable first Inner and then Outer
        <q-toggle v-model="outerCondition" label="Outer block" />
        <q-toggle v-model="innerCondition" label="Inner block" />
        <q-btn label="Toggle both" @click="toggleConditions" />
      </div>
      <q-slide-transition>
        <div v-show="outerCondition">
          <div>Outer block</div>
          <q-slide-transition>
            <div v-show="innerCondition">
              <img
                class="responsive"
                src="~assets/quasar.jpg"
              >
            </div>
          </q-slide-transition>
        </div>
      </q-slide-transition>

      <div style="height: 500px">
        Scroll on purpose
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visibleVShow: true,
      visibleVIf: true,
      visibleVShow2: true,
      visibleVIf2: true,
      outerCondition: false,
      innerCondition: false
    }
  },
  methods: {
    log (msg) {
      console.log(msg)
    },

    toggleConditions () {
      this.outerCondition = !this.outerCondition
      this.innerCondition = !this.innerCondition
    }
  }
}
</script>
