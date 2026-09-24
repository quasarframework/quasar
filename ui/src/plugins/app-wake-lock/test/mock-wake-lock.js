import { vi } from 'vitest'

/**
 * The real Screen Wake Lock API depends on the page being visible and on
 * the OS power settings (battery saver rejects it), so we mock it
 * deterministically; this import should always sit before the
 * AppWakeLock one
 */

let isHidden = false

// the real "hidden" getter lives on Document.prototype,
// so shadow it with an own property on the instance
Object.defineProperty(document, 'hidden', {
  get: () => isHidden,
  configurable: true
})

export const sentinelList = []

class FakeSentinel extends EventTarget {
  type = 'screen'
  released = false

  release = vi.fn(() => {
    if (!this.released) {
      this.released = true
      this.dispatchEvent(new Event('release'))
    }
    return Promise.resolve()
  })
}

export const mockedWakeLock = {
  request: vi.fn(() => {
    if (isHidden) {
      return Promise.reject(
        new DOMException('The document is not visible', 'NotAllowedError')
      )
    }

    const sentinel = new FakeSentinel()
    sentinelList.push(sentinel)
    return Promise.resolve(sentinel)
  })
}

Object.defineProperty(navigator, 'wakeLock', {
  value: mockedWakeLock,
  configurable: true
})

export function getHeldSentinel() {
  return sentinelList.find(sentinel => !sentinel.released) ?? null
}

// mirrors the browser: hiding the page releases every held lock
export function setHidden(val) {
  isHidden = val

  if (val) {
    for (const sentinel of sentinelList) {
      sentinel.release()
    }
  }

  document.dispatchEvent(new Event('visibilitychange'))
}
