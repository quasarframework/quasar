<template>
  <div
    class="q-chip row inline items-center"
    :class="{
      tag: tag,
      outline: outline,
      square: square,
      floating: floating,
      pointing: pointing,
      small: small || floating,
      [`pointing-${pointing}`]: pointing,
      [`bg-${color}`]: color,
      'text-white': color
    }"
  >
    <div
      v-if="$slots.left"
      class="q-chip-side chip-left row items-center justify-center"
      :class="{'chip-detail': detail}"
    >
      <slot name="left"></slot>
    </div>

    <slot></slot>

    <div v-if="closable" class="q-chip-side chip-right row items-center justify-center">
      <q-icon
        v-if="closable"
        name="cancel"
        class="cursor-pointer"
        @click="$emit('close')"
      ></q-icon>
    </div>
  </div>
</template>

<script>
import { QIcon } from '../icon'

export default {
  name: 'q-chip',
  components: {
    QIcon
  },
  props: {
    small: Boolean,
    tag: Boolean,
    outline: Boolean,
    square: Boolean,
    floating: Boolean,
    pointing: {
      type: String,
      validator: v => ['up', 'right', 'down', 'left'].includes(v)
    },
    color: String,
    closable: Boolean,
    detail: Boolean
  }
}
</script>
