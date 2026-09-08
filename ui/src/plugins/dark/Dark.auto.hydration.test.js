import { describe, expect, test, vi } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { autoCard, quasarOptions } from './Dark.auto.hydration.fixtures.js'

const fixturesPath = import.meta.url

describe('Dark plugin SSR hydration in auto mode', () => {
  // single test, takeover last: it flips the graph's pre-hydration
  // state (see the harness contract)
  test('hydrates in the server-rendered light state, resolves auto on takeover', async () => {
    // the OS color scheme cannot be toggled from inside the page: stub
    // the query the plugin resolves 'auto' with, to a dark preference
    const originalMatchMedia = window.matchMedia
    const media = {
      matches: true,
      addListener: vi.fn(),
      removeListener: vi.fn()
    }
    window.matchMedia = vi.fn(() => media)

    try {
      const result = await hydrate(fixturesPath, 'autoCard', autoCard, {
        quasarOptions
      })

      expect(result.consoleOutput).toEqual([])

      // the server cannot know the preference: it renders 'auto' as
      // light and flags it for the client
      expect(result.serverHtml).not.toContain('q-card--dark')
      expect(result.meta.bodyClasses).toContain('body--light')
      expect(result.meta.bodyAttrs).toContain('data-dark-auto')

      // the client hydrated the light markup in that same light state
      // (hydrate() asserts it left the body class alone), while already
      // reporting the configured mode
      const card = result.host.querySelector('.q-card')
      expect(card.classList.contains('q-card--dark')).toBe(false)
      expect(result.vm.$q.dark.mode).toBe('auto')
      expect(result.vm.$q.dark.isActive).toBe(false)
      expect(media.addListener).not.toHaveBeenCalled()

      await result.takeover()

      // the client resolved 'auto' and now tracks the preference
      expect(document.body.dataset.darkAuto).toBeUndefined()
      expect(result.vm.$q.dark.mode).toBe('auto')
      expect(result.vm.$q.dark.isActive).toBe(true)
      expect(card.classList.contains('q-card--dark')).toBe(true)
      expect(document.body.classList.contains('body--dark')).toBe(true)
      expect(document.body.classList.contains('body--light')).toBe(false)
      expect(media.addListener).toHaveBeenCalledTimes(1)

      media.matches = false
      media.addListener.mock.calls[0][0]()
      await result.vm.$nextTick()

      expect(result.vm.$q.dark.isActive).toBe(false)
      expect(card.classList.contains('q-card--dark')).toBe(false)
      expect(document.body.classList.contains('body--light')).toBe(true)
      expect(document.body.classList.contains('body--dark')).toBe(false)

      // detach the plugin from the stubbed media query
      result.vm.$q.dark.set(false)
      expect(media.removeListener).toHaveBeenCalledTimes(1)
    } finally {
      window.matchMedia = originalMatchMedia
    }
  })
})
