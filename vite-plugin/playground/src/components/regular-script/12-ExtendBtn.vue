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

<script>
import { defineComponent } from 'vue'
import { QBtn } from 'quasar'

export default defineComponent({
  name: 'ExtendBtn',
  extends: QBtn,
  props: {
    variant: {
      type: String,
      default: 'primary'
    }
  }
})
</script>
