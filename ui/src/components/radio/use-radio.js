import { computed, ref, toRaw } from 'vue'

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

export const useRadioProps = {
  ...useDarkProps,
  ...useSizeProps,
  ...useFormProps,

  /**
   * Model of the component; Either use this property (along with a listener for 'update:model-value' event) OR use v-model directive
   *
   * @api prop model-value
   * @type {Any}
   * @category model
   * @required
   * @syncable
   * @example # v-model="option"
   */
  modelValue: { required: true },

  /**
   * The actual value of the option with which model value is changed
   *
   * @api prop val
   * @type {Any}
   * @category model
   * @required
   * @example 'opt1'
   * @example 50
   */
  val: { required: true },

  /**
   * Label to display along the radio control (or use the default slot instead of this prop)
   *
   * @api prop label
   * @type {String}
   * @category label
   * @example 'Option 1'
   */
  label: String,

  /**
   * Label (if any specified) should be displayed on the left side of the checkbox
   *
   * @api prop left-label
   * @type {Boolean}
   * @category label
   */
  leftLabel: Boolean,

  /**
   * The icon to be used when selected (instead of the default design)
   *
   * @api prop checked-icon
   * @type {String}
   * @category icons
   * @added-in v2.5
   * @example 'visibility'
   */
  checkedIcon: String,

  /**
   * The icon to be used when un-selected (instead of the default design)
   *
   * @api prop unchecked-icon
   * @type {String}
   * @category icons
   * @added-in v2.5
   * @example 'visibility_off'
   */
  uncheckedIcon: String,

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
   * Should the color (if specified any) be kept when checkbox is unticked?
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

export const useRadioEmits = ['update:modelValue']

export default function useRadio(props, proxy, emit) {
  const isDark = useDark(props, proxy.$q)
  const sizeStyle = useSize(props, optionSizes)

  const rootRef = ref(null)
  const { refocusTargetEl, refocusTarget } = useRefocusTarget(props, rootRef)

  const isTrue = computed(() => toRaw(props.modelValue) === toRaw(props.val))

  const classes = computed(
    () =>
      'q-radio cursor-pointer no-outline row inline no-wrap items-center' +
      (props.disable ? ' disabled' : '') +
      (isDark.value ? ' q-radio--dark' : '') +
      (props.dense ? ' q-radio--dense' : '') +
      (props.leftLabel ? ' reverse' : '')
  )

  const innerClass = computed(() => {
    const color =
      props.color !== void 0 && (props.keepColor || isTrue.value)
        ? ` text-${props.color}`
        : ''

    return (
      'q-radio__inner relative-position ' +
      `q-radio__inner--${isTrue.value ? 'truthy' : 'falsy'}${color}`
    )
  })

  const icon = computed(
    () => (isTrue.value ? props.checkedIcon : props.uncheckedIcon) || null
  )

  const tabindex = computed(() => (props.disable ? -1 : props.tabindex || 0))

  const formAttrs = computed(() => {
    const prop = { type: 'radio' }

    if (props.name !== void 0) {
      Object.assign(prop, {
        // see https://vuejs.org/guide/extras/render-function.html#creating-vnodes (.prop)
        '.checked': isTrue.value,
        '^checked': isTrue.value ? 'checked' : void 0,
        name: props.name,
        value: props.val
      })
    }

    return prop
  })

  const injectFormInput = useFormInject(formAttrs)

  function onClick(e) {
    if (e !== void 0) {
      stopAndPrevent(e)
      refocusTarget(e)
    }

    if (!props.disable && !isTrue.value) {
      emit('update:modelValue', props.val, e)
    }
  }

  function onKeyup(e) {
    if (e.keyCode === 13 || e.keyCode === 32) {
      onClick(e)
    }
  }

  return {
    classes,
    icon,
    injectFormInput,
    innerClass,
    isTrue,
    onClick,
    onKeyup,
    refocusTargetEl,
    rootRef,
    sizeStyle,
    tabindex
  }
}
