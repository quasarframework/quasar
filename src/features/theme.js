import Utils from '../utils'

export function set (theme) {
  if (current) {
    document.body.classList.remove(current)
  }

  current = theme
  Utils.dom.ready(() => {
    document.body.classList.add(theme)
  })
}

export var current
