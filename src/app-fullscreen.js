function isActive () {
  return document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
}

function request (target) {
  target = target || document.documentElement

  if (isActive()) {
    return
  }

  if (target.requestFullscreen) {
    target.requestFullscreen()
  }
  else if (target.msRequestFullscreen) {
    target.msRequestFullscreen()
  }
  else if (target.mozRequestFullScreen) {
    target.mozRequestFullScreen()
  }
  else if (target.webkitRequestFullscreen) {
    target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT) // eslint-disable-line no-undef
  }
}

function exit () {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  }
  else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
  else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  }
  else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  }
}

function toggle (target) {
  if (isActive()) {
    exit()
  }
  else {
    request(target)
  }
}

export default {
  isActive,
  request,
  exit,
  toggle
}
