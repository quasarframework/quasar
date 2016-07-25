import $ from 'jquery'

const body = $('body')

export function set (theme) {
  if (current) {
    body.removeClass(current)
  }

  current = theme
  body.addClass(theme)
}

export var current
