<template>
  <div
    class="q-field row no-wrap items-start"
    :class="{
      'q-field-floating': childHasLabel,
      'q-field-with-error': hasError,
      'q-field-dark': isDark
    }"
  >
    <q-icon v-if="icon" :name="icon" class="q-field-icon"></q-icon>
    <div v-else-if="insetIcon" class="q-field-icon"></div>

    <div class="row col">
      <div
        v-if="hasLabel"
        class="q-field-label col-xs-12"
        :class="`col-sm-${labelWidth}`"
      >
        <div class="q-field-label-inner row items-center">
          <span v-if="label" v-html="label"></span>
          <slot name="label"></slot>
        </div>
      </div>

      <div class="col-xs-12 col-sm">
        <slot></slot>
        <div v-if="hasBottom" class="q-field-bottom row no-wrap">
          <div v-if="hasError && errorLabel" class="q-field-error col" v-html="errorLabel"></div>
          <div v-else-if="helper" class="q-field-helper col" v-html="helper"></div>
          <div v-if="counter" class="q-field-counter col-auto">{{ counter }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { QIcon } from '../icon'

export default {
  name: 'q-field',
  components: {
    QIcon
  },
  props: {
    labelWidth: {
      type: Number,
      default: 5,
      validator (val) {
        return val >= 1 && val <= 12
      }
    },
    inset: {
      type: String,
      validator (val) {
        return ['icon', 'label', 'full'].includes(val)
      }
    },
    label: String,
    count: {
      type: [Number, Boolean],
      default: false
    },
    error: Boolean,
    errorLabel: String,
    helper: String,
    icon: String,
    dark: Boolean
  },
  data () {
    return {
      input: {}
    }
  },
  computed: {
    hasError () {
      return this.input.error || this.error
    },
    hasBottom () {
      return (this.hasError && this.errorLabel) || this.helper || this.count
    },
    hasLabel () {
      return this.label || this.$slots.label || ['label', 'full'].includes(this.inset)
    },
    childHasLabel () {
      return this.input.floatLabel || this.input.stackLabel
    },
    isDark () {
      return this.input.dark || this.dark
    },
    insetIcon () {
      return ['icon', 'full'].includes(this.inset)
    },
    counter () {
      if (this.count) {
        const length = this.input.length || '0'
        return Number.isInteger(this.count)
          ? `${length} / ${this.count}`
          : length
      }
    }
  },
  provide () {
    return {
      __field: this
    }
  },
  methods: {
    __registerInput (vm) {
      this.input = vm
    },
    __unregisterInput () {
      this.input = {}
    }
  }
}
</script>
