import { h, defineComponent } from 'vue'

import QBtn from '../btn/QBtn.js'
import QBtnGroup from '../btn-group/QBtnGroup.js'

import FormMixin from '../../mixins/form.js'

import { hMergeSlot } from '../../utils/render.js'

export default defineComponent({
  name: 'QBtnToggle',

  mixins: [ FormMixin ],

  props: {
    modelValue: {
      required: true
    },

    options: {
      type: Array,
      required: true,
      validator: v => v.every(
        opt => ('label' in opt || 'icon' in opt || 'slot' in opt) && 'value' in opt
      )
    },

    // To avoid seeing the active raise shadow through
    // the transparent button, give it a color (even white)
    color: String,
    textColor: String,
    toggleColor: {
      type: String,
      default: 'primary'
    },
    toggleTextColor: String,

    outline: Boolean,
    flat: Boolean,
    unelevated: Boolean,
    rounded: Boolean,
    push: Boolean,
    glossy: Boolean,

    size: String,
    padding: String,

    noCaps: Boolean,
    noWrap: Boolean,
    dense: Boolean,
    readonly: Boolean,
    disable: Boolean,

    stack: Boolean,
    stretch: Boolean,

    spread: Boolean,

    clearable: Boolean,

    ripple: {
      type: [ Boolean, Object ],
      default: true
    }
  },

  emits: [ 'update:modelValue', 'clear', 'click' ],

  computed: {
    hasActiveValue () {
      return this.options.find(opt => opt.value === this.modelValue) !== void 0
    },

    formAttrs () {
      return {
        type: 'hidden',
        name: this.name,
        value: this.modelValue
      }
    },

    btnOptions () {
      return this.options.map((item, i) => {
        const { attrs, value, slot, ...opt } = item

        return {
          slot,
          props: {
            key: i,
            onClick: e => this.__set(value, item, e),

            ...attrs,
            ...opt,

            outline: this.outline,
            flat: this.flat,
            rounded: this.rounded,
            push: this.push,
            unelevated: this.unelevated,
            dense: this.dense,

            disable: this.disable === true || opt.disable === true,

            // Options that come from the button specific options first, then from general props
            color: value === this.modelValue
              ? this.__mergeOpt(opt, 'toggleColor')
              : this.__mergeOpt(opt, 'color'),
            textColor: value === this.modelValue
              ? this.__mergeOpt(opt, 'toggleTextColor')
              : this.__mergeOpt(opt, 'textColor'),
            noCaps: this.__mergeOpt(opt, 'noCaps') === true,
            noWrap: this.__mergeOpt(opt, 'noWrap') === true,

            size: this.__mergeOpt(opt, 'size'),
            padding: this.__mergeOpt(opt, 'padding'),
            ripple: this.__mergeOpt(opt, 'ripple'),
            stack: this.__mergeOpt(opt, 'stack') === true,
            stretch: this.__mergeOpt(opt, 'stretch') === true
          }
        }
      })
    }
  },

  methods: {
    __set (value, opt, e) {
      if (this.readonly !== true) {
        if (this.modelValue === value) {
          if (this.clearable === true) {
            this.$emit('update:modelValue', null, null)
            this.$emit('clear')
          }
        }
        else {
          this.$emit('update:modelValue', value, opt)
        }

        this.$emit('click', e)
      }
    },

    __mergeOpt (opt, key) {
      return opt[ key ] === void 0 ? this[ key ] : opt[ key ]
    },

    __getContent () {
      const child = this.btnOptions.map(opt => {
        return h(QBtn, opt.props, opt.slot !== void 0 ? this.$slots[ opt.slot ] : void 0)
      })

      if (this.name !== void 0 && this.disable !== true && this.hasActiveValue === true) {
        this.__injectFormInput(child, 'push')
      }

      return hMergeSlot(this, 'default', child)
    }
  },

  render () {
    return h(QBtnGroup, {
      class: 'q-btn-toggle',
      outline: this.outline,
      flat: this.flat,
      rounded: this.rounded,
      push: this.push,
      stretch: this.stretch,
      unelevated: this.unelevated,
      glossy: this.glossy,
      spread: this.spread
    }, this.__getContent)
  }
})
