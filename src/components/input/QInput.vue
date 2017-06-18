<template>
  <q-input-frame
    class="q-input"

    :prefix="prefix"
    :suffix="suffix"
    :stack-label="stackLabel"
    :float-label="floatLabel"
    :error="error"
    :disable="disable"
    :inverted="inverted"
    :dark="dark"
    :before="before"
    :after="after"
    :color="color"

    :focused="focused"
    :length="length"
    :top-addons="isTextarea"

    @click="__onClick"
    v-ripple.mat="inverted"
  >
    <slot name="before"></slot>

    <template v-if="isTextarea">
      <div class="col row relative-position">
        <q-resize-observable @resize="__updateArea()"></q-resize-observable>
        <textarea
          class="col q-input-target q-input-shadow absolute-top"
          ref="shadow"
          :value="value"
          :rows="minRows"
        ></textarea>

        <textarea
          ref="input"
          class="col q-input-target q-input-area"

          :name="name"
          :placeholder="inputPlaceholder"
          :disabled="disable"
          :maxlength="maxLength"
          :rows="minRows"

          :value="value"
          @input="__set"

          @focus="__onFocus"
          @blur="__onBlur"
          @keydown="__onKeydown"
          @keyup="__onKeyup"
        ></textarea>
      </div>
    </template>

    <input
      v-else
      ref="input"
      class="col q-input-target"
      :class="[`text-${align}`]"

      :name="name"
      :placeholder="inputPlaceholder"
      :pattern="pattern"
      :disabled="disable"
      :maxlength="maxLength"

      :min="min"
      :max="max"
      :step="inputStep"

      :type="inputType"
      :value="value"
      @input="__set"

      @focus="__onFocus"
      @blur="__onBlur"
      @keydown="__onKeydown"
      @keyup="__onKeyup"
    />

    <q-icon
      v-if="isPassword && length"
      slot="after"
      :name="showPass ? 'visibility' : 'visibility_off'"
      class="q-if-control"
      @click="togglePass"
    ></q-icon>

    <q-icon
      v-if="clearable && length"
      slot="after"
      name="cancel"
      class="q-if-control"
      @click="clear"
    ></q-icon>

    <q-spinner
      v-if="isLoading"
      slot="after"
      size="24px"
      class="q-if-control"
    ></q-spinner>

    <slot name="after"></slot>
    <slot></slot>
  </q-input-frame>
</template>

<script>
import FrameMixin from '../input-frame/input-frame-mixin'
import InputMixin from '../input/input-mixin'
import inputTypes from './input-types'
import { frameDebounce } from '../../utils/debounce'
import { between } from '../../utils/format'
import { QInputFrame } from '../input-frame'
import { QResizeObservable } from '../observables'
import { QSpinner } from '../spinner'
import Ripple from '../../directives/ripple'

export default {
  name: 'q-input',
  mixins: [FrameMixin, InputMixin],
  components: {
    QInputFrame,
    QSpinner,
    QResizeObservable
  },
  directives: {
    Ripple
  },
  props: {
    value: { required: true },
    type: {
      type: String,
      default: 'text',
      validator: t => inputTypes.includes(t)
    },
    minRows: Number,
    clearable: Boolean,

    min: Number,
    max: Number,
    step: {
      type: Number,
      default: 1
    },
    maxDecimals: Number
  },
  data () {
    return {
      focused: false,
      showPass: false,
      shadow: {
        val: this.value,
        set: this.__set,
        loading: false,
        hasFocus: () => {
          return document.activeElement === this.$refs.input
        },
        register: () => {
          this.watcher = this.$watch('value', val => {
            this.shadow.val = val
          })
        },
        unregister: () => {
          this.watcher()
        },
        getEl: () => {
          return this.$refs.input
        }
      }
    }
  },
  provide () {
    return {
      __input: this.shadow
    }
  },
  computed: {
    isNumber () {
      return this.type === 'number'
    },
    isPassword () {
      return this.type === 'password'
    },
    isTextarea () {
      return this.type === 'textarea'
    },
    isLoading () {
      return this.loading || this.shadow.loading
    },
    pattern () {
      if (this.isNumber) {
        return '[0-9]*'
      }
    },
    inputStep () {
      if (this.isNumber) {
        return this.step
      }
    },
    inputType () {
      return this.isPassword
        ? (this.showPass ? 'text' : 'password')
        : this.type
    },
    length () {
      return this.value
        ? ('' + this.value).length
        : 0
    }
  },
  methods: {
    togglePass () {
      this.showPass = !this.showPass
    },
    clear () {
      if (!this.disable) {
        this.$emit('input', '')
        this.$emit('change', '')
      }
    },

    __set (e) {
      let val = e.target ? e.target.value : e
      if (val !== this.value) {
        if (this.isNumber) {
          if (val === '') {
            val = null
          }
          else {
            val = Number.isInteger(this.maxDecimals)
              ? parseFloat(val).toFixed(this.maxDecimals)
              : parseFloat(val)
          }
        }
        this.$emit('input', val)
        this.$emit('change', val)
      }
    },
    __updateArea () {
      const shadow = this.$refs.shadow
      if (shadow) {
        let h = shadow.scrollHeight
        const max = this.maxHeight || h
        this.$refs.input.style.minHeight = `${between(h, 19, max)}px`
      }
    }
  },
  mounted () {
    this.__updateArea = frameDebounce(this.__updateArea)
    if (this.isTextarea) {
      this.__updateArea()
      this.watcher = this.$watch('value', this.__updateArea)
    }
  },
  beforeDestroy () {
    if (this.watcher !== void 0) {
      this.watcher()
    }
  }
}
</script>
