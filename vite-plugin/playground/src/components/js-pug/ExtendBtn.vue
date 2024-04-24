<template lang="pug">
h6 Extend Btn
q-btn(v-bind='{...$props,color: variant}')
slot
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
