import uid from './uid.js'
import { linear } from './easing.js'

let ids = {}

export function start ({name, duration = 300, to, from, apply, done, cancel, easing}) {
  let id = name
  const start = new Date()

  if (id) {
    stop(id)
  }
  else {
    id = uid()
  }

  const delta = easing || linear
  const handler = () => {
    let progress = ((new Date()) - start) / duration
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
    anim.timer = requestAnimationFrame(handler)
  }

  const anim = ids[id] = {
    cancel,
    timer: requestAnimationFrame(handler)
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

export default {
  start,
  stop
}
