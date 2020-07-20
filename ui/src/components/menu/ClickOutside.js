import { listenOpts } from '../../utils/event.js'
import { getVmOfNode, isVmChildOf } from '../../utils/vm.js'

let timer

const
  { notPassiveCapture, passiveCapture } = listenOpts,
  handlers = {
    click: [],
    focus: []
  }

function execHandlers (list, evt) {
  for (let i = list.length - 1; i >= 0; i--) {
    if (list[i](evt) === void 0) {
      return
    }
  }
}

function globalHandler (evt) {
  clearTimeout(timer)

  // prevent autofocus on body resulting from blur
  if (evt.type === 'focusin' && evt.target.hasAttribute('tabindex') === true) {
    timer = setTimeout(() => {
      execHandlers(handlers.focus, evt)
    }, 200)
  }
  else {
    execHandlers(handlers.click, evt)
  }
}

export default {
  name: 'click-outside',

  bind (el, { value, arg }, vnode) {
    const vmEl = vnode.componentInstance || vnode.context

    const ctx = {
      trigger: value,
      toggleEl: arg,

      handler (evt) {
        const target = evt.target

        if (
          target !== void 0 &&
          target.nodeType !== 8 &&
          // directives that prevent click by using pointer-events none generate click on html element
          target !== document.documentElement &&
          target.classList.contains('no-pointer-events') === false &&
          (
            ctx.toggleEl === void 0 ||
            ctx.toggleEl.contains(target) === false
          ) &&
          (
            target === document.body ||
            isVmChildOf(getVmOfNode(target), vmEl) === false
          )
        ) {
          // mark the event as being processed by clickOutside
          // used to prevent refocus after menu close
          evt.qClickOutside = true

          return ctx.trigger(evt)
        }
      }
    }

    if (el.__qclickoutside) {
      el.__qclickoutside_old = el.__qclickoutside
    }

    el.__qclickoutside = ctx

    if (handlers.click.length === 0) {
      document.addEventListener('mousedown', globalHandler, notPassiveCapture)
      document.addEventListener('touchstart', globalHandler, notPassiveCapture)
      document.addEventListener('focusin', globalHandler, passiveCapture)
    }

    handlers.click.push(ctx.handler)

    ctx.timerFocusin = setTimeout(() => {
      handlers.focus.push(ctx.handler)
    }, 500)
  },

  update (el, { value, oldValue, arg }) {
    const ctx = el.__qclickoutside

    if (value !== oldValue) {
      ctx.trigger = value
    }
    if (arg !== ctx.arg) {
      ctx.toggleEl = arg
    }
  },

  unbind (el) {
    const ctx = el.__qclickoutside_old || el.__qclickoutside
    if (ctx !== void 0) {
      clearTimeout(ctx.timerFocusin)

      const
        indexClick = handlers.click.findIndex(h => h === ctx.handler),
        indexFocus = handlers.focus.findIndex(h => h === ctx.handler)

      indexClick > -1 && handlers.click.splice(indexClick, 1)
      indexFocus > -1 && handlers.focus.splice(indexFocus, 1)

      if (handlers.click.length === 0) {
        clearTimeout(timer)
        document.removeEventListener('mousedown', globalHandler, notPassiveCapture)
        document.removeEventListener('touchstart', globalHandler, notPassiveCapture)
        document.removeEventListener('focusin', globalHandler, passiveCapture)
      }

      delete el[el.__qclickoutside_old ? '__qclickoutside_old' : '__qclickoutside']
    }
  }
}
