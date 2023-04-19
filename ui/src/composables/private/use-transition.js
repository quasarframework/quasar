import { computed } from 'vue'

export const useTransitionProps = {
  transitionShow: {
    type: String,
    default: 'fade'
  },

  transitionHide: {
    type: String,
    default: 'fade'
  },

  transitionDuration: {
    type: [ String, Number ],
    default: 300
  }
}

export default function (props, defaultShowFn = () => {}, defaultHideFn = () => {}) {
  return {
    transitionProps: computed(() => {
      const show = `q-transition--${ props.transitionShow || defaultShowFn() }`
      const hide = `q-transition--${ props.transitionHide || defaultHideFn() }`

      return {
        appear: true,

        enterFromClass: `${ show }-enter-from`,
        enterActiveClass: `${ show }-enter-active`,
        enterToClass: `${ show }-enter-to`,

        leaveFromClass: `${ hide }-leave-from`,
        leaveActiveClass: `${ hide }-leave-active`,
        leaveToClass: `${ hide }-leave-to`
      }
    }),

    transitionStyle: computed(() => `--q-transition-duration: ${ props.transitionDuration }ms`)
  }
}
