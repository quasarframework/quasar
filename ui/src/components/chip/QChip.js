import { h, computed, getCurrentInstance } from 'vue'

import QIcon from '../icon/QIcon.js'

import Ripple from '../../directives/Ripple.js'

import useDark, { useDarkProps } from '../../composables/private/use-dark.js'
import useSize, { useSizeProps } from '../../composables/private/use-size.js'

import { createComponent } from '../../utils/private/create.js'
import { stopAndPrevent } from '../../utils/event.js'
import { hMergeSlotSafely, hDir } from '../../utils/private/render.js'

const defaultSizes = {
  xs: 8,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24
}

export default createComponent({
  name: 'QChip',

  props: {
    ...useDarkProps,
    ...useSizeProps,

    dense: Boolean,

    icon: String,
    iconRight: String,
    iconRemove: String,
    iconSelected: String,
    label: [ String, Number ],

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

    tabindex: [ String, Number ],
    disable: Boolean,

    ripple: {
      type: [ Boolean, Object ],
      default: true
    }
  },

  emits: [ 'update:modelValue', 'update:selected', 'remove', 'click' ],

  setup (props, { slots, emit }) {
    const { proxy: { $q } } = getCurrentInstance()

    const isDark = useDark(props, $q)
    const sizeStyle = useSize(props, defaultSizes)

    const hasLeftIcon = computed(() => props.selected === true || props.icon !== void 0)

    const leftIcon = computed(() => (
      props.selected === true
        ? props.iconSelected || $q.iconSet.chip.selected
        : props.icon
    ))

    const removeIcon = computed(() => props.iconRemove || $q.iconSet.chip.remove)

    const isClickable = computed(() =>
      props.disable === false
      && (props.clickable === true || props.selected !== null)
    )

    const classes = computed(() => {
      const text = props.outline === true
        ? props.color || props.textColor
        : props.textColor

      return 'q-chip row inline no-wrap items-center'
        + (props.outline === false && props.color !== void 0 ? ` bg-${ props.color }` : '')
        + (text ? ` text-${ text } q-chip--colored` : '')
        + (props.disable === true ? ' disabled' : '')
        + (props.dense === true ? ' q-chip--dense' : '')
        + (props.outline === true ? ' q-chip--outline' : '')
        + (props.selected === true ? ' q-chip--selected' : '')
        + (isClickable.value === true ? ' q-chip--clickable cursor-pointer non-selectable q-hoverable' : '')
        + (props.square === true ? ' q-chip--square' : '')
        + (isDark.value === true ? ' q-chip--dark q-dark' : '')
    })

    const attributes = computed(() => (
      props.disable === true
        ? { tabindex: -1, 'aria-disabled': 'true' }
        : { tabindex: props.tabindex || 0 }
    ))

    function onKeyup (e) {
      e.keyCode === 13 /* ENTER */ && onClick(e)
    }

    function onClick (e) {
      if (!props.disable) {
        emit('update:selected', !props.selected)
        emit('click', e)
      }
    }

    function onRemove (e) {
      if (e.keyCode === void 0 || e.keyCode === 13) {
        stopAndPrevent(e)
        if (props.disable === false) {
          emit('update:modelValue', false)
          emit('remove')
        }
      }
    }

    function getContent () {
      const child = []

      isClickable.value === true && child.push(
        h('div', { class: 'q-focus-helper' })
      )

      hasLeftIcon.value === true && child.push(
        h(QIcon, {
          class: 'q-chip__icon q-chip__icon--left',
          name: leftIcon.value
        })
      )

      const label = props.label !== void 0
        ? [ h('div', { class: 'ellipsis' }, [ props.label ]) ]
        : void 0

      child.push(
        h('div', {
          class: 'q-chip__content col row no-wrap items-center q-anchor--skip'
        }, hMergeSlotSafely(slots.default, label))
      )

      props.iconRight && child.push(
        h(QIcon, {
          class: 'q-chip__icon q-chip__icon--right',
          name: props.iconRight
        })
      )

      props.removable === true && child.push(
        h(QIcon, {
          class: 'q-chip__icon q-chip__icon--remove cursor-pointer',
          name: removeIcon.value,
          ...attributes.value,
          onClick: onRemove,
          onKeyup: onRemove
        })
      )

      return child
    }

    return () => {
      if (props.modelValue === false) { return }

      const data = {
        class: classes.value,
        style: sizeStyle.value
      }

      isClickable.value === true && Object.assign(
        data,
        attributes.value,
        { onClick, onKeyup }
      )

      return hDir(
        'div',
        data,
        getContent(),
        'ripple',
        props.ripple !== false && props.disable !== true,
        () => [ [ Ripple, props.ripple ] ]
      )
    }
  }
})
