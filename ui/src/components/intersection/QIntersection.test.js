import { Transition, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import QIntersection from './QIntersection.js'

let observers

beforeEach(() => {
  observers = []

  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback, options) {
        this.callback = callback
        this.options = options
        this.observe = vi.fn()
        this.unobserve = vi.fn()
        this.disconnect = vi.fn()
        observers.push(this)
      }
    }
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function show(observer = observers[0]) {
  observer.callback([
    {
      isIntersecting: true,
      rootBounds: {}
    }
  ])
}

describe('[QIntersection API]', () => {
  describe('[Props]', () => {
    describe('[(prop)tag]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QIntersection, {
          props: {
            disable: true,
            tag: 'section'
          }
        })

        expect(wrapper.element.tagName).toBe('SECTION')
      })
    })

    describe('[(prop)once]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QIntersection, {
          props: { once: true },
          slots: { default: () => 'Visible content' }
        })

        show()
        await nextTick()

        expect(wrapper.text()).toBe('Visible content')
        expect(observers[0].disconnect).toHaveBeenCalledOnce()
      })
    })

    describe('[(prop)ssr-prerender]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QIntersection, {
          props: { ssrPrerender: true },
          slots: { hidden: () => 'Hydrated hidden content' }
        })

        expect(wrapper.text()).toBe('Hydrated hidden content')
        expect(observers).toHaveLength(1)
      })
    })

    describe('[(prop)root]', () => {
      test('type Element has effect', () => {
        const root = document.createElement('div')

        mount(QIntersection, {
          props: { root }
        })

        expect(observers[0].options.root).toBe(root)
      })

      test('type null has effect', () => {
        mount(QIntersection, {
          props: { root: null }
        })

        expect(observers[0].options.root).toBeNull()
      })
    })

    describe('[(prop)margin]', () => {
      test('type String has effect', () => {
        mount(QIntersection, {
          props: { margin: '-20px 0px' }
        })

        expect(observers[0].options.rootMargin).toBe('-20px 0px')
      })
    })

    describe('[(prop)threshold]', () => {
      test('type Array has effect', () => {
        const threshold = [0, 0.25, 0.5, 0.75, 1]

        mount(QIntersection, {
          props: { threshold }
        })

        expect(observers[0].options.threshold).toStrictEqual(threshold)
      })

      test('type Number has effect', () => {
        mount(QIntersection, {
          props: { threshold: 1 }
        })

        expect(observers[0].options.threshold).toBe(1)
      })
    })

    describe('[(prop)transition]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QIntersection, {
          props: { transition: 'fade' },
          slots: { hidden: () => 'Hidden content' }
        })

        expect(wrapper.getComponent(Transition).props('name')).toBe(
          'q-transition--fade'
        )
      })
    })

    describe('[(prop)transition-duration]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QIntersection, {
          props: {
            disable: true,
            transitionDuration: '450'
          },
          slots: { hidden: () => 'Hidden content' }
        })

        expect(
          wrapper.get('.q-intersection > div').attributes('style')
        ).toContain('--q-transition-duration: 450ms')
      })

      test('type Number has effect', () => {
        const wrapper = mount(QIntersection, {
          props: {
            disable: true,
            transitionDuration: 300
          },
          slots: { hidden: () => 'Hidden content' }
        })

        expect(
          wrapper.get('.q-intersection > div').attributes('style')
        ).toContain('--q-transition-duration: 300ms')
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QIntersection, {
          props: { disable: true },
          slots: { hidden: () => 'Hidden content' }
        })

        expect(wrapper.text()).toBe('Hidden content')
        expect(observers).toHaveLength(0)
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', async () => {
        const wrapper = mount(QIntersection, {
          slots: { default: () => 'Visible content' }
        })

        show()
        await nextTick()

        expect(wrapper.text()).toBe('Visible content')
      })
    })

    describe('[(slot)hidden]', () => {
      test('renders the content', () => {
        const wrapper = mount(QIntersection, {
          slots: { hidden: () => 'Hidden content' }
        })

        expect(wrapper.text()).toBe('Hidden content')
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)visibility]', () => {
      test('is emitting', () => {
        const wrapper = mount(QIntersection, {
          props: { onVisibility: () => {} }
        })

        show()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('visibility')
        expect(eventList.visibility).toHaveLength(1)

        const [isVisible] = eventList.visibility[0]
        expect(isVisible).toBe(true)
      })
    })
  })
})
