<template>
  <div
    class="q-checkbox q-option cursor-pointer no-outline q-focusable row inline no-wrap items-center"
    :class="{disabled: disable, reverse: leftLabel}"
    @click.stop.prevent="toggle"
    tabindex="0"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    @keydown.space.enter.prevent="toggle(false)"
  >
    <div class="q-option-inner relative-position" :class="innerClasses">
      <input
        type="checkbox"
        v-model="model"
        :value="val"
        :disabled="disable"
        @click.stop
        @change="__change"
      >

      <div class="q-focus-helper"></div>

      <q-icon class="q-checkbox-icon cursor-pointer" :name="uncheckedIcon || $q.icon.checkbox.unchecked[$q.theme]" :style="uncheckedStyle"></q-icon>
      <q-icon class="q-checkbox-icon cursor-pointer absolute-full" :name="indeterminateIcon || $q.icon.checkbox.indeterminate[$q.theme]" :style="indeterminateStyle"></q-icon>
      <q-icon class="q-checkbox-icon cursor-pointer absolute-full" :name="checkedIcon || $q.icon.checkbox.checked[$q.theme]" :style="checkedStyle"></q-icon>

      <div v-if="$q.theme !== 'ios'" ref="ripple" class="q-radial-ripple"></div>
    </div>

    <span class="q-option-label" v-if="label" v-html="label"></span>
    <slot></slot>
  </div>
</template>

<script>
import Mixin from '../../mixins/checkbox'
import OptionGroupMixin from '../../mixins/option'
import { QIcon } from '../icon'

export default {
  name: 'q-checkbox',
  mixins: [Mixin, OptionGroupMixin],
  components: {
    QIcon
  },
  props: {
    indeterminate: Boolean,
    checkedIcon: String,
    uncheckedIcon: String,
    indeterminateIcon: String
  },
  computed: {
    checkedStyle () {
      return this.isActive
        ? {transition: 'opacity 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 800ms cubic-bezier(0.23, 1, 0.32, 1) 0ms', opacity: 1, transform: 'scale(1)'}
        : {transition: 'opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 0ms cubic-bezier(0.23, 1, 0.32, 1) 450ms', opacity: 0, transform: 'scale(0)'}
    },
    indeterminateStyle () {
      return this.indeterminate && !this.isActive
        ? {transition: 'opacity 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 800ms cubic-bezier(0.23, 1, 0.32, 1) 0ms', opacity: 1, transform: 'scale(1)'}
        : {transition: 'opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 0ms cubic-bezier(0.23, 1, 0.32, 1) 450ms', opacity: 0, transform: 'scale(0)'}
    },
    uncheckedStyle () {
      return this.isActive
        ? {transition: 'opacity 650ms cubic-bezier(0.23, 1, 0.32, 1) 150ms', opacity: 0}
        : {opacity: 1}
    }
  }
}
</script>
