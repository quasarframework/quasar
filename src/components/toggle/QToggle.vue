<template>
  <div
    class="q-toggle q-option cursor-pointer no-outline q-focusable row inline no-wrap items-center"
    :class="{disabled: disable, reverse: leftLabel}"
    v-touch-swipe.horizontal="__swipe"
    @click.stop.prevent="toggle"
    tabindex="0"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    @keydown.space.enter.prevent="toggle(false)"
  >
    <div class="q-option-inner relative-position" :class="classes">
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
    </div>

    <span class="q-option-label" v-if="label" v-html="label"></span>
    <slot></slot>
  </div>
</template>

<script>
import Mixin from '../checkbox/checkbox-mixin'
import OptionMixin from '../option-group/option-mixin'
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
  mixins: [Mixin, OptionMixin],
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
