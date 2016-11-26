import { css } from './dom'

let size

export function width () {
  if (size) {
    return size
  }

  const
    inner = document.createElement('p'),
    outer = document.createElement('div')

  css(inner, {
    width: '100%',
    height: '200px'
  })
  css(outer, {
    position: 'absolute',
    top: '0px',
    left: '0px',
    visibility: 'hidden',
    width: '200px',
    height: '150px',
    overflow: 'hidden'
  })

  outer.appendChild(inner)

  document.body.appendChild(outer)

  let w1 = inner.offsetWidth
  outer.style.overflow = 'scroll'
  let w2 = inner.offsetWidth

  if (w1 === w2) {
    w2 = outer.clientWidth
  }

  document.body.removeChild(outer)
  size = w1 - w2

  return size
}
