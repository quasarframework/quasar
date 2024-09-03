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
