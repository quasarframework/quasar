<template>
  <div
    class="q-field row"
    :class="{
      'has-error': hasError,
      floating: floating,
      focused: focused,
      'with-icon': icon,
      'with-label': label
    }"
  >
    <q-icon :name="icon" v-if="icon || insetIcon" class="q-field-icon col-auto self-start"></q-icon>

    <div class="q-field-container row col">
      <div
        v-if="hasLabel"
        class="q-field-label col-xs-12"
        :class="labelClass"
        @click="focus"
      >
        <slot name="label">
          <span v-html="label"></span>
        </slot>
        <q-icon v-if="hasLabelHint" class="q-field-label-hint" name="help">
          <q-tooltip>
            <slot name="labelHint">
              <span v-html="labelHint"></span>
            </slot>
          </q-tooltip>
        </q-icon>
      </div>

      <div class="q-field-content col-xs-12 col-sm">
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
import { QIcon } from '../icon'
import { QTooltip } from '../tooltip'

export default {
  name: 'q-field',
  components: {
    QIcon,
    QTooltip
  },
  props: {
    label: String,
    labelHint: String,
    orientation: {
      type: String,
      validator (val) {
        return !val ? true : ['vertical', 'horizontal'].includes(val)
      }
    },
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
    error: Boolean,
    errorLabel: String,
    helper: String,
    icon: String,
    required: Boolean
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
    hasLabel () {
      return this.label || this.insetLabel || this.$slots.label || this.hasLabelHint
    },
    hasLabelHint () {
      return this.labelHint || this.$slots.labelHint
    },
    hasBottom () {
      return (this.hasError && this.errorLabel) || this.helper || this.counter
    },
    insetIcon () {
      return ['icon', 'full'].includes(this.inset)
    },
    insetLabel () {
      return ['label', 'full'].includes(this.inset)
    },
    hasError () {
      return this.childError || this.error
    },
    labelClass () {
      const cls = [`col-sm-${this.labelWidth}`]
      if (this.required) {
        cls.push('required-label')
      }
      return cls
    }
  },
  provide () {
    return {
      hasField: true,
      __setFieldFocus: set => {
        this.focused = set
      },
      __setFieldCounter: (counter, error = false) => {
        this.counter = counter
        this.counterError = error
      },
      __setFieldFloating: floating => {
        this.floating = floating
      },
      __setFieldError: error => {
        this.childError = error
      }
    }
  },
  methods: {
    focus () {
      const target = this.$el.querySelector('input, textarea')
      if (target) {
        target.focus()
      }
    }
  }
}
</script>
