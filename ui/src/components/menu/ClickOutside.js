import { listenOpts, stopAndPrevent } from '../../utils/event.js'
import Platform from '../../plugins/Platform.js'

const { notPassiveCapture, passiveCapture } = listenOpts

export default {
  name: 'click-outside',

  bind (el, { value, arg }, vnode) {
    const vmEl = vnode.componentInstance || vnode.context

    const ctx = {
      trigger: value,

      handler (evt) {
        clearTimeout(ctx.timer)

        if (evt.type === 'focusin') {
          ctx.timer = setTimeout(() => {
            ctx.processor(evt)
          }, 200)
        }
        else {
          ctx.processor(evt)
        }
      },

      onMouseup () {
        document.removeEventListener('mouseup', ctx.onMouseup, passiveCapture)
        setTimeout(() => { ctx.onClick() }, 50)
      },

      onClick (e) {
        stopAndPrevent(e)
        document.removeEventListener('click', ctx.onClick, notPassiveCapture)
      },

      processor (evt) {
        const target = evt.target

        if (
          target === void 0 ||
          target.nodeType === 8
        ) {
          return
        }

        if (target !== document.body) {
          const related = arg !== void 0 ? [...arg, el] : [el]

          for (let i = related.length - 1; i >= 0; i--) {
            if (related[i].contains(target)) {
              return
            }
          }

          for (let node = target; node !== document.body; node = node.parentNode) {
            if (node.__vue__ !== void 0) {
              for (let vm = node.__vue__; vm !== void 0; vm = vm.$parent) {
                if (vmEl === vm) {
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
          document.addEventListener('mouseup', ctx.onMouseup, passiveCapture)
          document.addEventListener('click', ctx.onClick, notPassiveCapture)
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
      ctx.timerFocusin = setTimeout(() => {
        document.addEventListener('focusin', ctx.handler, passiveCapture)
      }, 500)
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
      clearTimeout(ctx.timerFocusin)

      document.removeEventListener('mousedown', ctx.handler, notPassiveCapture)
      document.removeEventListener('touchstart', ctx.handler, notPassiveCapture)
      Platform.is.desktop === true && document.removeEventListener('focusin', ctx.handler, passiveCapture)

      delete el[el.__qclickoutside_old ? '__qclickoutside_old' : '__qclickoutside']
    }
  }
}
