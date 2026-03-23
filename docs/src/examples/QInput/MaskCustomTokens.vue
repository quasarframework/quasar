<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-input
        filled
        v-model="id"
        label="Special ID"
        mask="AA-CC-XX-CC"
        :mask-tokens="customTokens"
        hint="Mask: AA-CC-XX-CC, example: BC-12-56-E2"
      />

      <div>C (0-4a-eA-E to uppercase), X override (5-8)</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    return {
      id: ref(null),
      customTokens: {
        C: {
          pattern: '[0-4a-eA-E]',
          negate: '[^0-4a-eA-E]',
          transform: v => v.toLocaleUpperCase()
        },
        X: { pattern: '[5-8]', negate: '[^5-8]' }
      }
    }
  }
}
</script>
