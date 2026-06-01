<template>
  <div class="relative-position copybtn-hover">
    <DocCodeHighlight :lang="props.lang" :code="props.code" />
    <CopyButton />
  </div>
</template>

<script setup>
import { computed } from 'vue'

import DocCodeHighlight from './DocCodeHighlight.js'
import CopyButton from './CopyButton.vue'

const props = defineProps({
  code: String,
  lang: {
    type: String,
    default: 'js'
  }
})
</script>
