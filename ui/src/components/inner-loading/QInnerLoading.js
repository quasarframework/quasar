import { h, computed, Transition, getCurrentInstance } from 'vue'

import QSpinner from '../spinner/QSpinner.js'

import { createComponent } from '../../utils/private.create/create.js'
import useDark, { useDarkProps } from '../../composables/private.use-dark/use-dark.js'
import useTransition, { useTransitionProps } from '../../composables/private.use-transition/use-transition.js'

export default createComponent({
  name: 'QInnerLoading',

  props: {
    ...useDarkProps,
    ...useTransitionProps,

    showing: Boolean,
    color: String,

    size: {
      type: [ String, Number ],
      default: '42px'
    },

    label: String,
    labelClass: String,
    labelStyle: [ String, Array, Object ]
  },

  setup (props, { slots }) {
    const vm = getCurrentInstance()
    const isDark = useDark(props, vm.proxy.$q)

    const { transitionProps, transitionStyle } = useTransition(props)

    const classes = computed(() =>
      'q-inner-loading q--avoid-card-border absolute-full column flex-center'
      + (isDark.value === true ? ' q-inner-loading--dark' : '')
    )

    const labelClass = computed(() =>
      'q-inner-loading__label'
      + (props.labelClass !== void 0 ? ` ${ props.labelClass }` : '')
    )

    function getInner () {
      const child = [
        h(QSpinner, {
          size: props.size,
          color: props.color
        })
      ]

      if (props.label !== void 0) {
        child.push(
          h('div', {
            class: labelClass.value,
            style: props.labelStyle
          }, [ props.label ])
        )
      }

      return child
    }

    function getContent () {
      return props.showing === true
        ? h(
          'div',
          { class: classes.value, style: transitionStyle.value },
          slots.default !== void 0
            ? slots.default()
            : getInner()
        )
        : null
    }

    return () => h(Transition, transitionProps.value, getContent)
  }
})
