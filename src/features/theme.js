import { ready } from '../utils/dom'

export function set (theme) {
  const currentTheme = current
  current = theme

  ready(() => {
    if (currentTheme) {
      document.body.classList.remove(current)
    }
    document.body.classList.add(theme)
  })
}

export var current

if (typeof __THEME !== 'undefined') {
  set(__THEME)
}
