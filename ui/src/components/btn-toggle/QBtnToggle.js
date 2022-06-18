import { h, computed } from 'vue'

import QBtn from '../btn/QBtn.js'
import QBtnGroup from '../btn-group/QBtnGroup.js'

import { createComponent } from '../../utils/private/create.js'
import { useFormInject, useFormProps } from '../../composables/private/use-form.js'

import { hMergeSlot } from '../../utils/private/render.js'

export default createComponent({
  name: 'QBtnToggle',

  props: {
    ...useFormProps,

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

  setup (props, { slots, emit }) {
    const hasActiveValue = computed(() =>
      props.options.find(opt => opt.value === props.modelValue) !== void 0
    )

    const formAttrs = computed(() => ({
      type: 'hidden',
      name: props.name,
      value: props.modelValue
    }))

    const injectFormInput = useFormInject(formAttrs)

    const btnOptions = computed(() => props.options.map((item, i) => {
      const { attrs, value, slot, ...opt } = item

      return {
        slot,
        props: {
          key: i,
          onClick (e) { set(value, item, e) },

          'aria-pressed': value === props.modelValue ? 'true' : 'false',

          ...attrs,
          ...opt,

          outline: props.outline,
          flat: props.flat,
          rounded: props.rounded,
          push: props.push,
          unelevated: props.unelevated,
          dense: props.dense,

          disable: props.disable === true || opt.disable === true,

          // Options that come from the button specific options first, then from general props
          color: value === props.modelValue
            ? mergeOpt(opt, 'toggleColor')
            : mergeOpt(opt, 'color'),
          textColor: value === props.modelValue
            ? mergeOpt(opt, 'toggleTextColor')
            : mergeOpt(opt, 'textColor'),
          noCaps: mergeOpt(opt, 'noCaps') === true,
          noWrap: mergeOpt(opt, 'noWrap') === true,

          size: mergeOpt(opt, 'size'),
          padding: mergeOpt(opt, 'padding'),
          ripple: mergeOpt(opt, 'ripple'),
          stack: mergeOpt(opt, 'stack') === true,
          stretch: mergeOpt(opt, 'stretch') === true
        }
      }
    }))

    function set (value, opt, e) {
      if (props.readonly !== true) {
        if (props.modelValue === value) {
          if (props.clearable === true) {
            emit('update:modelValue', null, null)
            emit('clear')
          }
        }
        else {
          emit('update:modelValue', value, opt)
        }

        emit('click', e)
      }
    }

    function mergeOpt (opt, key) {
      return opt[ key ] === void 0 ? props[ key ] : opt[ key ]
    }

    function getContent () {
      const child = btnOptions.value.map(opt => {
        return h(QBtn, opt.props, opt.slot !== void 0 ? slots[ opt.slot ] : void 0)
      })

      if (props.name !== void 0 && props.disable !== true && hasActiveValue.value === true) {
        injectFormInput(child, 'push')
      }

      return hMergeSlot(slots.default, child)
    }

    return () => h(QBtnGroup, {
      class: 'q-btn-toggle',
      outline: props.outline,
      flat: props.flat,
      rounded: props.rounded,
      push: props.push,
      stretch: props.stretch,
      unelevated: props.unelevated,
      glossy: props.glossy,
      spread: props.spread
    }, getContent)
  }
})
