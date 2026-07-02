import { computed, getCurrentInstance, h } from 'vue'

import QIcon from '../icon/QIcon.js'

import Ripple from '../../directives/ripple/Ripple.js'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import useSize, {
  useSizeProps
} from '../../composables/private.use-size/use-size.js'

import { createComponent } from '../../utils/private.create/create.js'
import { stopAndPrevent } from '../../utils/event/event.js'
import { hDir, hMergeSlotSafely } from '../../utils/private.render/render.js'

export const defaultSizes = {
  xs: 8,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24
}

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/chip
 */
/**
 * This is where QChip content goes, if not using 'label' property
 *
 * @api slot default
 */
export default createComponent({
  name: 'QChip',

  props: {
    ...useDarkProps,
    ...useSizeProps,

    /**
     * @api prop dense
     * @extends dense
     */
    dense: Boolean,

    /**
     * @api prop icon
     * @extends icon
     */
    icon: String,
    /**
     * @api prop icon-right
     * @extends icon
     */
    iconRight: String,
    /**
     * @api prop icon-remove
     * @extends icon
     */
    iconRemove: String,
    /**
     * @api prop icon-selected
     * @extends icon
     */
    iconSelected: String,
    /**
     * Chip's content as string; overrides default slot if specified
     *
     * @api prop label
     * @type {String|Number}
     * @category content
     * @example 'John Doe'
     * @example 'Book'
     */
    label: [String, Number],

    /**
     * @api prop color
     * @extends color
     */
    color: String,
    /**
     * @api prop text-color
     * @extends text-color
     */
    textColor: String,

    /**
     * Model of the component determining if QChip should be rendered or not
     *
     * @api prop model-value
     * @extends model-value
     * @default true
     * @syncable
     */
    modelValue: {
      type: Boolean,
      default: true
    },
    /**
     * Model for QChip if it's selected or not
     *
     * @api prop selected
     * @type {Boolean|null}
     * @default null
     * @category model
     * @example # v-model:selected="myState"
     */
    selected: {
      type: Boolean,
      default: null
    },

    /**
     * Sets a low value for border-radius instead of the default one, making it close to a square
     *
     * @api prop square
     * @extends square
     */
    square: Boolean,
    /**
     * Display using the 'outline' design
     *
     * @api prop outline
     * @type {Boolean}
     * @category style
     */
    outline: Boolean,
    /**
     * Is QChip clickable? If it's the case, then it will add hover effects and emit 'click' events
     *
     * @api prop clickable
     * @type {Boolean}
     * @category state
     */
    clickable: Boolean,
    /**
     * If set, then it displays a 'remove' icon that when clicked the QChip emits 'remove' event
     *
     * @api prop removable
     * @type {Boolean}
     * @category state
     */
    removable: Boolean,

    /**
     * aria-label to be used on the remove icon
     *
     * @api prop remove-aria-label
     * @type {String}
     * @category accessibility
     * @added-in v2.8.4
     * @example 'Remove item'
     */
    removeAriaLabel: String,

    /**
     * @api prop tabindex
     * @extends tabindex
     */
    tabindex: [String, Number],
    /**
     * @api prop disable
     * @extends disable
     */
    disable: Boolean,

    /**
     * @api prop ripple
     * @extends ripple
     */
    ripple: {
      type: [Boolean, Object],
      default: true
    }
  },

  emits: ['update:modelValue', 'update:selected', 'remove', 'click'],

  setup(props, { slots, emit }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()

    const isDark = useDark(props, $q)
    const sizeStyle = useSize(props, defaultSizes)

    const hasLeftIcon = computed(() => props.selected || props.icon !== void 0)

    const leftIcon = computed(() =>
      props.selected
        ? props.iconSelected || $q.iconSet.chip.selected
        : props.icon
    )

    const removeIcon = computed(
      () => props.iconRemove || $q.iconSet.chip.remove
    )

    const isClickable = computed(
      () => !props.disable && (props.clickable || props.selected !== null)
    )

    const classes = computed(() => {
      const text = props.outline
        ? props.color || props.textColor
        : props.textColor

      return (
        'q-chip row inline no-wrap items-center' +
        (!props.outline && props.color !== void 0 ? ` bg-${props.color}` : '') +
        (text ? ` text-${text} q-chip--colored` : '') +
        (props.disable ? ' disabled' : '') +
        (props.dense ? ' q-chip--dense' : '') +
        (props.outline ? ' q-chip--outline' : '') +
        (props.selected ? ' q-chip--selected' : '') +
        (isClickable.value
          ? ' q-chip--clickable cursor-pointer non-selectable q-hoverable'
          : '') +
        (props.square ? ' q-chip--square' : '') +
        (isDark.value ? ' q-chip--dark q-dark' : '')
      )
    })

    const attributes = computed(() => {
      const chip = props.disable
        ? { tabindex: -1, 'aria-disabled': 'true' }
        : { tabindex: props.tabindex || 0 }

      const remove = {
        ...chip,
        role: 'button',
        'aria-hidden': 'false',
        'aria-label': props.removeAriaLabel || $q.lang.label.remove
      }

      return { chip, remove }
    })

    function onKeyup(e) {
      if (e.keyCode === 13 /* ENTER */) onClick(e)
    }

    function onClick(e) {
      if (!props.disable) {
        emit('update:selected', !props.selected)
        emit('click', e)
      }
    }

    function onRemove(e) {
      if (e.keyCode === void 0 || e.keyCode === 13) {
        stopAndPrevent(e)
        if (!props.disable) {
          emit('update:modelValue', false)
          emit('remove')
        }
      }
    }

    function getContent() {
      const child = []

      if (isClickable.value) {
        child.push(h('div', { class: 'q-focus-helper' }))
      }

      if (hasLeftIcon.value) {
        child.push(
          h(QIcon, {
            class: 'q-chip__icon q-chip__icon--left',
            name: leftIcon.value
          })
        )
      }

      const label =
        props.label !== void 0
          ? [h('div', { class: 'ellipsis' }, [props.label])]
          : void 0

      child.push(
        h(
          'div',
          {
            class: 'q-chip__content col row no-wrap items-center q-anchor--skip'
          },
          hMergeSlotSafely(slots.default, label)
        )
      )

      if (props.iconRight) {
        child.push(
          h(QIcon, {
            class: 'q-chip__icon q-chip__icon--right',
            name: props.iconRight
          })
        )
      }

      if (props.removable) {
        child.push(
          h(QIcon, {
            class: 'q-chip__icon q-chip__icon--remove cursor-pointer',
            name: removeIcon.value,
            ...attributes.value.remove,
            onClick: onRemove,
            onKeyup: onRemove
          })
        )
      }

      return child
    }

    return () => {
      if (!props.modelValue) return

      const data = {
        class: classes.value,
        style: sizeStyle.value
      }

      if (isClickable.value) {
        Object.assign(data, attributes.value.chip, { onClick, onKeyup })
      }

      return hDir(
        'div',
        data,
        getContent(),
        'ripple',
        props.ripple !== false && !props.disable,
        () => [[Ripple, props.ripple]]
      )
    }
  }
})
