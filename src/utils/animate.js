import uid from './uid'

let ids = {}

function defaultEasing (progress) {
  return progress
}

export function start ({name, duration = 300, to, from, apply, done, cancel, easing}) {
  let id = name
  const start = performance.now()

  if (id) {
    stop(id)
  }
  else {
    id = uid()
  }

  const delta = easing || defaultEasing
  const handler = () => {
    let progress = (performance.now() - start) / duration
    if (progress > 1) {
      progress = 1
    }

    const newPos = from + (to - from) * delta(progress)
    apply(newPos, progress)

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
  if (!id) {
    return
  }
  let anim = ids[id]
  if (anim && anim.timer) {
    cancelAnimationFrame(anim.timer)
    anim.cancel && anim.cancel(anim.last)
    delete ids[id]
  }
}
