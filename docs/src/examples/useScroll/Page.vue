<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm q-mb-md">
      <q-badge :label="`page top: ${position.top}`" />
      <q-badge :label="`direction: ${direction}`" />
    </div>

    <q-btn
      color="primary"
      push
      icon="keyboard_arrow_up"
      label="Back to top"
      :disable="position.top <= 300 || direction !== 'up'"
      @click="scrollToTop"
    />
  </div>
</template>

<script setup>
import { scroll, useScroll } from 'quasar'

// no options: the auto detection starts from this component's root
// element and ends up on the page itself
const { position, direction } = useScroll()

function scrollToTop() {
  scroll.setVerticalScrollPosition(window, 0, 300)
}
</script>
