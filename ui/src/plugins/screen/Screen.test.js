import { h } from 'vue'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { page } from 'vitest/browser'
import { mount } from '@vue/test-utils'

import Screen from './Screen.js'

const mountPlugin = () => mount({ render: () => h('div') })

const defaultViewport = { width: 1280, height: 800 }

// resizes the real viewport, then waits for the Screen plugin
// (debounced listener on window.visualViewport) to pick it up
async function setViewport(width, height) {
  await page.viewport(width, height)
  await vi.waitFor(() => {
    expect(Screen.width).toBe(width)
    expect(Screen.height).toBe(height)
  })
}

function setWidth(width) {
  return setViewport(width, defaultViewport.height)
}

function setHeight(height) {
  return setViewport(defaultViewport.width, height)
}

afterEach(async () => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  await setViewport(defaultViewport.width, defaultViewport.height)
})

describe('[Screen API]', () => {
  describe('[Injection]', () => {
    test('is injected into $q', () => {
      const wrapper = mountPlugin()
      expect(Screen).toBe(wrapper.vm.$q.screen)
    })
  })

  describe('[Props]', () => {
    describe('[(prop)width]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(Screen.width).toBeTypeOf('number')
      })

      test('is reactive', async () => {
        mountPlugin()
        expect(Screen.width).not.toBe(100)
        await setWidth(100)
        expect(Screen.width).toBe(100)
      })
    })

    describe('[(prop)height]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(Screen.height).toBeTypeOf('number')
      })

      test('is reactive', async () => {
        mountPlugin()
        expect(Screen.height).not.toBe(100)
        await setHeight(100)
        expect(Screen.height).toBe(100)
      })
    })

    describe('[(prop)name]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(['xs', 'sm', 'md', 'lg', 'xl']).toContain(Screen.name)
      })

      test('is reactive', async () => {
        mountPlugin()

        await setWidth(500)
        expect(Screen.name).toBe('xs')

        await setWidth(800)
        expect(Screen.name).toBe('sm')

        await setWidth(1200)
        expect(Screen.name).toBe('md')

        await setWidth(1600)
        expect(Screen.name).toBe('lg')

        await setWidth(2000)
        expect(Screen.name).toBe('xl')
      })
    })

    describe('[(prop)sizes]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(Screen.sizes).toStrictEqual({
          sm: expect.any(Number),
          md: expect.any(Number),
          lg: expect.any(Number),
          xl: expect.any(Number)
        })
      })
    })

    describe('[(prop)lt]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(Screen.lt).toStrictEqual({
          sm: expect.any(Boolean),
          md: expect.any(Boolean),
          lg: expect.any(Boolean),
          xl: expect.any(Boolean)
        })
      })

      test('is reactive', async () => {
        mountPlugin()

        await setWidth(500) // xs
        expect(Screen.lt).toStrictEqual({
          sm: true,
          md: true,
          lg: true,
          xl: true
        })

        await setWidth(800) // sm
        expect(Screen.lt).toStrictEqual({
          sm: false,
          md: true,
          lg: true,
          xl: true
        })

        await setWidth(1200) // md
        expect(Screen.lt).toStrictEqual({
          sm: false,
          md: false,
          lg: true,
          xl: true
        })

        await setWidth(1600) // lg
        expect(Screen.lt).toStrictEqual({
          sm: false,
          md: false,
          lg: false,
          xl: true
        })

        await setWidth(2000) // xl
        expect(Screen.lt).toStrictEqual({
          sm: false,
          md: false,
          lg: false,
          xl: false
        })
      })
    })

    describe('[(prop)gt]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(Screen.gt).toStrictEqual({
          xs: expect.any(Boolean),
          sm: expect.any(Boolean),
          md: expect.any(Boolean),
          lg: expect.any(Boolean)
        })
      })

      test('is reactive', async () => {
        mountPlugin()

        await setWidth(500) // xs
        expect(Screen.gt).toStrictEqual({
          xs: false,
          sm: false,
          md: false,
          lg: false
        })

        await setWidth(800) // sm
        expect(Screen.gt).toStrictEqual({
          xs: true,
          sm: false,
          md: false,
          lg: false
        })

        await setWidth(1200) // md
        expect(Screen.gt).toStrictEqual({
          xs: true,
          sm: true,
          md: false,
          lg: false
        })

        await setWidth(1600) // lg
        expect(Screen.gt).toStrictEqual({
          xs: true,
          sm: true,
          md: true,
          lg: false
        })

        await setWidth(2000) // xl
        expect(Screen.gt).toStrictEqual({
          xs: true,
          sm: true,
          md: true,
          lg: true
        })
      })
    })

    describe('[(prop)xs]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(Screen.xs).toBeTypeOf('boolean')
      })

      test('is reactive', async () => {
        mountPlugin()

        await setWidth(500) // xs
        expect(Screen.xs).toBe(true)

        await setWidth(800) // sm
        expect(Screen.xs).toBe(false)
      })
    })

    describe('[(prop)sm]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(Screen.sm).toBeTypeOf('boolean')
      })

      test('is reactive', async () => {
        mountPlugin()

        await setWidth(500) // xs
        expect(Screen.sm).toBe(false)

        await setWidth(800) // sm
        expect(Screen.sm).toBe(true)
      })
    })

    describe('[(prop)md]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(Screen.md).toBeTypeOf('boolean')
      })

      test('is reactive', async () => {
        mountPlugin()

        await setWidth(800) // sm
        expect(Screen.md).toBe(false)

        await setWidth(1200) // md
        expect(Screen.md).toBe(true)
      })
    })

    describe('[(prop)lg]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(Screen.lg).toBeTypeOf('boolean')
      })

      test('is reactive', async () => {
        mountPlugin()

        await setWidth(1200) // md
        expect(Screen.lg).toBe(false)

        await setWidth(1600) // lg
        expect(Screen.lg).toBe(true)
      })
    })

    describe('[(prop)xl]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(Screen.xl).toBeTypeOf('boolean')
      })

      test('is reactive', async () => {
        mountPlugin()

        await setWidth(1600) // lg
        expect(Screen.xl).toBe(false)

        await setWidth(2000) // xl
        expect(Screen.xl).toBe(true)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)setSizes]', () => {
      // Screen is a singleton, so the breakpoints set below
      // would otherwise leak into other tests
      let originalSizes = null

      afterEach(() => {
        if (originalSizes !== null) {
          Screen.setSizes(originalSizes)
          originalSizes = null
        }
      })

      test('should be callable', async () => {
        mountPlugin()

        originalSizes = { ...Screen.sizes }

        const newSizes = {
          sm: 1000,
          md: 1500,
          lg: 2000,
          xl: 2500
        }

        expect(Screen.setSizes(newSizes)).toBeUndefined()

        expect(Screen.sizes).toStrictEqual(newSizes)

        await setWidth(500)
        expect(Screen).toMatchObject({
          name: 'xs',
          xs: true,
          sm: false,
          md: false,
          lg: false,
          xl: false,
          lt: {
            sm: true,
            md: true,
            lg: true,
            xl: true
          },
          gt: {
            xs: false,
            sm: false,
            md: false,
            lg: false
          }
        })

        await setWidth(1100)
        expect(Screen).toMatchObject({
          name: 'sm',
          xs: false,
          sm: true,
          md: false,
          lg: false,
          xl: false,
          lt: {
            sm: false,
            md: true,
            lg: true,
            xl: true
          },
          gt: {
            xs: true,
            sm: false,
            md: false,
            lg: false
          }
        })

        await setWidth(1600)
        expect(Screen).toMatchObject({
          name: 'md',
          xs: false,
          sm: false,
          md: true,
          lg: false,
          xl: false,
          lt: {
            sm: false,
            md: false,
            lg: true,
            xl: true
          },
          gt: {
            xs: true,
            sm: true,
            md: false,
            lg: false
          }
        })

        await setWidth(2100)
        expect(Screen).toMatchObject({
          name: 'lg',
          xs: false,
          sm: false,
          md: false,
          lg: true,
          xl: false,
          lt: {
            sm: false,
            md: false,
            lg: false,
            xl: true
          },
          gt: {
            xs: true,
            sm: true,
            md: true,
            lg: false
          }
        })

        await setWidth(2600)
        expect(Screen).toMatchObject({
          name: 'xl',
          xs: false,
          sm: false,
          md: false,
          lg: false,
          xl: true,
          lt: {
            sm: false,
            md: false,
            lg: false,
            xl: false
          },
          gt: {
            xs: true,
            sm: true,
            md: true,
            lg: true
          }
        })
      })
    })

    describe('[(method)setDebounce]', () => {
      test('should be callable', async () => {
        mountPlugin()
        expect(Screen.setDebounce(1000)).toBeUndefined()

        let viewportChange
        try {
          // resolves when the (real) resize event reaches the page;
          // registered after setDebounce() so the Screen plugin's
          // debounced listener is triggered first
          const resizeEvt = new Promise(resolve => {
            window.visualViewport.addEventListener('resize', resolve, {
              once: true
            })
          })

          // fake timers must be active when the resize event fires
          // so that the debounce setTimeout call gets mocked
          vi.useFakeTimers()

          viewportChange = page.viewport(100, defaultViewport.height)
          await resizeEvt

          expect(Screen.width).not.toBe(100)
          vi.advanceTimersByTime(999)
          expect(Screen.width).not.toBe(100)
          vi.advanceTimersByTime(1)
          expect(Screen.width).toBe(100)
        } finally {
          vi.useRealTimers()
          Screen.setDebounce(16) // restore the plugin's default
          await viewportChange
        }
      })
    })
  })
})
