import { h, ref, computed, getCurrentInstance } from 'vue'

import useDark, { useDarkProps } from '../../composables/private/use-dark.js'
import useSize, { useSizeProps } from '../../composables/private/use-size.js'
import useRefocusTarget from '../../composables/private/use-refocus-target.js'
import { useFormInject, useFormProps } from '../../composables/private/use-form.js'

import optionSizes from '../../utils/private/option-sizes.js'
import { stopAndPrevent } from '../../utils/event.js'
import { hSlot, hMergeSlot } from '../../utils/private/render.js'

export const useCheckboxProps = {
  ...useDarkProps,
  ...useSizeProps,
  ...useFormProps,

  modelValue: {
    required: true,
    default: null
  },
  val: {},

  trueValue: { default: true },
  falseValue: { default: false },
  indeterminateValue: { default: null },

  toggleOrder: {
    type: String,
    validator: v => v === 'tf' || v === 'ft'
  },
  toggleIndeterminate: Boolean,

  label: String,
  leftLabel: Boolean,

  color: String,
  keepColor: Boolean,
  dense: Boolean,

  disable: Boolean,
  tabindex: [ String, Number ]
}

export const useCheckboxEmits = [ 'update:modelValue' ]

export default function (type, getInner) {
  const { props, slots, emit, proxy } = getCurrentInstance()
  const { $q } = proxy

  const isDark = useDark(props, $q)

  const rootRef = ref(null)
  const { refocusTargetEl, refocusTarget } = useRefocusTarget(props, rootRef)
  const sizeStyle = useSize(props, optionSizes)

  const modelIsArray = computed(() =>
    props.val !== void 0 && Array.isArray(props.modelValue)
  )

  const index = computed(() => (
    modelIsArray.value === true
      ? props.modelValue.indexOf(props.val)
      : -1
  ))

  const isTrue = computed(() => (
    modelIsArray.value === true
      ? index.value > -1
      : props.modelValue === props.trueValue
  ))

  const isFalse = computed(() => (
    modelIsArray.value === true
      ? index.value === -1
      : props.modelValue === props.falseValue
  ))

  const isIndeterminate = computed(() =>
    isTrue.value === false && isFalse.value === false
  )

  const tabindex = computed(() => (
    props.disable === true ? -1 : props.tabindex || 0
  ))

  const classes = computed(() =>
    `q-${ type } cursor-pointer no-outline row inline no-wrap items-center`
    + (props.disable === true ? ' disabled' : '')
    + (isDark.value === true ? ` q-${ type }--dark` : '')
    + (props.dense === true ? ` q-${ type }--dense` : '')
    + (props.leftLabel === true ? ' reverse' : '')
  )

  const innerClass = computed(() => {
    const state = isTrue.value === true ? 'truthy' : (isFalse.value === true ? 'falsy' : 'indet')
    const color = props.color !== void 0 && (
      props.keepColor === true
      || (type === 'toggle' ? isTrue.value === true : isFalse.value !== true)
    )
      ? ` text-${ props.color }`
      : ''

    return `q-${ type }__inner relative-position non-selectable q-${ type }__inner--${ state }${ color }`
  })

  const formAttrs = computed(() => {
    const prop = { type: 'checkbox' }

    props.name !== void 0 && Object.assign(prop, {
      checked: isTrue.value,
      name: props.name,
      value: modelIsArray.value === true
        ? props.val
        : props.trueValue
    })

    return prop
  })

  const injectFormInput = useFormInject(formAttrs)

  const attributes = computed(() => {
    const attrs = {
      tabindex: tabindex.value,
      role: 'checkbox',
      'aria-label': props.label,
      'aria-checked': isIndeterminate.value === true
        ? 'mixed'
        : (isTrue.value === true ? 'true' : 'false')
    }

    if (props.disable === true) {
      attrs[ 'aria-disabled' ] = 'true'
    }

    return attrs
  })

  function onClick (e) {
    if (e !== void 0) {
      stopAndPrevent(e)
      refocusTarget(e)
    }

    if (props.disable !== true) {
      emit('update:modelValue', getNextValue(), e)
    }
  }

  function getNextValue () {
    if (modelIsArray.value === true) {
      if (isTrue.value === true) {
        const val = props.modelValue.slice()
        val.splice(index.value, 1)
        return val
      }

      return props.modelValue.concat([ props.val ])
    }

    if (isTrue.value === true) {
      if (props.toggleOrder !== 'ft' || props.toggleIndeterminate === false) {
        return props.falseValue
      }
    }
    else if (isFalse.value === true) {
      if (props.toggleOrder === 'ft' || props.toggleIndeterminate === false) {
        return props.trueValue
      }
    }
    else {
      return props.toggleOrder !== 'ft'
        ? props.trueValue
        : props.falseValue
    }

    return props.indeterminateValue
  }

  function onKeydown (e) {
    if (e.keyCode === 13 || e.keyCode === 32) {
      stopAndPrevent(e)
    }
  }

  function onKeyup (e) {
    if (e.keyCode === 13 || e.keyCode === 32) {
      onClick(e)
    }
  }

  const getInnerContent = getInner(isTrue, isIndeterminate)

  // expose public methods
  Object.assign(proxy, { toggle: onClick })

  return () => {
    const inner = getInnerContent()

    props.disable !== true && injectFormInput(
      inner,
      'unshift',
      ` q-${ type }__native absolute q-ma-none q-pa-none`
    )

    const child = [
      h('div', {
        class: innerClass.value,
        style: sizeStyle.value
      }, inner)
    ]

    if (refocusTargetEl.value !== null) {
      child.push(refocusTargetEl.value)
    }

    const label = props.label !== void 0
      ? hMergeSlot(slots.default, [ props.label ])
      : hSlot(slots.default)

    label !== void 0 && child.push(
      h('div', {
        class: `q-${ type }__label q-anchor--skip`
      }, label)
    )

    return h('div', {
      ref: rootRef,
      class: classes.value,
      ...attributes.value,
      onClick,
      onKeydown,
      onKeyup
    }, child)
  }
}
