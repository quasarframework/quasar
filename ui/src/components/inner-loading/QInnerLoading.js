import { h, defineComponent, computed, Transition } from 'vue'

import QSpinner from '../spinner/QSpinner.js'

import useQuasar from '../../composables/use-quasar.js'
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
    const $q = useQuasar()
    const { isDark } = useDark(props, $q)
    const { transition } = useTransition(props, computed(() => props.showing))

    const classes = computed(() =>
      'q-inner-loading absolute-full column flex-center' +
      (isDark.value === true ? ' q-inner-loading--dark' : '')
    )

    function getContent () {
      return props.showing === true
        ? h(
            'div',
            { class: classes.value },
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
