import { onTestFinished, vi } from 'vitest'

/**
 * The real Fullscreen API rejects without a user gesture
 * (and "document.fullscreenElement" only has a legacy no-op setter),
 * so we mock the functionality deterministically
 */

let fullscreenEl = null

// The real "fullscreenElement" getter lives on Document.prototype,
// so shadow it with an own property on the instance
Object.defineProperty(document, 'fullscreenElement', {
  get: () => fullscreenEl,
  configurable: true
})

export function mockedRequestFullscreen(el = document.documentElement) {
  fullscreenEl = el
  mockedToggleFullscreen()
  return Promise.resolve()
}

export function mockedExitFullscreen() {
  fullscreenEl = null
  mockedToggleFullscreen()
  return Promise.resolve()
}

export function mockedToggleFullscreen() {
  document.dispatchEvent(new Event('fullscreenchange'))
}

export function createMockedEl() {
  const el = document.createElement('div')
  el.setAttribute('tabindex', '0')
  document.body.append(el)

  el.requestFullscreen = vi.fn(() => {
    fullscreenEl = el
    mockedToggleFullscreen()
    return Promise.resolve()
  })

  el.exitFullscreen = mockedExitFullscreen

  onTestFinished(() => {
    el.remove()
  })

  return el
}

document.documentElement.requestFullscreen = mockedRequestFullscreen
document.documentElement.exitFullscreen = mockedExitFullscreen

document.requestFullscreen = mockedRequestFullscreen
document.exitFullscreen = mockedExitFullscreen
