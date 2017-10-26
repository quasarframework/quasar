<template>
  <div>
    <div class="layout-padding">
      <h5>"Slide" Transition</h5>

      <p class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on the Toggle below to see the transition in action.
      </p>
      <div>
        <q-toggle v-model="visible" label="Visible image" />
      </div>

      <q-slide-transition>
        <div v-show="visible" style="margin: 0">
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
      visible: true
    }
  }
}
</script>
