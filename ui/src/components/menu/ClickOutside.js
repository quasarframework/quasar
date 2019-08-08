import { listenOpts, stopAndPrevent } from '../../utils/event.js'
import Platform from '../../plugins/Platform.js'

const { notPassiveCapture, passiveCapture } = listenOpts

export default {
  name: 'click-outside',

  bind (el, { value, arg }) {
    const ctx = {
      focusEnabled: false,

      trigger: value,

      handler (evt) {
        const target = evt.target

        clearTimeout(ctx.timer)
        if (
          (evt.type === 'focusin' && ctx.focusEnabled !== true) ||
          target === void 0 ||
          target.nodeType === 8
        ) {
          return
        }

        const related = arg !== void 0
          ? [ ...arg, el ]
          : [ el ]

        for (let i = related.length - 1; i >= 0; i--) {
          if (related[i].contains(target)) {
            return
          }
        }

        if (evt.type === 'focusin') {
          ctx.timer = setTimeout(() => {
            ctx.processor(evt)
          }, 200)
        }
        else {
          ctx.processor(evt)
        }
      },

      processor (evt) {
        const target = evt.target

        if (target !== document.body) {
          for (let node = target; node !== document.body; node = node.parentNode) {
            if (node.__qPortalVM !== void 0) {
              for (let vm = node.__qPortalVM; vm !== vm.$root; vm = vm.$parent) {
                if (el.contains(vm.$el) === true) {
                  return
                }
              }
              break
            }
          }
        }

        // prevent accidental click/tap on something else
        // that has a trigger --> improves UX
        if (Platform.is.desktop !== true) {
          stopAndPrevent(evt)
        }
        else if (evt.type === 'mousedown' && target.classList.contains('q-dialog__backdrop') === true) {
          const onMouseup = () => {
            const onClick = e => {
              stopAndPrevent(e)
              document.removeEventListener('click', onClick, notPassiveCapture)
            }

            document.addEventListener('click', onClick, notPassiveCapture)
            document.removeEventListener('mouseup', onMouseup, passiveCapture)

            setTimeout(() => {
              document.removeEventListener('click', onClick, notPassiveCapture)
            }, 50)
          }

          document.addEventListener('mouseup', onMouseup, passiveCapture)
        }

        ctx.trigger(evt)
      }
    }

    if (el.__qclickoutside) {
      el.__qclickoutside_old = el.__qclickoutside
    }

    el.__qclickoutside = ctx
    document.addEventListener('mousedown', ctx.handler, notPassiveCapture)
    document.addEventListener('touchstart', ctx.handler, notPassiveCapture)
    if (Platform.is.desktop === true) {
      document.addEventListener('focusin', ctx.handler, passiveCapture)
      setTimeout(() => { ctx.focusEnabled = true }, 500)
    }
  },

  update (el, { value, oldValue }) {
    if (value !== oldValue) {
      el.__qclickoutside.trigger = value
    }
  },

  unbind (el) {
    const ctx = el.__qclickoutside_old || el.__qclickoutside
    if (ctx !== void 0) {
      clearTimeout(ctx.timer)
      document.removeEventListener('mousedown', ctx.handler, notPassiveCapture)
      document.removeEventListener('touchstart', ctx.handler, notPassiveCapture)
      Platform.is.desktop === true && document.removeEventListener('focusin', ctx.handler, passiveCapture)
      delete el[el.__qclickoutside_old ? '__qclickoutside_old' : '__qclickoutside']
    }
  }
}
