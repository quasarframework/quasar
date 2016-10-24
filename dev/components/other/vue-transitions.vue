<template>
  <div>
    <div class="layout-padding">
      <h5>"Slide" Transition</h5>

      <p class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on the Toggle below to see the transition in action.
      </p>
      <p>
        <label>
          <quasar-toggle v-model="visible"></quasar-toggle>
          Visible image
        </label>
      </p>

      <quasar-transition name="slide">
        <p v-show="visible">
          <img
            class="responsive"
            :src="'statics/quasar.jpg'"
          >
        </p>
      </quasar-transition>
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
