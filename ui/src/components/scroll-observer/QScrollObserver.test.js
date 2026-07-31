import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'

import QScrollObserver from './QScrollObserver.js'

const targets = []

afterEach(() => {
  targets.splice(0).forEach(target => target.remove())
  vi.restoreAllMocks()
  vi.useRealTimers()
})

function createScrollTarget(id) {
  const target = document.createElement('div')
  if (id !== void 0) target.id = id
  document.body.append(target)
  targets.push(target)
  return target
}

function mountObserver(props = {}) {
  const target = createScrollTarget()
  const wrapper = mount(QScrollObserver, {
    props: {
      scrollTarget: target,
      ...props
    }
  })

  return { target, wrapper }
}

describe('[QScrollObserver API]', () => {
  describe('[Props]', () => {
    describe('[(prop)debounce]', () => {
      test('type String has effect', () => {
        vi.useFakeTimers()
        const { target, wrapper } = mountObserver({ debounce: '530' })

        target.scrollTop = 20
        target.dispatchEvent(new Event('scroll'))

        expect(wrapper.emitted()).not.toHaveProperty('scroll')

        vi.advanceTimersByTime(530)

        expect(wrapper.emitted('scroll')).toHaveLength(1)
      })

      test('type Number has effect', () => {
        const { target, wrapper } = mountObserver({ debounce: 0 })

        target.scrollTop = 20
        target.dispatchEvent(new Event('scroll'))

        expect(wrapper.emitted('scroll')).toHaveLength(1)
      })
    })

    describe('[(prop)axis]', () => {
      test('value "both" has effect', () => {
        const { target, wrapper } = mountObserver({ axis: 'both' })

        target.scrollTop = 20
        target.scrollLeft = 10
        wrapper.vm.trigger(true)

        expect(wrapper.emitted('scroll').at(-1)[0].position).toStrictEqual({
          top: 20,
          left: 10
        })
      })

      test('value "vertical" has effect', () => {
        const { target, wrapper } = mountObserver({ axis: 'vertical' })

        target.scrollLeft = 10
        wrapper.vm.trigger(true)
        expect(wrapper.emitted()).not.toHaveProperty('scroll')

        target.scrollTop = 20
        wrapper.vm.trigger(true)
        expect(wrapper.emitted('scroll')).toHaveLength(1)
      })

      test('value "horizontal" has effect', () => {
        const { target, wrapper } = mountObserver({ axis: 'horizontal' })

        target.scrollTop = 20
        wrapper.vm.trigger(true)
        expect(wrapper.emitted()).not.toHaveProperty('scroll')

        target.scrollLeft = 10
        wrapper.vm.trigger(true)
        expect(wrapper.emitted('scroll')).toHaveLength(1)
      })
    })

    describe('[(prop)scroll-target]', () => {
      test('type Element has effect', () => {
        const target = createScrollTarget()
        const addEventListener = vi.spyOn(target, 'addEventListener')

        mount(QScrollObserver, {
          props: { scrollTarget: target }
        })

        expect(addEventListener).toHaveBeenCalledWith(
          'scroll',
          expect.any(Function),
          expect.anything()
        )
      })

      test('type String has effect', () => {
        const target = createScrollTarget('scroll-observer-target')
        const addEventListener = vi.spyOn(target, 'addEventListener')

        mount(QScrollObserver, {
          props: { scrollTarget: '#scroll-observer-target' }
        })

        expect(addEventListener).toHaveBeenCalledWith(
          'scroll',
          expect.any(Function),
          expect.anything()
        )
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)scroll]', () => {
      test('is emitting', () => {
        const { target, wrapper } = mountObserver({ axis: 'both' })

        target.scrollTop = 20
        target.scrollLeft = 10
        wrapper.vm.trigger(true)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('scroll')
        expect(eventList.scroll.length).toBeGreaterThanOrEqual(1)

        const [details] = eventList.scroll.at(-1)
        expect(details).toStrictEqual({
          position: {
            top: 20,
            left: 10
          },
          direction: 'down',
          directionChanged: false,
          delta: {
            top: 20,
            left: 10
          },
          inflectionPoint: {
            top: 0,
            left: 0
          }
        })
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)trigger]', () => {
      test('should be callable', () => {
        const { target, wrapper } = mountObserver()

        target.scrollTop = 20

        expect(wrapper.vm.trigger(true)).toBeUndefined()
        expect(wrapper.emitted('scroll')).toHaveLength(1)
      })
    })

    describe('[(method)getPosition]', () => {
      test('should be callable', () => {
        const { target, wrapper } = mountObserver()

        target.scrollTop = 20
        wrapper.vm.trigger(true)

        expect(wrapper.vm.getPosition()).toMatchObject({
          position: {
            top: 20,
            left: 0
          },
          direction: 'down',
          directionChanged: false,
          delta: {
            top: 20,
            left: 0
          }
        })
      })
    })
  })
})
