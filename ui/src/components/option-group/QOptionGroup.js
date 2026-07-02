import { computed, getCurrentInstance, h } from 'vue'

import QRadio from '../radio/QRadio.js'
import QCheckbox from '../checkbox/QCheckbox.js'
import QToggle from '../toggle/QToggle.js'

import { createComponent } from '../../utils/private.create/create.js'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import { isObject } from '../../utils/is/is.js'

const components = {
  radio: QRadio,
  checkbox: QCheckbox,
  toggle: QToggle
}

const typeValues = Object.keys(components)

function getPropValueFn(userPropName, defaultPropName) {
  if (typeof userPropName === 'function') return userPropName

  const propName = userPropName !== void 0 ? userPropName : defaultPropName

  return opt => opt[propName]
}

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/option-group
 */
/**
 * Generic slot for all labels
 *
 * @api slot label
 * @scope ...self {Object} The corresponding option entry from the 'options' prop
 */

/**
 * Slot to define the specific label for the option at '[name]' where name is a 0-based index; Overrides the generic 'label' slot if used
 *
 * @api slot label-[name]
 * @scope ...self {Object} The corresponding option entry from the 'options' prop
 */
export default createComponent({
  name: 'QOptionGroup',

  props: {
    ...useDarkProps,

    /**
     * @api prop model-value
     * @extends model-value
     * @syncable
     * @example # v-model="group"
     */
    modelValue: {
      required: true
    },
    /**
     * Array of objects that the binary components will be created from. For best performance reference a variable in your scope. Canonical form of each object is with 'label' (String), 'value' (Any) and optional 'disable' (Boolean) props (can be customized with options-value/option-label/option-disable props) along with any other props from QToggle, QCheckbox, or QRadio.
     *
     * @api prop options
     * @type {Array}
     * @default []
     * @category options
     * @example [{ label: 'Option 1', value: 'op1' }, { label: 'Option 2', value: 'op2' }, { label: 'Option 3', value: 'op3', disable: true }]
     */
    options: {
      /**
       * The type of input component to be used
       *
       * @api prop type
       * @type {String}
       * @default 'radio'
       * @category content
       */
      type: Array,
      validator: opts => opts.every(isObject),
      default: () => []
    },

    /**
     * Property of option which holds the 'value'; If using a function then for best performance, reference it from your scope and do not define it inline
     *
     * @api prop option-value
     * @type {Function|String}
     * @default 'value'
     * @category options
     * @added-in v2.17
     * @example 'modelNumber'
     * @example item => (item === null ? null : item.modelNumber)
     */
    optionValue: [Function, String],
    /**
     * Property of option which holds the 'label'; If using a function then for best performance, reference it from your scope and do not define it inline
     *
     * @api prop option-label
     * @type {Function|String}
     * @default 'label'
     * @category options
     * @added-in v2.17
     * @example 'itemName'
     * @example item => (item === null ? 'Null value' : item.itemName)
     */
    optionLabel: [Function, String],
    /**
     * Property of option which tells it's disabled; The value of the property must be a Boolean; If using a function then for best performance, reference it from your scope and do not define it inline
     *
     * @api prop option-disable
     * @type {Function|String}
     * @default 'disable'
     * @category options
     * @added-in v2.17
     * @example item => (item === null ? true : item.cannotSelect)
     * @example # option-disable="cannotSelect"
     */
    optionDisable: [Function, String],

    /**
     * Used to specify the name of the controls; Useful if dealing with forms submitted directly to a URL
     *
     * @api prop name
     * @type {String}
     * @category behavior
     * @example 'car_id'
     */
    name: String,

    type: {
      type: String,
      default: 'radio',
      validator: v => typeValues.includes(v)
    },

    /**
     * @api prop color
     * @extends color
     */
    color: String,
    /**
     * Should the color (if specified any) be kept when input components are unticked?
     *
     * @api prop keep-color
     * @type {Boolean}
     * @category behavior
     */
    keepColor: Boolean,
    /**
     * @api prop dense
     * @extends dense
     */
    dense: Boolean,

    size: String,

    /**
     * Label (if any specified) should be displayed on the left side of the input components
     *
     * @api prop left-label
     * @type {Boolean}
     * @category content
     */
    leftLabel: Boolean,
    /**
     * Show input components as inline-block rather than each having their own row
     *
     * @api prop inline
     * @type {Boolean}
     * @category content
     */
    inline: Boolean,
    /**
     * @api prop disable
     * @extends disable
     */
    disable: Boolean
  },

  emits: ['update:modelValue'],

  setup(props, { emit, slots }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()

    const arrayModel = Array.isArray(props.modelValue)

    if (props.type === 'radio') {
      if (arrayModel) {
        console.error('q-option-group: model should not be array')
      }
    } else if (!arrayModel) {
      console.error('q-option-group: model should be array in your case')
    }

    const isDark = useDark(props, $q)
    const component = computed(() => components[props.type])

    const getOptionValue = computed(() =>
      getPropValueFn(props.optionValue, 'value')
    )
    const getOptionLabel = computed(() =>
      getPropValueFn(props.optionLabel, 'label')
    )
    const getOptionDisable = computed(() =>
      getPropValueFn(props.optionDisable, 'disable')
    )

    const innerOptions = computed(() =>
      props.options.map(opt => ({
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
      }))
    )

    const classes = computed(
      () =>
        'q-option-group q-gutter-x-sm' +
        (props.inline ? ' q-option-group--inline' : '')
    )

    const attrs = computed(() => {
      const acc = { role: 'group' }

      if (props.type === 'radio') {
        acc.role = 'radiogroup'

        if (props.disable) {
          acc['aria-disabled'] = 'true'
        }
      }

      return acc
    })

    function onUpdateModelValue(value) {
      emit('update:modelValue', value)
    }

    return () =>
      h(
        'div',
        {
          class: classes.value,
          ...attrs.value
        },
        props.options.map((opt, i) => {
          // TODO: (Qv3) Make the 'opt' a separate property instead of
          // the whole scope for consistency and flexibility
          // (e.g. { opt } instead of opt)
          const child =
            slots['label-' + i] !== void 0
              ? () => slots['label-' + i](opt)
              : slots.label !== void 0
                ? () => slots.label(opt)
                : void 0

          return h('div', [
            h(
              component.value,
              {
                label: child === void 0 ? getOptionLabel.value(opt) : null,
                modelValue: props.modelValue,
                'onUpdate:modelValue': onUpdateModelValue,
                ...innerOptions.value[i]
              },
              child
            )
          ])
        })
      )
  }
})
