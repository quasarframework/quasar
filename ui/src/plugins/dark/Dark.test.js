import { h } from 'vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import Dark from './Dark.js'
import QCard from '../../components/card/QCard.js'
import setCssVar from '../../utils/css-var/set-css-var.js'

const mountPlugin = () => mount({ render: () => h('div') })

describe('[Dark API]', () => {
  describe('[Injection]', () => {
    test('is injected into $q', () => {
      const wrapper = mountPlugin()
      expect(Dark).toMatchObject(wrapper.vm.$q.dark)
    })
  })

  describe('[Props]', () => {
    describe('[(prop)isActive]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(Dark.isActive).toBeTypeOf('boolean')
      })

      test('is reactive', () => {
        const {
          vm: { $q }
        } = mountPlugin()

        expect(Dark.isActive).toBe(false)
        expect($q.dark.isActive).toBe(false)
        expect(document.body.classList.contains('body--dark')).toBe(false)

        Dark.set(true)

        expect(Dark.isActive).toBe(true)
        expect($q.dark.isActive).toBe(true)
        expect(document.body.classList.contains('body--dark')).toBe(true)
      })
    })

    describe('[(prop)mode]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(['auto', true, false]).toContain(Dark.mode)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)set]', () => {
      test('should be callable', () => {
        const {
          vm: { $q }
        } = mountPlugin()

        expect(Dark.set(true)).toBeUndefined()

        expect(Dark.isActive).toBe(true)
        expect($q.dark.isActive).toBe(true)
        expect(document.body.classList.contains('body--dark')).toBe(true)

        expect(Dark.set(false)).toBeUndefined()

        expect(Dark.isActive).toBe(false)
        expect($q.dark.isActive).toBe(false)
        expect(document.body.classList.contains('body--dark')).toBe(false)
      })

      test('should handle auto mode', () => {
        const {
          vm: { $q }
        } = mountPlugin()

        // The real matchMedia('(prefers-color-scheme: dark)') works in the
        // browser, but the OS/emulated color scheme cannot be toggled from
        // inside the page, so we stub it to deterministically drive both
        // states of "auto" mode and to observe listener (un)registration
        const originalMatchMedia = window.matchMedia
        const media = {
          matches: true,
          addListener: vi.fn(),
          removeListener: vi.fn()
        }
        window.matchMedia = vi.fn(() => media)

        Dark.set('auto')

        expect(Dark.mode).toBe('auto')

        expect(media.addListener).toHaveBeenCalledTimes(1)
        expect(media.removeListener).not.toHaveBeenCalled()

        expect(Dark.isActive).toBe(true)
        expect($q.dark.isActive).toBe(true)
        expect(document.body.classList.contains('body--dark')).toBe(true)

        media.matches = false
        Dark.__updateMedia()

        expect(media.addListener).toHaveBeenCalledTimes(1)
        expect(media.removeListener).not.toHaveBeenCalled()

        expect(Dark.isActive).toBe(false)
        expect($q.dark.isActive).toBe(false)
        expect(document.body.classList.contains('body--dark')).toBe(false)

        Dark.set(true)
        expect(Dark.mode).not.toBe('auto')

        expect(media.addListener).toHaveBeenCalledTimes(1)
        expect(media.removeListener).toHaveBeenCalledTimes(1)

        expect(Dark.isActive).toBe(true)
        expect($q.dark.isActive).toBe(true)
        expect(document.body.classList.contains('body--dark')).toBe(true)

        // Dark.set(true) above detached the plugin from the stubbed media
        // query, so the native matchMedia can be safely restored
        window.matchMedia = originalMatchMedia
      })
    })

    describe('[(method)toggle]', () => {
      test('should be callable', () => {
        const {
          vm: { $q }
        } = mountPlugin()

        Dark.set(true)

        expect(Dark.isActive).toBe(true)
        expect($q.dark.isActive).toBe(true)
        expect(document.body.classList.contains('body--dark')).toBe(true)

        expect(Dark.toggle()).toBeUndefined()

        expect(Dark.isActive).toBe(false)
        expect($q.dark.isActive).toBe(false)
        expect(document.body.classList.contains('body--dark')).toBe(false)

        Dark.toggle()

        expect(Dark.isActive).toBe(true)
        expect($q.dark.isActive).toBe(true)
        expect(document.body.classList.contains('body--dark')).toBe(true)
      })
    })
  })

  describe('[Generic]', () => {
    describe('[Shadow color custom properties]', () => {
      // Every layer of a computed box-shadow as { rgb: [ 0..255 ], alpha };
      // color-mix() results serialize as color(srgb r g b / a) (0..1 channels)
      // while plain colors serialize as rgb()/rgba(), so normalize both
      const shadowColors = el =>
        Array.from(
          getComputedStyle(el).boxShadow.matchAll(
            /color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)(?: \/ ([\d.]+))?\)|rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/g
          ),
          m =>
            m[0].startsWith('color(')
              ? {
                  rgb: [m[1], m[2], m[3]].map(v => Math.round(Number(v) * 255)),
                  alpha: Number(m[4] ?? 1)
                }
              : {
                  rgb: [m[5], m[6], m[7]].map(Number),
                  alpha: Number(m[8] ?? 1)
                }
        )

      const expectShadowColor = (el, rgb) => {
        const colors = shadowColors(el)
        expect(colors.length).toBeGreaterThan(0)
        colors.forEach(color => {
          expect(color.rgb).toEqual(rgb)
          expect(color.alpha).toBeGreaterThan(0)
        })
      }

      const expectNoShadow = el => {
        const colors = shadowColors(el)
        expect(colors.length).toBeGreaterThan(0)
        colors.forEach(color => {
          expect(color.alpha).toBe(0)
        })
      }

      const black = [0, 0, 0]
      const white = [255, 255, 255]

      let el

      beforeEach(() => {
        mountPlugin()
        Dark.set(false)
        el = document.createElement('div')
        el.className = 'shadow-2'
        document.body.append(el)
      })

      afterEach(() => {
        el.remove()
        document.body.style.removeProperty('--q-shadow-color')
        document.body.style.removeProperty('--q-dark-shadow-color')
        Dark.set(false)
      })

      test('light mode elevation follows --q-shadow-color', () => {
        expectShadowColor(el, black)

        document.body.style.setProperty('--q-shadow-color', 'rgb(255, 0, 0)')
        expectShadowColor(el, [255, 0, 0])

        // the dark mode color has no say in light mode
        document.body.style.setProperty(
          '--q-dark-shadow-color',
          'rgb(0, 0, 255)'
        )
        expectShadowColor(el, [255, 0, 0])
      })

      test('dark mode elevation follows --q-dark-shadow-color', () => {
        Dark.set(true)
        expectShadowColor(el, white)

        // the pre v2.11 look
        document.body.style.setProperty('--q-dark-shadow-color', '#000')
        expectShadowColor(el, black)

        document.body.style.setProperty('--q-dark-shadow-color', 'transparent')
        expectNoShadow(el)

        document.body.style.removeProperty('--q-dark-shadow-color')
        expectShadowColor(el, white)

        Dark.set(false)
        expectShadowColor(el, black)
      })

      test('overrides on the root element apply too', () => {
        Dark.set(true)

        const root = document.documentElement
        root.style.setProperty('--q-dark-shadow-color', 'rgb(0, 255, 0)')

        try {
          expectShadowColor(el, [0, 255, 0])

          // body wins over :root, as any inherited property would
          document.body.style.setProperty(
            '--q-dark-shadow-color',
            'rgb(0, 0, 255)'
          )
          expectShadowColor(el, [0, 0, 255])
        } finally {
          root.style.removeProperty('--q-dark-shadow-color')
        }
      })

      test('setCssVar() drives them', () => {
        Dark.set(true)

        setCssVar('dark-shadow-color', 'rgb(0, 255, 0)')
        expectShadowColor(el, [0, 255, 0])

        Dark.set(false)
        setCssVar('shadow-color', 'rgb(255, 0, 0)')
        expectShadowColor(el, [255, 0, 0])
      })

      test('the tints are derived at the body level, not per subtree', () => {
        Dark.set(true)

        const scope = document.createElement('div')
        scope.style.setProperty('--q-dark-shadow-color', 'rgb(0, 255, 0)')
        const scoped = document.createElement('div')
        scoped.className = 'shadow-2'
        scope.append(scoped)
        document.body.append(scope)

        try {
          // documented limitation: a deeper override has no effect
          expectShadowColor(scoped, white)
        } finally {
          scope.remove()
        }
      })

      test('components with a dark surface follow --q-dark-shadow-color', () => {
        const wrapper = mount(QCard, {
          props: { dark: true },
          attachTo: document.body
        })

        try {
          // a dark card keeps its dark surface shadow even on a light page
          expectShadowColor(wrapper.element, white)

          document.body.style.setProperty('--q-dark-shadow-color', '#000')
          expectShadowColor(wrapper.element, black)
        } finally {
          wrapper.unmount()
        }
      })
    })
  })
})
