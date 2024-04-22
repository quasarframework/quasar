import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import Screen from './Screen.js'

const mountPlugin = () => mount({ template: '<div />' })

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.restoreAllMocks()
})

function setWidth (width) {
  window.innerWidth = width
  window.dispatchEvent(new Event('resize'))
  vi.runAllTimers()
}

function setHeight (height) {
  window.innerHeight = height
  window.dispatchEvent(new Event('resize'))
  vi.runAllTimers()
}

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

      test('is reactive', () => {
        mountPlugin()
        expect(Screen.width).not.toBe(100)
        setWidth(100)
        vi.runAllTimers()
        expect(Screen.width).toBe(100)
      })
    })

    describe('[(prop)height]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(Screen.height).toBeTypeOf('number')
      })

      test('is reactive', () => {
        mountPlugin()
        expect(Screen.height).not.toBe(100)
        setHeight(100)
        expect(Screen.height).toBe(100)
      })
    })

    describe('[(prop)name]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect([ 'xs', 'sm', 'md', 'lg', 'xl' ]).toContain(Screen.name)
      })

      test('is reactive', () => {
        mountPlugin()

        setWidth(500)
        expect(Screen.name).toBe('xs')

        setWidth(800)
        expect(Screen.name).toBe('sm')

        setWidth(1200)
        expect(Screen.name).toBe('md')

        setWidth(1600)
        expect(Screen.name).toBe('lg')

        setWidth(2000)
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

      test('is reactive', () => {
        mountPlugin()

        setWidth(500) // xs
        expect(Screen.lt).toStrictEqual({
          sm: true,
          md: true,
          lg: true,
          xl: true
        })

        setWidth(800) // sm
        expect(Screen.lt).toStrictEqual({
          sm: false,
          md: true,
          lg: true,
          xl: true
        })

        setWidth(1200) // md
        expect(Screen.lt).toStrictEqual({
          sm: false,
          md: false,
          lg: true,
          xl: true
        })

        setWidth(1600) // lg
        expect(Screen.lt).toStrictEqual({
          sm: false,
          md: false,
          lg: false,
          xl: true
        })

        setWidth(2000) // xl
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

      test('is reactive', () => {
        mountPlugin()

        setWidth(500) // xs
        expect(Screen.gt).toStrictEqual({
          xs: false,
          sm: false,
          md: false,
          lg: false
        })

        setWidth(800) // sm
        expect(Screen.gt).toStrictEqual({
          xs: true,
          sm: false,
          md: false,
          lg: false
        })

        setWidth(1200) // md
        expect(Screen.gt).toStrictEqual({
          xs: true,
          sm: true,
          md: false,
          lg: false
        })

        setWidth(1600) // lg
        expect(Screen.gt).toStrictEqual({
          xs: true,
          sm: true,
          md: true,
          lg: false
        })

        setWidth(2000) // xl
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

      test('is reactive', () => {
        mountPlugin()

        setWidth(500) // xs
        expect(Screen.xs).toBe(true)

        setWidth(800) // sm
        expect(Screen.xs).toBe(false)
      })
    })

    describe('[(prop)sm]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(Screen.sm).toBeTypeOf('boolean')
      })

      test('is reactive', () => {
        mountPlugin()

        setWidth(500) // xs
        expect(Screen.sm).toBe(false)

        setWidth(800) // sm
        expect(Screen.sm).toBe(true)
      })
    })

    describe('[(prop)md]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(Screen.md).toBeTypeOf('boolean')
      })

      test('is reactive', () => {
        mountPlugin()

        setWidth(800) // sm
        expect(Screen.md).toBe(false)

        setWidth(1200) // md
        expect(Screen.md).toBe(true)
      })
    })

    describe('[(prop)lg]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(Screen.lg).toBeTypeOf('boolean')
      })

      test('is reactive', () => {
        mountPlugin()

        setWidth(1200) // md
        expect(Screen.lg).toBe(false)

        setWidth(1600) // lg
        expect(Screen.lg).toBe(true)
      })
    })

    describe('[(prop)xl]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(Screen.xl).toBeTypeOf('boolean')
      })

      test('is reactive', () => {
        mountPlugin()

        setWidth(1600) // lg
        expect(Screen.xl).toBe(false)

        setWidth(2000) // xl
        expect(Screen.xl).toBe(true)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)setSizes]', () => {
      test('should be callable', () => {
        mountPlugin()

        const newSizes = {
          sm: 10,
          md: 15,
          lg: 20,
          xl: 25
        }

        expect(
          Screen.setSizes(newSizes)
        ).toBeUndefined()

        expect(
          Screen.sizes
        ).toStrictEqual(newSizes)

        setWidth(5)
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

        setWidth(11)
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

        setWidth(16)
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

        setWidth(21)
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

        setWidth(26)
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
      test('should be callable', () => {
        mountPlugin()
        expect(
          Screen.setDebounce(1000)
        ).toBeUndefined()

        window.innerWidth = 100
        window.dispatchEvent(new Event('resize'))

        expect(Screen.width).not.toBe(100)
        vi.advanceTimersByTime(999)
        expect(Screen.width).not.toBe(100)
        vi.advanceTimersByTime(1)
        expect(Screen.width).toBe(100)
      })
    })
  })
})
