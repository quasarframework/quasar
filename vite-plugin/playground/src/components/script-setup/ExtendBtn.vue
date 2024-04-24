<template>
  <h6>Extend Btn</h6>

  <q-btn
    v-bind="{
      ...$props,
      color: variant,
    }"
  >
  </q-btn>

  <slot />
</template>

<script setup>
import { QBtn } from 'quasar'

defineProps({
  ...QBtn.props,
  variant: {
    type: String,
    default: 'primary'
  }
})
</script>
