import { computed, getCurrentInstance, h, ref, toRaw } from 'vue'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import useSize, {
  useSizeProps
} from '../../composables/private.use-size/use-size.js'
import useRefocusTarget from '../../composables/private.use-refocus-target/use-refocus-target.js'
import {
  useFormInject,
  useFormProps
} from '../../composables/use-form/private.use-form.js'

import optionSizes from '../../utils/private.option-sizes/option-sizes.js'
import { stopAndPrevent } from '../../utils/event/event.js'
import { hMergeSlot, hSlot } from '../../utils/private.render/render.js'

export const useCheckboxProps = {
  ...useDarkProps,
  ...useSizeProps,
  ...useFormProps,

  /**
   * Model of the component; Either use this property (along with a listener for 'update:model-value' event) OR use v-model directive
   *
   * @api prop model-value
   * @type {Any|Array}
   * @default null
   * @category model
   * @required
   * @syncable
   * @example false
   * @example ['car', 'building']
   */
  modelValue: {
    required: true,
    default: null
  },

  /**
   * Works when model ('value') is Array. It tells the component which value should add/remove when ticked/unticked
   *
   * @api prop val
   * @type {Any}
   * @category model
   * @example 'car'
   */
  val: {},

  /**
   * What model value should be considered as checked/ticked/on?
   *
   * @api prop true-value
   * @type {Any}
   * @default true
   * @category model
   * @optional
   * @example 'Agreed'
   */
  trueValue: { default: true },

  /**
   * What model value should be considered as unchecked/unticked/off?
   *
   * @api prop false-value
   * @type {Any}
   * @default false
   * @category model
   * @optional
   * @example 'Disagree'
   */
  falseValue: { default: false },

  /**
   * What model value should be considered as 'indeterminate'?
   *
   * @api prop indeterminate-value
   * @type {Any}
   * @default null
   * @category model
   * @optional
   * @example 0
   * @example 'not_answered'
   */
  indeterminateValue: { default: null },

  /**
   * The icon to be used when the model is truthy (instead of the default design)
   *
   * @api prop checked-icon
   * @type {String}
   * @category icons
   * @added-in v2.5
   * @example 'visibility'
   */
  checkedIcon: String,

  /**
   * The icon to be used when the toggle is falsy (instead of the default design)
   *
   * @api prop unchecked-icon
   * @type {String}
   * @category icons
   * @added-in v2.5
   * @example 'visibility_off'
   */
  uncheckedIcon: String,

  /**
   * The icon to be used when the model is indeterminate (instead of the default design)
   *
   * @api prop indeterminate-icon
   * @type {String}
   * @category icons
   * @added-in v2.5
   * @example 'help'
   */
  indeterminateIcon: String,

  /**
   * Determines toggle order of the two states ('t' stands for state of true, 'f' for state of false); If 'toggle-indeterminate' is true, then the order is: indet -> first state -> second state -> indet (and repeat), otherwise: indet -> first state -> second state -> first state -> second state -> ...
   *
   * @api prop toggle-order
   * @type {String}
   * @category behavior
   * @value 'tf'
   * @value 'ft'
   */
  toggleOrder: {
    type: String,
    validator: v => v === 'tf' || v === 'ft'
  },

  /**
   * When user clicks/taps on the component, should we toggle through the indeterminate state too?
   *
   * @api prop toggle-indeterminate
   * @type {Boolean}
   * @category behavior
   */
  toggleIndeterminate: Boolean,

  /**
   * Label to display along the component (or use the default slot instead of this prop)
   *
   * @api prop label
   * @type {String}
   * @category label
   * @example 'I agree with the Terms and Conditions'
   */
  label: String,

  /**
   * Label (if any specified) should be displayed on the left side of the component
   *
   * @api prop left-label
   * @type {Boolean}
   * @category label
   */
  leftLabel: Boolean,

  /**
   * Color name for component from the Quasar Color Palette
   *
   * @api prop color
   * @type {String}
   * @ts-type NamedColor
   * @category style
   * @example 'primary'
   * @example 'teal'
   * @example 'teal-10'
   */
  color: String,

  /**
   * Should the color (if specified any) be kept when the component is unticked/ off?
   *
   * @api prop keep-color
   * @type {Boolean}
   * @category behavior
   */
  keepColor: Boolean,

  /**
   * Dense mode; occupies less space
   *
   * @api prop dense
   * @type {Boolean}
   * @category style
   */
  dense: Boolean,

  /**
   * Put component in disabled mode
   *
   * @api prop disable
   * @type {Boolean}
   * @category state
   */
  disable: Boolean,

  /**
   * Tabindex HTML attribute value
   *
   * @api prop tabindex
   * @type {String|Number}
   * @category general
   * @example 100
   * @example '0'
   */
  tabindex: [String, Number]
}

export const useCheckboxEmits = ['update:modelValue']

function onKeydown(e) {
  if (e.keyCode === 13 || e.keyCode === 32) {
    stopAndPrevent(e)
  }
}

