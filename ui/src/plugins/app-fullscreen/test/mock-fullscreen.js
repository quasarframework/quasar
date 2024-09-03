import { vi, onTestFinished } from 'vitest'

/**
 * jsdom does not support Fullscreen API,
 * so we mock the functionality
 */

export function mockedRequestFullscreen (el = document.documentElement) {
  document.fullscreenElement = el
  mockedToggleFullscreen()
}

export function mockedExitFullscreen () {
  document.fullscreenElement = null
  mockedToggleFullscreen()
}

export function mockedToggleFullscreen () {
  document.onfullscreenchange()
}

export function createMockedEl () {
  const el = document.createElement('div')
  el.setAttribute('tabindex', '0')
  document.body.appendChild(el)

  el.requestFullscreen = vi.fn(() => {
    document.fullscreenElement = el
    mockedToggleFullscreen()
  })

  el.exitFullscreen = mockedExitFullscreen

  onTestFinished(() => { el.remove() })

  return el
}

document.documentElement.requestFullscreen = mockedRequestFullscreen
document.documentElement.exitFullscreen = mockedExitFullscreen

document.requestFullscreen = mockedRequestFullscreen
document.exitFullscreen = mockedExitFullscreen
