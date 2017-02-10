<template>
  <div
    class="q-input row items-start"
    :class="{
      disabled: disabled,
      readonly: readonly,
      focused: focused,
      'has-error': hasError,
      'has-label': label,
      textarea: isTextarea,
      dropdown: dropdown
    }"
  >
    <i
      v-if="isNumber"
      class="q-input-comp q-input-button"
      @click="setNumberByOffset(-step)"
    >remove</i>
    <slot name="before">
      <span v-if="prefix" class="q-input-comp" v-html="prefix"></span>
    </slot>
    <div
      class="q-input-target q-input-comp auto"
      :class="{'relative-position': floatLabel && !labelIsAbove}"
    >
      <div
        v-if="label"
        class="q-input-label ellipsis full-width"
        :class="{above: labelIsAbove}"
        v-html="label"
        @click="focus"
      ></div>

      <textarea
        v-if="isTextarea"
        ref="input"
        :type="type"
        :value="model"
        @input="setValue"
        @focus="__focus"
        @blur="__blur"
        @mousedown="__mousedown"
        :name="name"
        :autofocus="autofocus"
        :pattern="pattern"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly || dropdown"
        :required="required"
        :maxlength="maxlength"
        class="no-style full-width"
      ></textarea>
      <input
        v-else
        ref="input"
        :type="inputType"
        :value="model"
        @input="setValue"
        @focus="__focus"
        @blur="__blur"
        @mousedown="__mousedown"
        :name="name"
        :autofocus="autofocus"
        :pattern="inputPattern"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly || dropdown"
        :required="required"
        :maxlength="maxlength"
        :min="min"
        :max="max"
        :step="step"
        class="no-style full-width"
      >
    </div>
    <slot name="after">
      <span v-if="suffix" class="q-input-comp" v-html="suffix"></span>
    </slot>
    <i
      v-if="isNumber"
      class="q-input-comp q-input-button"
      @click="setNumberByOffset(step)"
    >add</i>
    <span
      v-if="hasInlineCounter"
      class="q-input-comp q-input-small self-center"
      v-html="counterLabel"
    ></span>
    <i
      v-if="isPassword"
      class="q-input-comp q-input-button self-center"
      @click="togglePassVisibility"
      v-text="showPass ? 'visibility' : 'visibility_off'"
    ></i>
    <span v-if="dropdown" class="q-input-comp q-input-button">
      <span class="caret"></span>
    </span>
    <div v-if="$q.theme === 'mat'" class="q-input-border"></div>
    <slot></slot>
  </div>
</template>

<script>
import { getParent } from '../../utils/vue'

function exists (val) {
  return typeof val !== 'undefined'
}

export default {
  props: {
    name: String,
    value: {
      required: true
    },
    type: {
      type: String,
      default: 'input',
      validator (t) {
        return ['input', 'textarea', 'email', 'tel', 'file', 'number', 'password', 'url']
      }
    },
    autofocus: Boolean,
    pattern: String,
    prefix: String,
    suffix: String,
    placeholder: String,
    floatLabel: String,
    stackedLabel: String,
    error: Boolean,
    count: {
      type: [Number, Boolean],
      default: false
    },
    maxlength: [Number, String],
    dropdown: Boolean,
    required: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    min: Number,
    max: Number,
    step: {
      type: Number,
      default: 1
    },
    maxDecimals: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      focused: false,
      showPass: false,
      field: false
    }
  },
  watch: {
    count () {
      this.__notify('count')
    },
    inlineCount () {
      this.__notify('count')
    },
    hasError () {
      this.__notify('error')
    },
    focused () {
      this.__notify('focus')
    }
  },
  computed: {
    model: {
      get () {
        this.__notify('count')
        return this.value
      },
      set (val) {
        if (this.value !== val) {
          this.$emit('input', val)
        }
      }
    },
    label () {
      const label = this.stackedLabel || this.floatLabel
      this.__notify('floating', Boolean(label))
      return label
    },
    labelIsAbove () {
      return this.focused || this.stackedLabel || this.length > 0
    },
    isTextarea () {
      return this.type === 'textarea'
    },
    isNumber () {
      return this.type === 'number'
    },
    editable () {
      return !this.disabled && !this.readonly && !this.dropdown
    },
    length () {
      return exists(this.value) ? ('' + this.value).length : 0
    },
    counterLabel () {
      return `${this.length}${this.count !== true && this.count > 0 ? ` / ${this.count}` : ''}`
    },
    hasCountError () {
      if (this.count !== true && this.count > 0) {
        return this.length > this.count
      }
    },
    hasInvalidNumber () {
      return (
        (exists(this.min) && this.value < this.min) ||
        (exists(this.max) && this.value > this.max)
      )
    },
    hasInlineCounter () {
      return this.count && !this.field
    },
    hasError () {
      if (this.isNumber && this.hasInvalidNumber) {
        return true
      }
      return this.error || this.hasCountError
    },
    isPassword () {
      return this.type === 'password'
    },
    inputType () {
      return this.isPassword
        ? (this.showPass ? 'input' : 'password')
        : this.type
    },
    inputPattern () {
      if (this.isNumber) {
        return this.pattern || '[0-9]*'
      }
    }
  },
  methods: {
    setValue (val) {
      this.model = val.target ? val.target.value : val
    },
    setNumberByOffset (offset = 0) {
      let val = exists(this.value)
        ? this.value + offset
        : (exists(this.min) ? this.min : 0)

      if (exists(this.min) && val < this.min) {
        val = this.min
      }
      else if (exists(this.max) && val > this.max) {
        val = this.max
      }

      this.model = parseFloat(val).toFixed(this.maxDecimals)
    },
    focus () {
      if (this.editable) {
        this.$refs.input.focus()
        return
      }
      this.__focus()
    },
    togglePassVisibility () {
      this.showPass = !this.showPass
    },
    __focus (e) {
      if (this.dropdown && e) {
        return
      }
      this.focused = true
      this.$emit('focus')
    },
    __blur (e) {
      if (this.dropdown && e) {
        return
      }
      this.focused = false
      this.$emit('blur')
    },
    __notify (type, value) {
      if (!this.field) {
        return
      }

      this.$nextTick(() => {
        if (type === 'error') {
          this.field.__setError(this.hasError)
        }
        else if (type === 'focus') {
          this.field.__setFocus(this.focused)
        }
        else if (type === 'count') {
          this.field.__setCounter(!this.count ? false : this.counterLabel, this.hasCountError)
        }
        else if (type === 'floating') {
          this.field.__setFloating(value)
        }
      })
    },
    __mousedown (e) {
      if (!this.editable && this.$q.platform.is.ios) {
        e.preventDefault()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.field = getParent(this.$parent, 'is_q_field')
      this.__notify('count')
    })
  },
  beforeDestroy () {
    this.__notify('count')
    this.__notify('floating', false)
  }
}
</script>
