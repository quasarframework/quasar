import { h, computed, getCurrentInstance } from 'vue'

import QRadio from '../radio/QRadio.js'
import QCheckbox from '../checkbox/QCheckbox.js'
import QToggle from '../toggle/QToggle.js'

import { createComponent } from '../../utils/private.create/create.js'

import useDark, { useDarkProps } from '../../composables/private.use-dark/use-dark.js'
import { isObject } from '../../utils/is/is.js'

const components = {
  radio: QRadio,
  checkbox: QCheckbox,
  toggle: QToggle
}

const typeValues = Object.keys(components)

function getPropValueFn (userPropName, defaultPropName) {
  if (typeof userPropName === 'function') return userPropName

  const propName = userPropName !== void 0
    ? userPropName
    : defaultPropName

  return opt => opt[ propName ]
}

export default createComponent({
  name: 'QOptionGroup',

  props: {
    ...useDarkProps,

    modelValue: {
      required: true
    },
    options: {
      type: Array,
      validator: opts => opts.every(isObject),
      default: () => []
    },

    optionValue: [ Function, String ],
    optionLabel: [ Function, String ],
    optionDisable: [ Function, String ],

    name: String,

    type: {
      type: String,
      default: 'radio',
      validator: v => typeValues.includes(v)
    },

    color: String,
    keepColor: Boolean,
    dense: Boolean,

    size: String,

    leftLabel: Boolean,
    inline: Boolean,
    disable: Boolean
  },

  emits: [ 'update:modelValue' ],

  setup (props, { emit, slots }) {
    const { proxy: { $q } } = getCurrentInstance()

    const arrayModel = Array.isArray(props.modelValue)

    if (props.type === 'radio') {
      if (arrayModel === true) {
        console.error('q-option-group: model should not be array')
      }
    }
    else if (arrayModel === false) {
      console.error('q-option-group: model should be array in your case')
    }

    const isDark = useDark(props, $q)
    const component = computed(() => components[ props.type ])

    const getOptionValue = computed(() => getPropValueFn(props.optionValue, 'value'))
    const getOptionLabel = computed(() => getPropValueFn(props.optionLabel, 'label'))
    const getOptionDisable = computed(() => getPropValueFn(props.optionDisable, 'disable'))

    const innerOptions = computed(() => props.options.map(opt => ({
      val: getOptionValue.value(opt),
      name: opt.name === void 0 ? props.name : opt.name,
      disable: props.disable || getOptionDisable.value(opt),
      leftLabel: opt.leftLabel === void 0 ? props.leftLabel : opt.leftLabel,
      color: opt.color === void 0 ? props.color : opt.color,
      checkedIcon: opt.checkedIcon,
      uncheckedIcon: opt.uncheckedIcon,
      dark: opt.dark === void 0 ? isDark.value : opt.dark,
      size: opt.size === void 0 ? props.size : opt.size,
      dense: props.dense,
      keepColor: opt.keepColor === void 0 ? props.keepColor : opt.keepColor
    })))

    const classes = computed(() =>
      'q-option-group q-gutter-x-sm'
      + (props.inline === true ? ' q-option-group--inline' : '')
    )

    const attrs = computed(() => {
      const attrs = { role: 'group' }

      if (props.type === 'radio') {
        attrs.role = 'radiogroup'

        if (props.disable === true) {
          attrs[ 'aria-disabled' ] = 'true'
        }
      }

      return attrs
    })

    function onUpdateModelValue (value) {
      emit('update:modelValue', value)
    }

    return () => h('div', {
      class: classes.value,
      ...attrs.value
    }, props.options.map((opt, i) => {
      // TODO: (Qv3) Make the 'opt' a separate property instead of
      // the whole scope for consistency and flexibility
      // (e.g. { opt } instead of opt)
      const child = slots[ 'label-' + i ] !== void 0
        ? () => slots[ 'label-' + i ](opt)
        : (
            slots.label !== void 0
              ? () => slots.label(opt)
              : void 0
          )

      return h('div', [
        h(component.value, {
          label: child === void 0 ? getOptionLabel.value(opt) : null,
          modelValue: props.modelValue,
          'onUpdate:modelValue': onUpdateModelValue,
          ...innerOptions.value[ i ]
        }, child)
      ])
    }))
  }
})
