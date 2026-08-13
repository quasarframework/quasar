import { h } from 'vue'

import QIcon from '../icon/QIcon.js'

import Ripple from '../../directives/ripple/Ripple.js'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import {
  createSizeStyle,
  useSizeProps
} from '../../composables/private.use-size/use-size.js'

import { createComponent } from '../../utils/private.create/create.js'
import { stopAndPrevent } from '../../utils/event/event.js'
import { hDir, hMergeSlotSafely } from '../../utils/private.render/render.js'

function preventSpace(e) {
  if (e.keyCode === 32) stopAndPrevent(e)
}

export const defaultSizes = {
  xs: 8,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24
}

const getSizeStyle = /*#__PURE__*/ createSizeStyle(defaultSizes)

export default /*#__PURE__*/ createComponent({
  name: 'QChip',

  props: {
    ...useDarkProps,
    ...useSizeProps,

    dense: Boolean,

    icon: String,
    iconRight: String,
    iconRemove: String,
    iconSelected: String,
    label: [String, Number],

    color: String,
    textColor: String,

    modelValue: {
      type: Boolean,
      default: true
    },
    selected: {
      type: Boolean,
      default: null
    },

    square: Boolean,
    outline: Boolean,
    clickable: Boolean,
    removable: Boolean,

    removeAriaLabel: String,

    tabindex: [String, Number],
    disable: Boolean,

    ripple: {
      type: [Boolean, Object],
      default: true
    }
  },

  emits: ['update:modelValue', 'update:selected', 'remove', 'click'],

  setup(props, { slots, emit }) {
    const $q = useQuasar()

    const isDark = useDark(props, $q)

    function onKeyup(e) {
      if ([13, 32].includes(e.keyCode)) {
        onClick(e)
        stopAndPrevent(e)
      }
    }

    function onClick(e) {
      if (!props.disable) {
        emit('update:selected', !props.selected)
        emit('click', e)
      }
    }

    function onRemove(e) {
      if (e.keyCode === void 0 || [13, 32].includes(e.keyCode)) {
        stopAndPrevent(e)
        if (!props.disable) {
          emit('update:modelValue', false)
          emit('remove')
        }
      }
    }

    function getContent(clickable) {
      const child = []

      if (clickable) {
        child.push(h('div', { class: 'q-focus-helper' }))
      }

      if (props.selected || props.icon !== void 0) {
        child.push(
          h(QIcon, {
            class: 'q-chip__icon q-chip__icon--left',
            name: props.selected
              ? props.iconSelected || $q.iconSet.chip.selected
              : props.icon
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
        const removeData = {
          class: 'q-chip__icon q-chip__icon--remove cursor-pointer',
          name: props.iconRemove || $q.iconSet.chip.remove,
          role: 'button',
          'aria-hidden': 'false',
          'aria-label': props.removeAriaLabel || $q.lang.label.remove,
          onClick: onRemove,
          onKeydown: preventSpace,
          onKeyup: onRemove
        }

        if (props.disable) {
          removeData.tabindex = -1
          removeData['aria-disabled'] = 'true'
        } else {
          removeData.tabindex = props.tabindex || 0
        }

        child.push(h(QIcon, removeData))
      }

      return child
    }

    return () => {
      if (!props.modelValue) return

      const actionable = props.clickable || props.selected !== null
      const clickable = !props.disable && actionable

      const text = props.outline
        ? props.color || props.textColor
        : props.textColor

      const data = {
        class:
          'q-chip row inline no-wrap items-center' +
          (!props.outline && props.color !== void 0
            ? ` bg-${props.color}`
            : '') +
          (text ? ` text-${text} q-chip--colored` : '') +
          (props.disable ? ' disabled' : '') +
          (props.dense ? ' q-chip--dense' : '') +
          (props.outline ? ' q-chip--outline' : '') +
          (props.selected ? ' q-chip--selected' : '') +
          (clickable
            ? ' q-chip--clickable cursor-pointer non-selectable q-hoverable'
            : '') +
          (props.square ? ' q-chip--square' : '') +
          (isDark() ? ' q-chip--dark q-dark' : '')
      }

      if (props.size !== void 0) {
        data.style = getSizeStyle(props.size)
      }

      if (actionable) {
        // a disabled actionable chip keeps its role (perceivable,
        // announced as dimmed) but leaves the tab order
        data.role = 'button'

        if (props.disable) {
          data.tabindex = -1
          data['aria-disabled'] = 'true'
        } else {
          data.tabindex = props.tabindex || 0

          // aria-pressed only for actual toggle chips —
          // plain action chips must not announce as (unpressed) toggles
          if (props.selected !== null) {
            data['aria-pressed'] = props.selected ? 'true' : 'false'
          }
        }
      }

      if (clickable) {
        data.onClick = onClick
        data.onKeydown = preventSpace
        data.onKeyup = onKeyup
      }

      return hDir(
        'div',
        data,
        getContent(clickable),
        'ripple',
        props.ripple !== false && !props.disable,
        () => [[Ripple, props.ripple]]
      )
    }
  }
})
