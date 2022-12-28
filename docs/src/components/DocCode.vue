<template>
  <div class="relative-position">
    <code-prism :lang="props.lang" :code="props.code" :style="style" />
    <div class="doc-code__copy absolute">
      <copy-button :text="props.code" />
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
    ? { maxHeight: props.maxHeight }
    : null
))
</script>
