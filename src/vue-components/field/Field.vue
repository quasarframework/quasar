<template>
  <div
    class="q-field row"
    :class="{
      'has-error': hasError,
      floating: floating,
      vertical: vertical,
      horizontal: horizontal,
      focused: focused
    }"
  >
    <i v-if="icon || insetIcon" class="q-field-icon">{{ icon }}</i>
    <div class="q-field-container flex auto">
      <div
        v-if="label || insetLabel"
        v-html="label"
        class="q-field-label auto"
        @click="focus"
      ></div>

      <div class="q-field-content column" :style="contentStyle">
        <slot></slot>
        <div v-if="hasBottom" class="q-field-bottom">
          <div
            v-if="counter"
            class="q-field-count float-right"
            :class="{'text-negative': counterError}"
            v-html="counter"
          ></div>
          <div v-if="hasError && errorLabel" class="q-field-error" v-html="errorLabel"></div>
          <div v-else-if="helper" class="q-field-helper" v-html="helper"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    orientation: {
      type: String,
      validator (val) {
        return !val ? true : ['vertical', 'horizontal'].includes(val)
      }
    },
    contentWidth: {
      type: Number,
      default: 70,
      validator (val) {
        return val > 0 && val < 100
      }
    },
    inset: {
      type: String,
      validator (val) {
        return ['icon', 'label', 'full'].includes(val)
      }
    },
    error: Boolean,
    errorLabel: String,
    helper: String,
    icon: String
  },
  data () {
    return {
      is_q_field: true,
      focused: false,
      counter: false,
      counterError: false,
      childError: false,
      floating: false
    }
  },
  computed: {
    hasBottom () {
      return (this.hasError && this.errorLabel) || this.helper || this.counter
    },
    contentStyle () {
      return this.label || this.insetLabel
        ? {width: `${this.contentWidth}%`, minWidth: `${this.contentWidth}%`}
        : `width: 100%`
    },
    insetIcon () {
      return ['icon', 'full'].includes(this.inset)
    },
    insetLabel () {
      return ['label', 'full'].includes(this.inset)
    },
    vertical () {
      return this.orientation === 'vertical'
    },
    horizontal () {
      return this.orientation === 'horizontal'
    },
    hasError () {
      return this.childError || this.error
    }
  },
  methods: {
    focus () {
      const target = this.$el.querySelector('input, textarea')
      if (target) {
        target.focus()
      }
    },
    __setFocus (set) {
      this.focused = set
    },
    __setCounter (counter, error = false) {
      this.counter = counter
      this.counterError = error
    },
    __setFloating (floating) {
      this.floating = floating
    },
    __setError (error) {
      this.childError = error
    }
  }
}
</script>
