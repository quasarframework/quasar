<template>
  <div class="doc-code-container relative-position">
    <code-prism :lang="lang" :code="code" :style="style" />
    <div class="doc-code-container__copy absolute">
      <copy-button :text="code" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import CodePrism from './CodePrism.js'
import CopyButton from './CopyButton.vue'

const props = defineProps({
  code: String,
  maxHeight: String,

  lang: {
    type: String,
    default: 'js'
  }
})

const style = computed(() => (
  props.maxHeight !== void 0
    ? { overflow: 'auto', maxHeight: props.maxHeight }
    : null
))
</script>

<style lang="sass">
.doc-code-container
  &__copy
    top: 8px
    right: 16px
</style>
