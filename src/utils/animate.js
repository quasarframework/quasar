import uid from './uid'

let ids = {}

export function start ({name, duration = 300, finalPos, pos, done, apply, cancel}) {
  let id = name
  const start = performance.now()

  if (id) {
    stop(id)
  }
  else {
    id = uid()
  }

  const handler = () => {
    let progress = (performance.now() - start) / duration
    if (progress > 1) {
      progress = 1
    }

    const newPos = pos + (finalPos - pos) * progress
    apply(newPos)

    if (progress === 1) {
      delete ids[id]
      done && done(newPos)
      return
    }

    anim.last = {
      pos: newPos,
      progress
    }
    anim.timer = window.requestAnimationFrame(handler)
  }

  const anim = ids[id] = {
    cancel,
    timer: window.requestAnimationFrame(handler)
  }

  return id
}

export function stop (id) {
  let anim = ids[id]
  if (anim.timer) {
    cancelAnimationFrame(anim.timer)
    anim.cancel && anim.cancel(anim.last)
    delete ids[id]
  }
}
