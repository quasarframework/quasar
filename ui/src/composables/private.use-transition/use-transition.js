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
    type: [String, Number],
    default: 300
  }
}

// shared, reference-stable Transition props per (show, hide) pair, so
// re-renders patch the Transition vnode with the exact same props object
const transitionPropsCache = new Map()

// returns { transitionProps(), transitionStyle() } getters
export default function useTransition(
  props,
  defaultShowFn = () => {},
  defaultHideFn = () => {}
) {
  return {
    transitionProps: () => {
      const show = props.transitionShow || defaultShowFn()
      const hide = props.transitionHide || defaultHideFn()
      const key = `${show}|${hide}`
      let target = transitionPropsCache.get(key)

      if (target === void 0) {
        // transition names can technically be fed generated values
        if (transitionPropsCache.size > 200) transitionPropsCache.clear()

        const showCls = `q-transition--${show}`
        const hideCls = `q-transition--${hide}`

        target = {
          appear: true,

          enterFromClass: `${showCls}-enter-from`,
          enterActiveClass: `${showCls}-enter-active`,
          enterToClass: `${showCls}-enter-to`,

          leaveFromClass: `${hideCls}-leave-from`,
          leaveActiveClass: `${hideCls}-leave-active`,
          leaveToClass: `${hideCls}-leave-to`
        }

        transitionPropsCache.set(key, target)
      }

      return target
    },

    transitionStyle: () =>
      `--q-transition-duration: ${props.transitionDuration}ms`
  }
}
