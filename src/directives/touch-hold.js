import { add, get, remove } from '../utils/store'
import { position } from '../utils/event'

function updateBinding (el, binding, ctx) {
  ctx.duration = parseInt(binding.arg, 10) || 800
  if (binding.oldValue !== binding.value) {
    ctx.handler = binding.value
  }
}

export default {
  name: 'touch-hold',
  bind (el, binding) {
    let ctx = {
      start (evt) {
        const startTime = new Date().getTime()
        ctx.timer = setTimeout(() => {
          document.removeEventListener('mousemove', ctx.mouseAbort)
          document.removeEventListener('mouseup', ctx.mouseAbort)

          ctx.handler({
            evt,
            position: position(evt),
            duration: new Date().getTime() - startTime
          })
        }, ctx.duration)
      },
      mouseStart (evt) {
        document.addEventListener('mousemove', ctx.mouseAbort)
        document.addEventListener('mouseup', ctx.mouseAbort)
        ctx.start(evt)
      },
      abort (evt) {
        clearTimeout(ctx.timer)
        ctx.timer = null
      },
      mouseAbort (evt) {
        document.removeEventListener('mousemove', ctx.mouseAbort)
        document.removeEventListener('mouseup', ctx.mouseAbort)
        ctx.abort(evt)
      }
    }

    add('touchhold', el, ctx)
    updateBinding(el, binding, ctx)
    el.addEventListener('touchstart', ctx.start)
    el.addEventListener('touchmove', ctx.abort)
    el.addEventListener('touchend', ctx.abort)
    el.addEventListener('mousedown', ctx.mouseStart)
  },
  update (el, binding) {
    updateBinding(el, binding, get('touchhold', el))
  },
  unbind (el, binding) {
    let ctx = get('touchhold', el)
    el.removeEventListener('touchstart', ctx.start)
    el.removeEventListener('touchmove', ctx.abort)
    el.removeEventListener('touchend', ctx.abort)
    el.removeEventListener('mousedown', ctx.mouseStart)
    document.removeEventListener('mousemove', ctx.mouseAbort)
    document.removeEventListener('mouseup', ctx.mouseAbort)
    remove('touchhold', el)
  }
}
