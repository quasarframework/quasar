import { computed, getCurrentInstance, h, ref, withDirectives } from 'vue'

import QIcon from '../icon/QIcon.js'
import Ripple from '../../directives/ripple/Ripple.js'

import { createComponent } from '../../utils/private.create/create.js'
import { stopAndPrevent } from '../../utils/event/event.js'

function preventSpace(e) {
  if (e.keyCode === 32) stopAndPrevent(e)
}

export default createComponent({
  name: 'StepHeader',

  props: {
    stepper: {},
    step: {},
    goToPanel: Function
  },

  setup(props, { attrs }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()
    const blurRef = ref(null)

    const isActive = computed(
      () => props.stepper.modelValue === props.step.name
    )

    const isDisable = computed(() => {
      const opt = props.step.disable
      return opt === true || opt === ''
    })

    const isError = computed(() => {
      const opt = props.step.error
      return opt === true || opt === ''
    })

    const isDone = computed(() => {
      const opt = props.step.done
      return !isDisable.value && (opt === true || opt === '')
    })

    const headerNav = computed(() => {
      const opt = props.step.headerNav
      return (
        !isDisable.value &&
        props.stepper.headerNav &&
        (opt === true || opt === '' || opt === void 0)
      )
    })

    const hasPrefix = computed(
      () =>
        props.step.prefix &&
        (!isActive.value || props.stepper.activeIcon === 'none') &&
        (!isError.value || props.stepper.errorIcon === 'none') &&
        (!isDone.value || props.stepper.doneIcon === 'none')
    )

    const icon = computed(() => {
      const defaultIcon = props.step.icon || props.stepper.inactiveIcon

      if (isActive.value) {
        const localIcon = props.step.activeIcon || props.stepper.activeIcon
        return localIcon === 'none'
          ? defaultIcon
          : localIcon || $q.iconSet.stepper.active
      }

      if (isError.value) {
        const localIcon = props.step.errorIcon || props.stepper.errorIcon
        return localIcon === 'none'
          ? defaultIcon
          : localIcon || $q.iconSet.stepper.error
      }

      if (!isDisable.value && isDone.value) {
        const localIcon = props.step.doneIcon || props.stepper.doneIcon
        return localIcon === 'none'
          ? defaultIcon
          : localIcon || $q.iconSet.stepper.done
      }

      return defaultIcon
    })

    const color = computed(() => {
      const errorColor = isError.value
        ? props.step.errorColor || props.stepper.errorColor
        : void 0

      if (isActive.value) {
        const localColor =
          props.step.activeColor ||
          props.stepper.activeColor ||
          props.step.color
        return localColor !== void 0 ? localColor : errorColor
      }

      if (errorColor !== void 0) return errorColor

      if (!isDisable.value && isDone.value) {
        return (
          props.step.doneColor ||
          props.stepper.doneColor ||
          props.step.color ||
          props.stepper.inactiveColor
        )
      }

      return props.step.color || props.stepper.inactiveColor
    })

    const classes = computed(
      () =>
        'q-stepper__tab col-grow flex items-center no-wrap relative-position' +
        (color.value !== void 0 ? ` text-${color.value}` : '') +
        (isError.value
          ? ' q-stepper__tab--error q-stepper__tab--error-with-' +
            (hasPrefix.value ? 'prefix' : 'icon')
          : '') +
        (isActive.value ? ' q-stepper__tab--active' : '') +
        (isDone.value ? ' q-stepper__tab--done' : '') +
        (headerNav.value
          ? ' q-stepper__tab--navigation q-focusable q-hoverable'
          : '') +
        (isDisable.value ? ' q-stepper__tab--disabled' : '')
    )

    const ripple = computed(() => props.stepper.headerNav && headerNav.value)

    function onActivate() {
      blurRef.value?.focus({ preventScroll: true })
      if (!isActive.value) props.goToPanel(props.step.name)
    }

    function onKeyup(e) {
      if ([13, 32].includes(e.keyCode)) {
        if (!isActive.value) props.goToPanel(props.step.name)
        stopAndPrevent(e)
      }
    }

    return () => {
      const data = { class: classes.value }

      if (headerNav.value) {
        data.onClick = onActivate
        data.onKeydown = preventSpace
        data.onKeyup = onKeyup
        data.role = 'button'
        data['aria-current'] = isActive.value ? 'step' : void 0

        Object.assign(
          data,
          isDisable.value
            ? { tabindex: -1, 'aria-disabled': 'true' }
            : { tabindex: attrs.tabindex || 0 }
        )
      }

      const child = [
        h('div', { class: 'q-focus-helper', tabindex: -1, ref: blurRef }),

        h(
          'div',
          {
            class:
              'q-stepper__dot row flex-center q-stepper__line relative-position'
          },
          [
            h('span', { class: 'row flex-center' }, [
              hasPrefix.value
                ? props.step.prefix
                : h(QIcon, { name: icon.value })
            ])
          ]
        )
      ]

      if (props.step.title !== void 0 && props.step.title !== null) {
        const content = [
          h('div', { class: 'q-stepper__title' }, props.step.title)
        ]

        if (props.step.caption !== void 0 && props.step.caption !== null) {
          content.push(
            h('div', { class: 'q-stepper__caption' }, props.step.caption)
          )
        }

        child.push(
          h(
            'div',
            {
              class: 'q-stepper__label q-stepper__line relative-position'
            },
            content
          )
        )
      }

      return withDirectives(h('div', data, child), [[Ripple, ripple.value]])
    }
  }
})
