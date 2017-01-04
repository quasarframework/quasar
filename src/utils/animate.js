import uid from './uid'

let ids = {}

function animate ({id, finalPos, pos, threshold, factor, done, apply}) {
  ids[id] = requestAnimationFrame(() => {
    let diff = (finalPos - pos)
    if (Math.abs(diff) < threshold) {
      delete ids[id]
      apply(finalPos)
      done && done(finalPos)
      return
    }
    let newPos = pos + (finalPos - pos) / factor
    apply(newPos)
    animate({id, finalPos, pos: newPos, threshold, done, factor, apply})
  })
}

export default function start ({name, finalPos, pos, threshold = 1, factor = 5, done, apply}) {
  let id = name
  if (id) {
    stop(id)
  }
  else {
    id = uid()
  }
  animate({id, finalPos, pos, threshold, factor, done, apply})
  return id
}

start.stop = id => {
  let timer = ids[id]
  if (timer) {
    cancelAnimationFrame(timer)
    delete ids[id]
  }
}
