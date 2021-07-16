import { h, defineComponent, computed, Transition, getCurrentInstance } from 'vue'

import QSpinner from '../spinner/QSpinner.js'

import useDark, { useDarkProps } from '../../composables/private/use-dark.js'
import useTransition, { useTransitionProps } from '../../composables/private/use-transition.js'

export default defineComponent({
  name: 'QInnerLoading',

  props: {
    ...useDarkProps,
    ...useTransitionProps,

    showing: Boolean,
    color: String,

    size: {
      type: [ String, Number ],
      default: 42
    }
  },

  setup (props, { slots }) {
    const vm = getCurrentInstance()
    const isDark = useDark(props, vm.proxy.$q)

    const { transition, transitionStyle } = useTransition(props, computed(() => props.showing))

    const classes = computed(() =>
      'q-inner-loading absolute-full column flex-center'
      + (isDark.value === true ? ' q-inner-loading--dark' : '')
    )

    function getContent () {
      return props.showing === true
        ? h(
            'div',
            { class: classes.value, style: transitionStyle.value },
            slots.default !== void 0
              ? slots.default()
              : [
                  h(QSpinner, {
                    size: props.size,
                    color: props.color
                  })
                ]
          )
        : null
    }

    return () => h(Transition, {
      name: transition.value,
      appear: true
    }, getContent)
  }
})
