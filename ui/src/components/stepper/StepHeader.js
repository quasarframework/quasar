import { h, ref, computed, withDirectives, getCurrentInstance } from 'vue'

import QIcon from '../icon/QIcon.js'
import Ripple from '../../directives/ripple/Ripple.js'

import { createComponent } from '../../utils/private.create/create.js'

export default createComponent({
  name: 'StepHeader',

  props: {
    stepper: {},
    step: {},
    goToPanel: Function
  },

  setup (props, { attrs }) {
    const { proxy: { $q } } = getCurrentInstance()
    const blurRef = ref(null)

    const isActive = computed(() => props.stepper.modelValue === props.step.name)

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
      return isDisable.value === false && (opt === true || opt === '')
    })

    const headerNav = computed(() => {
      const
        opt = props.step.headerNav,
        nav = opt === true || opt === '' || opt === void 0

      return isDisable.value === false
        && props.stepper.headerNav
        && nav
    })

    const hasPrefix = computed(() => {
      return props.step.prefix
        && (isActive.value === false || props.stepper.activeIcon === 'none')
        && (isError.value === false || props.stepper.errorIcon === 'none')
        && (isDone.value === false || props.stepper.doneIcon === 'none')
    })

    const icon = computed(() => {
      const defaultIcon = props.step.icon || props.stepper.inactiveIcon

      if (isActive.value === true) {
        const icon = props.step.activeIcon || props.stepper.activeIcon
        return icon === 'none'
          ? defaultIcon
          : icon || $q.iconSet.stepper.active
      }

      if (isError.value === true) {
        const icon = props.step.errorIcon || props.stepper.errorIcon
        return icon === 'none'
          ? defaultIcon
          : icon || $q.iconSet.stepper.error
      }

      if (isDisable.value === false && isDone.value === true) {
        const icon = props.step.doneIcon || props.stepper.doneIcon
        return icon === 'none'
          ? defaultIcon
          : icon || $q.iconSet.stepper.done
      }

      return defaultIcon
    })

    const color = computed(() => {
      const errorColor = isError.value === true
        ? props.step.errorColor || props.stepper.errorColor
        : void 0

      if (isActive.value === true) {
        const color = props.step.activeColor || props.stepper.activeColor || props.step.color
        return color !== void 0
          ? color
          : errorColor
      }
      if (errorColor !== void 0) {
        return errorColor
      }
      if (isDisable.value === false && isDone.value === true) {
        return props.step.doneColor || props.stepper.doneColor || props.step.color || props.stepper.inactiveColor
      }

      return props.step.color || props.stepper.inactiveColor
    })

    const classes = computed(() => {
      return 'q-stepper__tab col-grow flex items-center no-wrap relative-position'
        + (color.value !== void 0 ? ` text-${ color.value }` : '')
        + (isError.value === true
          ? ' q-stepper__tab--error q-stepper__tab--error-with-' + (hasPrefix.value === true ? 'prefix' : 'icon')
          : '')
        + (isActive.value === true ? ' q-stepper__tab--active' : '')
        + (isDone.value === true ? ' q-stepper__tab--done' : '')
        + (headerNav.value === true ? ' q-stepper__tab--navigation q-focusable q-hoverable' : '')
        + (isDisable.value === true ? ' q-stepper__tab--disabled' : '')
    })

    const ripple = computed(() => (
      props.stepper.headerNav !== true
        ? false
        : headerNav.value
    ))

    function onActivate () {
      blurRef.value !== null && blurRef.value.focus()
      isActive.value === false && props.goToPanel(props.step.name)
    }

    function onKeyup (e) {
      if (e.keyCode === 13 && isActive.value === false) {
        props.goToPanel(props.step.name)
      }
    }

    return () => {
      const data = { class: classes.value }

      if (headerNav.value === true) {
        data.onClick = onActivate
        data.onKeyup = onKeyup

        Object.assign(data,
          isDisable.value === true
            ? { tabindex: -1, 'aria-disabled': 'true' }
            : { tabindex: attrs.tabindex || 0 }
        )
      }

      const child = [
        h('div', { class: 'q-focus-helper', tabindex: -1, ref: blurRef }),

        h('div', { class: 'q-stepper__dot row flex-center q-stepper__line relative-position' }, [
          h('span', { class: 'row flex-center' }, [
            hasPrefix.value === true
              ? props.step.prefix
              : h(QIcon, { name: icon.value })
          ])
        ])
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
          h('div', {
            class: 'q-stepper__label q-stepper__line relative-position'
          }, content)
        )
      }

      return withDirectives(
        h('div', data, child),
        [ [ Ripple, ripple.value ] ]
      )
    }
  }
})
