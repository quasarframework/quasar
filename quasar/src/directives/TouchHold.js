import { position, leftClick } from '../utils/event.js'

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
    const
      mouse = binding.modifiers.noMouse !== true,
      stopPropagation = binding.modifiers.stop,
      preventDefault = binding.modifiers.prevent

    let ctx = {
      mouseStart (evt) {
        if (leftClick(evt)) {
          document.addEventListener('mousemove', ctx.mouseAbortMove)
          document.addEventListener('mouseup', ctx.mouseAbort)
          ctx.start(evt)
        }
      },
      mouseAbortMove (evt) {
        new Date().getTime() - ctx.event.time > 20 && ctx.mouseAbort(evt)
      },
      mouseAbort (evt) {
        document.removeEventListener('mousemove', ctx.mouseAbortMove)
        document.removeEventListener('mouseup', ctx.mouseAbort)
        ctx.abort(evt)
      },

      start (evt) {
        ctx.event = { time: new Date().getTime() }

        ctx.timer = setTimeout(() => {
          stopPropagation && evt.stopPropagation()
          preventDefault && evt.preventDefault()

          if (mouse) {
            document.removeEventListener('mousemove', ctx.mouseAbortMove)
            document.removeEventListener('mouseup', ctx.mouseAbort)
          }

          ctx.handler({
            evt,
            position: position(evt),
            duration: new Date().getTime() - ctx.event.time
          })
        }, ctx.duration)
      },
      abortMove () {
        new Date().getTime() - ctx.event.time > 20 && ctx.abort()
      },
      abort () {
        clearTimeout(ctx.timer)
        ctx.timer = null
        ctx.event = {}
      }
    }

    if (el.__qtouchhold) {
      el.__qtouchhold_old = el.__qtouchhold
    }

    el.__qtouchhold = ctx
    updateBinding(el, binding)

    if (mouse) {
      el.addEventListener('mousedown', ctx.mouseStart)
    }
    el.addEventListener('touchstart', ctx.start)
    el.addEventListener('touchmove', ctx.abortMove)
    el.addEventListener('touchend', ctx.abort)
  },

  update (el, binding) {
    updateBinding(el, binding)
  },

  unbind (el) {
    let ctx = el.__qtouchhold_old || el.__qtouchhold
    if (ctx !== void 0) {
      el.removeEventListener('touchstart', ctx.start)
      el.removeEventListener('touchend', ctx.abort)
      el.removeEventListener('touchmove', ctx.abortMove)
      el.removeEventListener('mousedown', ctx.mouseStart)
      document.removeEventListener('mousemove', ctx.mouseAbortMove)
      document.removeEventListener('mouseup', ctx.mouseAbort)
      delete el[el.__qtouchhold_old ? '__qtouchhold_old' : '__qtouchhold']
    }
  }
}
