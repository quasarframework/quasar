<template>
  <h3>Extend Btn</h3>

  <q-btn
    v-bind="{
      ...$props,
      color: variant,
    }"
  >
  </q-btn>
  <slot></slot>
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
