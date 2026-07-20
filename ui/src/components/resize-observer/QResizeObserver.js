import {
  getCurrentInstance,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted
} from 'vue'

import useHydration from '../../composables/use-hydration/use-hydration.js'

import { createComponent } from '../../utils/private.create/create.js'
import { listenOpts, noop } from '../../utils/event/event.js'

const hasObserver = typeof ResizeObserver !== 'undefined'
const resizeProps = hasObserver
  ? {}
  : {
      style:
        'display:block;position:absolute;top:0;left:0;right:0;bottom:0;height:100%;width:100%;overflow:hidden;pointer-events:none;z-index:-1;',
      url: 'about:blank'
    }

export default createComponent({
  name: 'QResizeObserver',

  props: {
    debounce: {
      type: [String, Number],
      default: 100
    }
  },

  emits: ['resize'],

  setup(props, { emit }) {
    if (__QUASAR_SSR_SERVER__) return noop

    let timer = null,
      targetEl,
      size = { width: -1, height: -1 }

    function trigger(immediately) {
      if (
        immediately === true ||
        props.debounce === 0 ||
        props.debounce === '0'
      ) {
        emitEvent()
      } else if (timer === null) {
        timer = setTimeout(emitEvent, props.debounce)
      }
    }

    function emitEvent() {
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }

      if (targetEl) {
        const { offsetWidth: width, offsetHeight: height } = targetEl

        if (width !== size.width || height !== size.height) {
          size = { width, height }
          emit('resize', size)
        }
      }
    }

    const { proxy } = getCurrentInstance()

    // expose public method
    proxy.trigger = trigger

    if (hasObserver) {
      let observer,
        isDestroyed = false

      // initialize as soon as possible
      const init = stop => {
        if (isDestroyed) return

        targetEl = proxy.$el.parentNode

        if (targetEl) {
          observer = new ResizeObserver(trigger)
          observer.observe(targetEl)
          emitEvent()
        } else if (!stop) {
          nextTick(() => {
            init(true)
          })
        }
      }

      onMounted(() => {
        init()
      })

      onBeforeUnmount(() => {
        isDestroyed = true

        if (timer !== null) clearTimeout(timer)

        if (observer !== void 0) {
          if (observer.disconnect !== void 0) {
            observer.disconnect()
          } else if (targetEl) {
            // FF for Android
            observer.unobserve(targetEl)
          }
        }
      })

      return noop
    }

    // no observer, so fallback to old iframe method
    const { isHydrated } = useHydration()

    let curDocView,
      isDestroyed = false

    const cleanup = () => {
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }

      if (curDocView !== void 0) {
        // iOS is fuzzy, need to check it first
        if (curDocView.removeEventListener !== void 0) {
          curDocView.removeEventListener('resize', trigger, listenOpts.passive)
        }
        curDocView = void 0
      }
    }

    const onObjLoad = () => {
      cleanup()

      if (targetEl?.contentDocument) {
        curDocView = targetEl.contentDocument.defaultView
        curDocView.addEventListener('resize', trigger, listenOpts.passive)
        emitEvent()
      }
    }

    onMounted(() => {
      nextTick(() => {
        if (isDestroyed) return

        targetEl = proxy.$el
        if (targetEl) onObjLoad()
      })
    })

    onBeforeUnmount(() => {
      isDestroyed = true
      cleanup()
    })

    return () => {
      if (isHydrated.value) {
        return h('object', {
          class: 'q--avoid-card-border',
          style: resizeProps.style,
          tabindex: -1, // fix for Firefox
          type: 'text/html',
          data: resizeProps.url,
          'aria-hidden': 'true',
          onLoad: onObjLoad
        })
      }
    }
  }
})
