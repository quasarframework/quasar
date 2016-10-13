let
  data = {},
  defaultDuration = 800

function update (el, binding) {
  data[el].duration = parseInt(binding.arg, 10) || defaultDuration
  if (binding.oldValue !== binding.value) {
    data[el].handler = binding.value
  }
}

export default {
  bind (el, binding) {
    let ctx = {
      start (evt) {
        ctx.timer = setTimeout(() => {
          document.removeEventListener('mousemove', ctx.mouseAbort)
          document.removeEventListener('mouseup', ctx.mouseAbort)
          ctx.handler()
        }, ctx.duration)
      },
      mouseStart (evt) {
        document.addEventListener('mousemove', ctx.mouseAbort)
        document.addEventListener('mouseup', ctx.mouseAbort)
        ctx.start(evt)
      },
      abort (evt) {
        if (ctx.timer) {
          clearTimeout(ctx.timer)
          ctx.timer = null
        }
      },
      mouseAbort (evt) {
        document.removeEventListener('mousemove', ctx.mouseAbort)
        document.removeEventListener('mouseup', ctx.mouseAbort)
        ctx.abort(evt)
      }
    }

    data[el] = ctx
    update(el, binding)
    el.addEventListener('touchstart', ctx.start)
    el.addEventListener('touchmove', ctx.abort)
    el.addEventListener('touchend', ctx.abort)
    el.addEventListener('mousedown', ctx.mouseStart)
  },
  update,
  unbind (el, binding) {
    let ctx = data[el]
    el.removeEventListener('touchstart', ctx.start)
    el.removeEventListener('touchmove', ctx.abort)
    el.removeEventListener('touchend', ctx.abort)
    el.removeEventListener('mousedown', ctx.mouseStart)
    document.removeEventListener('mousemove', ctx.mouseAbort)
    document.removeEventListener('mouseup', ctx.mouseAbort)
  }
}
