<template>
  <div
    class="q-toggle cursor-pointer relative-position no-outline q-focusable"
    :class="{disabled: disable, active: isActive, [`text-${color}`]: isActive && color}"
    v-touch-swipe.horizontal="__swipe"
    @click.stop.prevent="toggle"
    tabindex="0"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    @keydown.space.enter.prevent="toggle(false)"
  >
    <input
      type="checkbox"
      v-model="model"
      :value="val"
      :disabled="disable"
      @click.stop
      @change="__change"
    >

    <div class="q-focus-helper"></div>

    <div class="q-toggle-base"></div>
    <div class="q-toggle-handle shadow-1 row items-center justify-center">
      <q-icon v-if="currentIcon" class="q-toggle-icon" :name="currentIcon"></q-icon>
      <div v-if="$q.theme !== 'ios'" ref="ripple" class="q-radial-ripple"></div>
    </div>

    <slot></slot>
  </div>
</template>

<script>
import Mixin from '../checkbox/checkbox-mixin'
import { QIcon } from '../icon'
import TouchSwipe from '../../directives/touch-swipe'

export default {
  name: 'q-toggle',
  components: {
    QIcon
  },
  directives: {
    TouchSwipe
  },
  mixins: [Mixin],
  props: {
    icon: String,
    checkedIcon: String,
    uncheckedIcon: String
  },
  computed: {
    currentIcon () {
      return (this.isActive ? this.checkedIcon : this.uncheckedIcon) || this.icon
    }
  },
  methods: {
    __swipe (evt) {
      if (evt.direction === 'left') {
        this.unselect()
      }
      else if (evt.direction === 'right') {
        this.select()
      }
    }
  }
}
</script>
