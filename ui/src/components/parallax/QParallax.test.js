import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import QParallax from './QParallax.js'

const targets = []

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('IntersectionObserver', void 0)
})

afterEach(() => {
  targets.splice(0).forEach(target => target.remove())
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

function createScrollTarget(id) {
  const target = document.createElement('div')
  if (id !== void 0) target.id = id
  document.body.append(target)
  targets.push(target)
  return target
}

function updateMedia(wrapper, naturalHeight = 300) {
  const root = wrapper.get('.q-parallax').element
  const media = wrapper.get('.q-parallax__media > *').element

  root.getBoundingClientRect = () => ({
    top: 0,
    left: 0,
    right: 100,
    bottom: 100,
    width: 100,
    height: 100
  })

  Object.defineProperty(media, 'naturalHeight', {
    configurable: true,
    value: naturalHeight
  })

  media.dispatchEvent(new Event('load'))
  vi.advanceTimersToNextFrame()

  return media
}

describe('[QParallax API]', () => {
  describe('[Props]', () => {
    describe('[(prop)src]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QParallax, {
          props: { src: 'https://example.test/background.png' }
        })

        expect(wrapper.get('.q-parallax__media img').attributes('src')).toBe(
          'https://example.test/background.png'
        )
      })
    })

    describe('[(prop)height]', () => {
      test('type Number has effect', () => {
        const wrapper = mount(QParallax, {
          props: { height: 320 }
        })

        expect(wrapper.attributes('style')).toContain('height: 320px')
      })
    })

    describe('[(prop)speed]', () => {
      test('type Number has effect', () => {
        const stationary = mount(QParallax, {
          props: {
            height: 100,
            speed: 0
          }
        })
        const moving = mount(QParallax, {
          props: {
            height: 100,
            speed: 1
          }
        })

        const stationaryMedia = updateMedia(stationary)
        const movingMedia = updateMedia(moving)

        expect(stationaryMedia.style.transform).toContain(',0px,0)')
        expect(movingMedia.style.transform).not.toBe(
          stationaryMedia.style.transform
        )
      })
    })

    describe('[(prop)scroll-target]', () => {
      test('type Element has effect', () => {
        const target = createScrollTarget()
        const addEventListener = vi.spyOn(target, 'addEventListener')

        mount(QParallax, {
          props: { scrollTarget: target }
        })

        expect(addEventListener).toHaveBeenCalledWith(
          'scroll',
          expect.any(Function),
          expect.anything()
        )
      })

      test('type String has effect', () => {
        const target = createScrollTarget('parallax-scroll-target')
        const addEventListener = vi.spyOn(target, 'addEventListener')

        mount(QParallax, {
          props: { scrollTarget: '#parallax-scroll-target' }
        })

        expect(addEventListener).toHaveBeenCalledWith(
          'scroll',
          expect.any(Function),
          expect.anything()
        )
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Parallax content'
        const wrapper = mount(QParallax, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.get('.q-parallax__content').text()).toBe(slotContent)
      })
    })

    describe('[(slot)media]', () => {
      test('renders the content', () => {
        const wrapper = mount(QParallax, {
          slots: {
            media: () => h('video', { 'data-test': 'custom-media' })
          }
        })

        expect(wrapper.find('[data-test="custom-media"]').exists()).toBe(true)
      })
    })

    describe('[(slot)content]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'Scoped parallax content'
        const wrapper = mount(QParallax, {
          slots: {
            content: scope => {
              slotScope = scope
              return slotContent
            }
          }
        })

        expect(wrapper.get('.q-parallax__content').text()).toBe(slotContent)
        expect(slotScope).toStrictEqual({
          percentScrolled: expect.any(Number)
        })
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)scroll]', () => {
      test('is emitting', () => {
        const wrapper = mount(QParallax, {
          props: { onScroll: () => {} }
        })

        updateMedia(wrapper)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('scroll')
        expect(eventList.scroll).toHaveLength(1)

        const [percentage] = eventList.scroll[0]
        expect(percentage).toBeTypeOf('number')
      })
    })
  })
})
