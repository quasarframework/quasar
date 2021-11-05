import { h, onMounted, onBeforeUnmount, getCurrentInstance, nextTick } from 'vue'

import useCanRender from '../../composables/private/use-can-render.js'

import { createComponent } from '../../utils/private/create.js'
import { listenOpts, noop } from '../../utils/event.js'

const hasObserver = typeof ResizeObserver !== 'undefined'
const resizeProps = hasObserver === true
  ? {}
  : {
      style: 'display:block;position:absolute;top:0;left:0;right:0;bottom:0;height:100%;width:100%;overflow:hidden;pointer-events:none;z-index:-1;',
      url: 'about:blank'
    }

export default createComponent({
  name: 'QResizeObserver',

  props: {
    debounce: {
      type: [ String, Number ],
      default: 100
    }
  },

  emits: [ 'resize' ],

  setup (props, { emit }) {
    if (__QUASAR_SSR_SERVER__) { return noop }

    let timer, targetEl, size = { width: -1, height: -1 }

    function trigger (now) {
      if (now === true || props.debounce === 0 || props.debounce === '0') {
        onResize()
      }
      else if (!timer) {
        timer = setTimeout(onResize, props.debounce)
      }
    }

    function onResize () {
      timer = void 0

      if (targetEl) {
        const { offsetWidth: width, offsetHeight: height } = targetEl

        if (width !== size.width || height !== size.height) {
          size = { width, height }
          emit('resize', size)
        }
      }
    }

    const vm = getCurrentInstance()

    // expose public methods
    Object.assign(vm.proxy, { trigger })

    if (hasObserver === true) {
      let observer

      onMounted(() => {
        nextTick(() => {
          targetEl = vm.proxy.$el.parentNode

          if (targetEl) {
            observer = new ResizeObserver(trigger)
            observer.observe(targetEl)
            onResize()
          }
        })
      })

      onBeforeUnmount(() => {
        clearTimeout(timer)

        if (observer !== void 0) {
          if (observer.disconnect !== void 0) {
            observer.disconnect()
          }
          else if (targetEl) { // FF for Android
            observer.unobserve(targetEl)
          }
        }
      })

      return noop
    }
    else { // no observer, so fallback to old iframe method
      const canRender = useCanRender()

      let curDocView

      function cleanup () {
        clearTimeout(timer)

        if (curDocView !== void 0) {
          // iOS is fuzzy, need to check it first
          if (curDocView.removeEventListener !== void 0) {
            curDocView.removeEventListener('resize', trigger, listenOpts.passive)
          }
          curDocView = void 0
        }
      }

      function onObjLoad () {
        cleanup()

        if (targetEl && targetEl.contentDocument) {
          curDocView = targetEl.contentDocument.defaultView
          curDocView.addEventListener('resize', trigger, listenOpts.passive)
          onResize()
        }
      }

      onMounted(() => {
        nextTick(() => {
          targetEl = vm.proxy.$el
          targetEl && onObjLoad()
        })
      })

      onBeforeUnmount(cleanup)

      return () => {
        if (canRender.value === true) {
          return h('object', {
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
  }
})
