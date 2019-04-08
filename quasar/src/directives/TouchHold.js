import { position, leftClick, stopAndPrevent, listenOpts } from '../utils/event.js'
import { setObserver, removeObserver } from '../utils/touch-observer.js'
import { clearSelection } from '../utils/selection.js'
import Platform from '../plugins/Platform.js'

function updateBinding (el, binding) {
  const ctx = el.__qtouchhold

  ctx.duration = parseInt(binding.arg, 10) || 600

  if (binding.oldValue !== binding.value) {
    ctx.handler = binding.value
  }
}

export default {
  name: 'touch-hold',

  bind (el, binding) {
    const mouse = binding.modifiers.mouse === true

    const ctx = {
      mouseStart (evt) {
        if (leftClick(evt)) {
          // first click on a page is also a mousemove
          setTimeout(() => {
            ctx.timer !== void 0 && document.addEventListener('mousemove', ctx.mouseEnd, listenOpts.notPassive)
          }, 1)
          document.addEventListener('mouseup', ctx.mouseEnd, listenOpts.notPassive)
          document.addEventListener('click', ctx.mouseEndClick, listenOpts.notPassiveCapture)
          ctx.start(evt, true)
        }
      },

      mouseEnd (evt) {
        setTimeout(() => {
          ctx.mouseEndClick(evt)
        })
      },

      mouseEndClick (evt) {
        document.removeEventListener('mousemove', ctx.mouseEnd, listenOpts.notPassive)
        document.removeEventListener('mouseup', ctx.mouseEnd, listenOpts.notPassive)
        document.removeEventListener('click', ctx.mouseEndClick, listenOpts.notPassiveCapture)
        ctx.end(evt)
      },

      start (evt, mouseEvent) {
        removeObserver(ctx)
        mouseEvent !== true && setObserver(el, evt, ctx)

        const startTime = new Date().getTime()

        if (Platform.is.mobile === true) {
          document.body.classList.add('non-selectable')
          clearSelection()
        }

        ctx.triggered = false

        ctx.timer = setTimeout(() => {
          ctx.triggered = true

          ctx.handler({
            evt,
            position: position(evt),
            duration: new Date().getTime() - startTime
          })
        }, ctx.duration)
      },

      end (evt) {
        removeObserver(ctx)
        Platform.is.mobile === true && document.body.classList.remove('non-selectable')

        if (ctx.triggered === true) {
          stopAndPrevent(evt)
        }
        else {
          clearTimeout(ctx.timer)
        }

        ctx.timer = void 0
      }
    }

    if (el.__qtouchhold) {
      el.__qtouchhold_old = el.__qtouchhold
    }

    el.__qtouchhold = ctx
    updateBinding(el, binding)

    if (mouse === true) {
      el.addEventListener('mousedown', ctx.mouseStart)
    }
    el.addEventListener('touchstart', ctx.start, listenOpts.notPassive)
    el.addEventListener('touchmove', ctx.end, listenOpts.notPassive)
    el.addEventListener('touchcancel', ctx.end, listenOpts.notPassive)
    el.addEventListener('touchend', ctx.end, listenOpts.notPassive)
  },

  update (el, binding) {
    updateBinding(el, binding)
  },

  unbind (el, binding) {
    let ctx = el.__qtouchhold_old || el.__qtouchhold
    if (ctx !== void 0) {
      removeObserver(ctx)
      clearTimeout(ctx.timer)
      ctx.timer = void 0

      Platform.is.mobile === true && document.body.classList.remove('non-selectable')

      if (binding.modifiers.mouse === true) {
        el.removeEventListener('mousedown', ctx.mouseStart)
        document.removeEventListener('mousemove', ctx.mouseEnd, listenOpts.notPassive)
        document.removeEventListener('mouseup', ctx.mouseEnd, listenOpts.notPassive)
        document.removeEventListener('click', ctx.mouseEndClick, listenOpts.notPassiveCapture)
      }
      el.removeEventListener('touchstart', ctx.start, listenOpts.notPassive)
      el.removeEventListener('touchmove', ctx.end, listenOpts.notPassive)
      el.removeEventListener('touchcancel', ctx.end, listenOpts.notPassive)
      el.removeEventListener('touchend', ctx.end, listenOpts.notPassive)

      delete el[el.__qtouchhold_old ? '__qtouchhold_old' : '__qtouchhold']
    }
  }
}
