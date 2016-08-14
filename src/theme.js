export function set (theme) {
  if (current) {
    document.body.classList.remove(current)
  }

  current = theme
  document.body.classList.add(theme)
}

export var current
