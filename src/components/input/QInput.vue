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
      dropdown: isDropdown,
      simple: simple,
      complex: complex
    }"
    @click="__click"
  >
    <q-icon
      v-if="isNumber && extraIcons"
      class="q-input-comp q-input-button"
      @click="setNumberByOffset(-step)"
      name="remove"
    ></q-icon>
    <slot name="before"></slot>
    <span v-if="prefix" class="q-input-comp" v-html="prefix"></span>
    <div
      class="q-input-target q-input-comp auto row"
      :class="{
        'relative-position': floatLabel && !labelIsAbove,
        flow: $slots['flow-before'] || $slots['flow-after']
      }"
    >
      <slot name="flow-before">
        <div
          v-if="label"
          class="q-input-label ellipsis full-width"
          :class="{above: labelIsAbove}"
          v-html="label"
          @click="focus"
        ></div>
      </slot>

      <textarea
        v-if="isTextarea"
        ref="input"
        :value="model"
        @input="setValue"
        @focus="__focus"
        @blur="__blur"
        @mousedown="__mousedown"
        @keydown="__keydown"
        @keyup="__keyup"
        :name="name"
        :pattern="pattern"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :maxlength="maxlength"
        :rows="rows"
        class="auto"
        :class="`text-${align}`"
        tabindex="0"
      ></textarea>
      <div
        ref="input"
        v-else-if="isDropdown"
        v-text="model"
        @focus="__focus"
        @blur="__blur"
        @mousedown="__mousedown"
        @keydown="__keydown"
        @keyup="__keyup"
        tabindex="0"
        class="auto no-outline ellipsis q-input-dropdown"
        :class="`text-${align}`"
      ></div>
      <input
        v-else
        ref="input"
        :type="inputType"
        :value="model"
        @input="setValue"
        @focus="__focus"
        @blur="__blur"
        @mousedown="__mousedown"
        @keydown="__keydown"
        @keyup="__keyup"
        :name="name"
        :pattern="inputPattern"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly || isDropdown"
        :required="required"
        :maxlength="maxlength"
        :min="min"
        :max="max"
        :step="computedStep"
        class="auto q-placeholder"
        :class="`text-${align}`"
        tabindex="0"
      >

      <slot name="flow-after"></slot>
    </div>
    <q-icon
      v-if="isPassword && extraIcons"
      class="q-input-comp q-input-button"
      @click="togglePassVisibility"
      :name="showPass ? 'visibility' : 'visibility_off'"
    ></q-icon>
    <span v-if="suffix" class="q-input-comp" v-html="suffix"></span>
    <q-icon
      v-if="hasClearIcon"
      class="q-input-comp q-input-button"
      @click="clear"
      name="clear"
    ></q-icon>
    <slot name="after"></slot>
    <q-icon
      v-if="isNumber && extraIcons"
      class="q-input-comp q-input-button"
      @click="setNumberByOffset(step)"
      name="add"
    ></q-icon>
    <span
      v-if="hasInlineCounter"
      class="q-input-comp q-input-faded q-input-small"
      v-html="counterLabel"
    ></span>
    <span v-if="isDropdown" class="q-input-comp q-input-button">
      <span class="caret"></span>
    </span>
    <div v-if="!simple && !complex" class="q-input-border"></div>
    <slot></slot>
  </div>
</template>

<script>
import inputTypes from './input-types'
import { QIcon } from '../icon'

function exists (val) {
  return typeof val !== 'undefined' && val !== null
}

