import { listenOpts, stopAndPrevent } from '../../utils/event.js'
import Platform from '../../plugins/Platform.js'

const evtOpts = listenOpts.notPassiveCapture

export default {
  name: 'click-outside',

  bind (el, { value, arg }) {
    const ctx = {
      trigger: value,
      handler (evt) {
        const target = evt && evt.target

        if (
          !target ||
          // IE wrongfully triggers focusin event with target set to body
          // when clicking, so we need this workaround:
          (Platform.is.ie && evt.type === 'focusin' && target === document.body)
        ) {
          return
        }

        if (target !== document.body) {
          const related = arg !== void 0
            ? [ ...arg, el ]
            : [ el ]

          for (let i = related.length - 1; i >= 0; i--) {
            if (related[i].contains(target)) {
              return
            }
          }

          let parent = target
          while (parent !== document.body) {
            if (parent.classList.contains('q-menu') || parent.classList.contains('q-dialog')) {
              let sibling = parent
              while ((sibling = sibling.previousElementSibling) !== null) {
                if (sibling.contains(el)) {
                  return
                }
              }
            }
            parent = parent.parentNode
          }
        }

        // prevent accidental click/tap on something else
        // that has a trigger --> improves UX
        Platform.is.mobile === true && stopAndPrevent(evt)

        ctx.trigger(evt)
      }
    }

    if (el.__qclickoutside) {
      el.__qclickoutside_old = el.__qclickoutside
    }

    el.__qclickoutside = ctx
    document.body.addEventListener('mousedown', ctx.handler, evtOpts)
    document.body.addEventListener('touchstart', ctx.handler, evtOpts)
    Platform.is.desktop === true && document.body.addEventListener('focusin', ctx.handler, evtOpts)
  },

  update (el, { value, oldValue }) {
    if (value !== oldValue) {
      el.__qclickoutside.trigger = value
    }
  },

  unbind (el) {
    const ctx = el.__qclickoutside_old || el.__qclickoutside
    if (ctx !== void 0) {
      document.body.removeEventListener('mousedown', ctx.handler, evtOpts)
      document.body.removeEventListener('touchstart', ctx.handler, evtOpts)
      Platform.is.desktop === true && document.body.removeEventListener('focusin', ctx.handler, evtOpts)
      delete el[el.__qclickoutside_old ? '__qclickoutside_old' : '__qclickoutside']
    }
  }
}
