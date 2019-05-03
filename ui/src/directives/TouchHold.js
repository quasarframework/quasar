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
          document.addEventListener('mousemove', ctx.mouseEnd, true)
          document.addEventListener('click', ctx.mouseEnd, true)
          ctx.start(evt, true)
        }
      },

      mouseEnd (evt) {
        document.removeEventListener('mousemove', ctx.mouseEnd, true)
        document.removeEventListener('click', ctx.mouseEnd, true)
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
          if (Platform.is.mobile !== true) {
            document.body.classList.add('non-selectable')
            clearSelection()
          }
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
        document.body.classList.remove('non-selectable')

        if (ctx.triggered === true) {
          stopAndPrevent(evt)
        }
        else {
          clearTimeout(ctx.timer)
        }
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
    el.addEventListener('touchcancel', ctx.end)
    el.addEventListener('touchend', ctx.end)
  },

  update (el, binding) {
    updateBinding(el, binding)
  },

  unbind (el, binding) {
    let ctx = el.__qtouchhold_old || el.__qtouchhold
    if (ctx !== void 0) {
      removeObserver(ctx)
      clearTimeout(ctx.timer)
      document.body.classList.remove('non-selectable')

      if (binding.modifiers.mouse === true) {
        el.removeEventListener('mousedown', ctx.mouseStart)
        document.removeEventListener('mousemove', ctx.mouseEnd, true)
        document.removeEventListener('click', ctx.mouseEnd, true)
      }
      el.removeEventListener('touchstart', ctx.start, listenOpts.notPassive)
      el.removeEventListener('touchmove', ctx.end, listenOpts.notPassive)
      el.removeEventListener('touchcancel', ctx.end)
      el.removeEventListener('touchend', ctx.end)

      delete el[el.__qtouchhold_old ? '__qtouchhold_old' : '__qtouchhold']
    }
  }
}