export default {
  name: 'q-input',
  components: {
    QIcon
  },
  props: {
    name: String,
    value: {
      required: true
    },
    type: {
      type: String,
      default: 'text',
      validator (t) {
        return inputTypes.includes(t)
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
    simple: Boolean,
    complex: Boolean,
    color: String,
    count: {
      type: [Number, Boolean],
      default: false
    },
    maxlength: [Number, String],
    required: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    extraIcons: {
      type: Boolean,
      default: true
    },
    clearable: Boolean,
    min: Number,
    max: Number,
    step: {
      type: Number,
      default: 1
    },
    maxDecimals: {
      type: Number,
      default: 0
    },
    rows: {
      type: Number,
      default: 3
    },
    align: {
      type: String,
      default: 'left',
      validator: v => ['left', 'center', 'right'].includes(v)
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
        if (this.editable && this.value !== val) {
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
    editable () {
      return !this.disabled && !this.readonly && !this.isDropdown
    },
    length () {
      return exists(this.value) ? ('' + this.value).length : 0
    },
    counterLabel () {
      return `${this.length}${this.count !== true && this.count > 0 ? ` / ${this.count}` : ''}`
    },
    hasClearIcon () {
      return this.clearable && this.length
    },
    hasCountError () {
      if (this.count !== true && this.count > 0) {
        return this.length > this.count
      }
    },
    hasInvalidNumber () {
      return this.value !== '' && (
        (exists(this.min) && this.value < this.min) ||
        (exists(this.max) && this.value > this.max)
      )
    },
    hasInlineCounter () {
      return this.count && !this.hasField
    },
    hasError () {
      if (this.isNumber && this.hasInvalidNumber) {
        return true
      }
      return this.error || this.hasCountError
    },
    isTextarea () {
      return this.type === 'textarea'
    },
    isNumber () {
      return this.type === 'number'
    },
    isPassword () {
      return this.type === 'password'
    },
    isDropdown () {
      return this.type === 'dropdown'
    },
    inputType () {
      return this.isPassword
        ? (this.showPass ? 'text' : 'password')
        : (this.isDropdown ? 'text' : this.type)
    },
    inputPattern () {
      if (this.isNumber) {
        return this.pattern || '[0-9]*'
      }
    },
    inputEl () {
      return this.$refs.input
    },
    computedStep () {
      if (this.isNumer) {
        return this.step
      }
    }
  },
  inject: [
    'hasField', '__setFieldFocus', '__setFieldCounter',
    '__setFieldFloating', '__setFieldError'
  ],
  provide () {
    return {
      getInputEl: () => {
        return this.$refs.input
      },
      setInputValue: val => {
        this.model = val
      }
    }
  },
  methods: {
    setValue (val) {
      this.model = val.target ? val.target.value : val
    },
    setNumberByOffset (offset = 0) {
      let val = parseFloat(this.value)
      val = isNaN(val)
        ? (exists(this.min) ? this.min : 0)
        : val + offset

      if (exists(this.min) && val < this.min) {
        val = this.min
      }
      else if (exists(this.max) && val > this.max) {
        val = this.max
      }

      this.model = parseFloat(val).toFixed(this.maxDecimals)
    },
    focus () {
      if (this.editable || this.isDropdown) {
        this.$refs.input.focus()
      }
    },
    blur () {
      if (this.editable || this.isDropdown) {
        this.$refs.input.blur()
      }
    },
    clear () {
      if (this.editable) {
        this.model = null
      }
    },
    togglePassVisibility () {
      this.showPass = !this.showPass
    },
    __focus (e) {
      this.focused = true
      this.$emit('focus')
    },
    __blur (e) {
      this.focused = false
      this.$emit('blur')
    },
    __keydown (e) {
      this.$emit('keydown', e)
    },
    __keyup (e) {
      this.$emit('keyup', e)
    },
    __click (e) {
      this.focus()
      this.$emit('click', e)
    },
    __notify (type, value) {
      if (!this.hasField) {
        return
      }

      this.$nextTick(() => {
        if (type === 'error') {
          this.__setFieldError(value !== false && this.hasError)
        }
        else if (type === 'focus') {
          this.__setFieldFocus(this.focused)
        }
        else if (type === 'count') {
          this.__setFieldCounter(!this.count ? false : this.counterLabel, this.hasCountError)
        }
        else if (type === 'floating') {
          this.__setFieldFloating(value)
        }
      })
    },
    __mousedown (e) {
      if (!this.editable) {
        e.preventDefault()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.__notify('count')
      if (this.autofocus) {
        this.focus()
      }
    })
  },
  beforeDestroy () {
    this.__notify('count')
    this.__notify('floating', false)
    this.__notify('error', false)
  }
}
</script>