export default function useCheckbox(type, getInner) {
  const { props, slots, emit, proxy } = getCurrentInstance()
  const { $q } = proxy

  const isDark = useDark(props, $q)

  const rootRef = ref(null)
  const { refocusTargetEl, refocusTarget } = useRefocusTarget(props, rootRef)
  const sizeStyle = useSize(props, optionSizes)

  const modelIsArray = computed(
    () => props.val !== void 0 && Array.isArray(props.modelValue)
  )

  const index = computed(() => {
    const val = toRaw(props.val)
    return modelIsArray.value
      ? props.modelValue.findIndex(opt => toRaw(opt) === val)
      : -1
  })

  const isTrue = computed(() =>
    modelIsArray.value
      ? index.value !== -1
      : toRaw(props.modelValue) === toRaw(props.trueValue)
  )

  const isFalse = computed(() =>
    modelIsArray.value
      ? index.value === -1
      : toRaw(props.modelValue) === toRaw(props.falseValue)
  )

  const isIndeterminate = computed(() => !isTrue.value && !isFalse.value)
  const tabindex = computed(() => (props.disable ? -1 : props.tabindex || 0))
  const classes = computed(
    () =>
      `q-${type} cursor-pointer no-outline row inline no-wrap items-center` +
      (props.disable ? ' disabled' : '') +
      (isDark.value ? ` q-${type}--dark` : '') +
      (props.dense ? ` q-${type}--dense` : '') +
      (props.leftLabel ? ' reverse' : '')
  )

  const innerClass = computed(() => {
    const state = isTrue.value ? 'truthy' : isFalse.value ? 'falsy' : 'indet'

    const color =
      props.color !== void 0 &&
      (props.keepColor || (type === 'toggle' ? isTrue.value : !isFalse.value))
        ? ` text-${props.color}`
        : ''

    return `q-${type}__inner relative-position non-selectable q-${type}__inner--${state}${color}`
  })

  const formAttrs = computed(() => {
    const prop = { type: 'checkbox' }

    if (props.name !== void 0) {
      Object.assign(prop, {
        // see https://vuejs.org/guide/extras/render-function.html#creating-vnodes (.prop)
        '.checked': isTrue.value,
        '^checked': isTrue.value ? 'checked' : void 0,
        name: props.name,
        value: modelIsArray.value ? props.val : props.trueValue
      })
    }

    return prop
  })

  const injectFormInput = useFormInject(formAttrs)

  const attributes = computed(() => {
    const attrs = {
      tabindex: tabindex.value,
      role: type === 'toggle' ? 'switch' : 'checkbox',
      'aria-label': props.label,
      'aria-checked': isIndeterminate.value
        ? 'mixed'
        : isTrue.value
          ? 'true'
          : 'false'
    }

    if (props.disable) {
      attrs['aria-disabled'] = 'true'
    }

    return attrs
  })

  function onClick(e) {
    if (e !== void 0) {
      stopAndPrevent(e)
      refocusTarget(e)
    }

    if (!props.disable) {
      emit('update:modelValue', getNextValue(), e)
    }
  }

  function getNextValue() {
    if (modelIsArray.value) {
      if (isTrue.value) {
        const val = [...props.modelValue]
        val.splice(index.value, 1)
        return val
      }

      return [...props.modelValue, props.val]
    }

    if (isTrue.value) {
      if (props.toggleOrder !== 'ft' || !props.toggleIndeterminate) {
        return props.falseValue
      }
    } else if (isFalse.value) {
      if (props.toggleOrder === 'ft' || !props.toggleIndeterminate) {
        return props.trueValue
      }
    } else {
      return props.toggleOrder !== 'ft' ? props.trueValue : props.falseValue
    }

    return props.indeterminateValue
  }

  function onKeyup(e) {
    if (e.keyCode === 13 || e.keyCode === 32) {
      onClick(e)
    }
  }

  const getInnerContent = getInner(isTrue, isIndeterminate)

  // expose public methods
  Object.assign(proxy, { toggle: onClick })

  return () => {
    const inner = getInnerContent()

    if (!props.disable) {
      injectFormInput(
        inner,
        'unshift',
        ` q-${type}__native absolute q-ma-none q-pa-none`
      )
    }

    const child = [
      h(
        'div',
        {
          class: innerClass.value,
          style: sizeStyle.value,
          'aria-hidden': 'true'
        },
        inner
      )
    ]

    if (refocusTargetEl.value !== null) {
      child.push(refocusTargetEl.value)
    }

    const label =
      props.label !== void 0
        ? hMergeSlot(slots.default, [props.label])
        : hSlot(slots.default)

    if (label !== void 0) {
      child.push(
        h(
          'div',
          {
            class: `q-${type}__label q-anchor--skip`
          },
          label
        )
      )
    }

    return h(
      'div',
      {
        ref: rootRef,
        class: classes.value,
        ...attributes.value,
        onClick,
        onKeydown,
        onKeyup
      },
      child
    )
  }
}
