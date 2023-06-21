<template>
  <h3>Extended</h3>

  <q-btn
    v-bind="{
      ...$props,
      color: variant,
    }"
  >
  </q-btn>
  <slot></slot>
</template>

<script>
import { defineComponent } from 'vue'
import { QBtn } from 'quasar'

export default defineComponent({
  name: 'ExtendedBtn',
  extends: QBtn,
  props: {
    variant: {
      type: String,
      default: 'primary'
    }
  }
})
</script>
