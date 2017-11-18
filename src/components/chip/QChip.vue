<template>
  <div
    class="q-chip row no-wrap inline items-center"
    :class="classes"
    @click="__onClick"
  >
    <div
      v-if="icon || avatar"
      class="q-chip-side chip-left row flex-center"
      :class="{'chip-detail': detail}"
    >
      <q-icon v-if="icon" :name="icon"></q-icon>
      <img v-else-if="avatar" :src="avatar" />
    </div>

    <div
      class="q-chip-main"
    >
      <slot></slot>
    </div>

    <q-icon v-if="iconRight" :name="iconRight" class="on-right"></q-icon>

    <div v-if="closable" class="q-chip-side chip-right row flex-center">
      <q-icon
        v-if="closable"
        name="cancel"
        class="cursor-pointer"
        @click.stop="$emit('hide')"
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
  computed: {
    classes () {
      const cls = [{
        tag: this.tag,
        square: this.square,
        floating: this.floating,
        pointing: this.pointing,
        small: this.small || this.floating
      }]
      this.pointing && cls.push(`pointing-${this.pointing}`)
      if (this.color) {
        cls.push(`bg-${this.color}`)
        cls.push(`text-white`)
      }
      return cls
    }
  },
  methods: {
    __onClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>
