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

        expect(stationaryMedia.style.transform).toContain(', 0px, 0px)')
        expect(movingMedia.style.transform).not.toBe(
          stationaryMedia.style.transform
        )
      })
    })

    describe('[(prop)scroll-target]', () => {
      // the target defines the container box the scroll percentage is
      // computed against; the default (the whole viewport) is much
      // taller than the 200px target, so the parallax offset differs
      function transformWith(props) {
        const wrapper = mount(QParallax, { props: { height: 100, ...props } })
        const transform = updateMedia(wrapper).style.transform
        wrapper.unmount()
        return transform
      }

      function styleTarget(target) {
        Object.assign(target.style, {
          position: 'fixed',
          top: '0px',
          width: '100px',
          height: '200px'
        })
      }

      test('type Element has effect', () => {
        const target = createScrollTarget()
        styleTarget(target)

        expect(transformWith({ scrollTarget: target })).not.toBe(
          transformWith({})
        )
      })

      test('type String has effect', () => {
        const target = createScrollTarget('parallax-scroll-target')
        styleTarget(target)

        expect(
          transformWith({ scrollTarget: '#parallax-scroll-target' })
        ).not.toBe(transformWith({}))
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

  describe('[Generic]', () => {
    test('updates on a scroll from any container, none designated', () => {
      const wrapper = mount(QParallax, { props: { height: 100 } })
      const media = updateMedia(wrapper)
      const before = media.style.transform

      // the parallax box has moved (some ancestor scrolled) by the time
      // a scroll comes in from a container the component never saw
      wrapper.get('.q-parallax').element.getBoundingClientRect = () => ({
        top: 200,
        left: 0,
        right: 100,
        bottom: 300,
        width: 100,
        height: 100
      })

      const container = createScrollTarget()
      container.dispatchEvent(new Event('scroll'))
      vi.advanceTimersToNextFrame()

      expect(media.style.transform).not.toBe(before)
      wrapper.unmount()
    })
  })
})
