<template>
  <div
    class="q-chip row inline items-center"
    :class="{
      tag: tag,
      square: square,
      floating: floating,
      pointing: pointing,
      small: small || floating,
      [`pointing-${pointing}`]: pointing,
      [`bg-${color}`]: color,
      'text-white': color
    }"
    @click="__onClick"
  >
    <div
      v-if="icon || avatar"
      class="q-chip-side chip-left row items-center justify-center"
      :class="{'chip-detail': detail}"
    >
      <q-icon v-if="icon" :name="icon"></q-icon>
      <img v-else-if="avatar" :src="avatar" />
    </div>

    <slot></slot>

    <q-icon v-if="iconRight" :name="iconRight" class="on-right"></q-icon>

    <div v-if="closable" class="q-chip-side chip-right row items-center justify-center">
      <q-icon
        v-if="closable"
        name="cancel"
        class="cursor-pointer"
        @click.stop="$emit('close')"
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
    square: Boolean,
    floating: Boolean,
    pointing: {
      type: String,
      validator: v => ['up', 'right', 'down', 'left'].includes(v)
    },
    color: String,
    icon: String,
    iconRight: String,
    avatar: String,
    closable: Boolean,
    detail: Boolean
  },
  methods: {
    __onClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>
