<template>
  <div class="relative-position copybtn-hover">
    <CodePrism :lang="props.lang" :code="props.code" :style="style" />
    <CopyButton />
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
