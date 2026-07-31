import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import QSlideItem from './QSlideItem.js'

const sideGesture = {
  bottom: {
    direction: 'up',
    distance: { x: 0, y: 140 },
    offset: { x: 0, y: -140 }
  },
  left: {
    direction: 'right',
    distance: { x: 140, y: 0 },
    offset: { x: 140, y: 0 }
  },
  right: {
    direction: 'left',
    distance: { x: 140, y: 0 },
    offset: { x: -140, y: 0 }
  },
  top: {
    direction: 'down',
    distance: { x: 0, y: 140 },
    offset: { x: 0, y: 140 }
  }
}

function mountSlideItem(props = {}, slots = {}) {
  return mount(QSlideItem, {
    props,
    slots
  })
}

function mountSide(side, props = {}) {
  return mountSlideItem(props, {
    default: () => 'Item content',
    [side]: () => `${side} action`
  })
}

function completeSlide(wrapper, side) {
  const actionContent = wrapper.get(`.q-slide-item__${side} > div`)
  actionContent.element.getBoundingClientRect = () => ({
    height: 100,
    width: 100
  })

  const content = wrapper.get('.q-slide-item__content')
  const handler = content.element.__qtouchpan.handler
  const gesture = sideGesture[side]

  handler({ ...gesture, isFirst: true })
  handler({
    ...gesture,
    isFinal: false,
    isFirst: false
  })
  handler({ isFinal: true, isFirst: false })
  vi.advanceTimersByTime(230)
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('[QSlideItem API]', () => {
  describe('[Props]', () => {
    describe('[(prop)left-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountSide('left', { leftColor: 'primary' })

        expect(wrapper.get('.q-slide-item__left').classes()).toContain(
          'bg-primary'
        )
      })
    })

    describe('[(prop)right-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountSide('right', { rightColor: 'secondary' })

        expect(wrapper.get('.q-slide-item__right').classes()).toContain(
          'bg-secondary'
        )
      })
    })

    describe('[(prop)top-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountSide('top', { topColor: 'positive' })

        expect(wrapper.get('.q-slide-item__top').classes()).toContain(
          'bg-positive'
        )
      })
    })

    describe('[(prop)bottom-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountSide('bottom', { bottomColor: 'negative' })

        expect(wrapper.get('.q-slide-item__bottom').classes()).toContain(
          'bg-negative'
        )
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountSlideItem({ dark: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-slide-item--dark', 'q-dark'])
        )
      })

      test('type null has effect', async () => {
        const wrapper = mountSlideItem({ dark: null })
        wrapper.vm.$q.dark.set(false)
        await nextTick()

        expect(wrapper.classes()).not.toContain('q-slide-item--dark')

        wrapper.vm.$q.dark.set(true)
        await nextTick()

        expect(wrapper.classes()).toContain('q-slide-item--dark')

        wrapper.vm.$q.dark.set(false)
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const wrapper = mountSlideItem({}, { default: () => 'Item content' })

        expect(wrapper.get('.q-slide-item__content').text()).toBe(
          'Item content'
        )
      })
    })

    describe('[(slot)left]', () => {
      test('renders the content', () => {
        const wrapper = mountSide('left')

        expect(wrapper.get('.q-slide-item__left').text()).toBe('left action')
      })
    })

    describe('[(slot)right]', () => {
      test('renders the content', () => {
        const wrapper = mountSide('right')

        expect(wrapper.get('.q-slide-item__right').text()).toBe('right action')
      })
    })

    describe('[(slot)top]', () => {
      test('renders the content', () => {
        const wrapper = mountSide('top')

        expect(wrapper.get('.q-slide-item__top').text()).toBe('top action')
      })
    })

    describe('[(slot)bottom]', () => {
      test('renders the content', () => {
        const wrapper = mountSide('bottom')

        expect(wrapper.get('.q-slide-item__bottom').text()).toBe(
          'bottom action'
        )
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)left]', () => {
      test('is emitting', () => {
        const wrapper = mountSide('left')

        completeSlide(wrapper, 'left')

        expect(wrapper.emitted('left')).toEqual([
          [{ reset: expect.any(Function) }]
        ])
      })
    })

    describe('[(event)right]', () => {
      test('is emitting', () => {
        const wrapper = mountSide('right')

        completeSlide(wrapper, 'right')

        expect(wrapper.emitted('right')).toEqual([
          [{ reset: expect.any(Function) }]
        ])
      })
    })

    describe('[(event)top]', () => {
      test('is emitting', () => {
        const wrapper = mountSide('top')

        completeSlide(wrapper, 'top')

        expect(wrapper.emitted('top')).toEqual([
          [{ reset: expect.any(Function) }]
        ])
      })
    })

    describe('[(event)bottom]', () => {
      test('is emitting', () => {
        const wrapper = mountSide('bottom')

        completeSlide(wrapper, 'bottom')

        expect(wrapper.emitted('bottom')).toEqual([
          [{ reset: expect.any(Function) }]
        ])
      })
    })

    describe('[(event)slide]', () => {
      test('is emitting', () => {
        const wrapper = mountSide('left', { onSlide: () => {} })

        completeSlide(wrapper, 'left')

        expect(wrapper.emitted('slide')[0]).toEqual([
          {
            isReset: false,
            ratio: 1,
            side: 'left'
          }
        ])
      })
    })

    describe('[(event)action]', () => {
      test('is emitting', () => {
        const wrapper = mountSide('left')

        completeSlide(wrapper, 'left')

        expect(wrapper.emitted('action')).toEqual([
          [
            {
              reset: expect.any(Function),
              side: 'left'
            }
          ]
        ])
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)reset]', () => {
      test('should be callable', () => {
        const wrapper = mountSlideItem()
        const content = wrapper.get('.q-slide-item__content')
        content.element.style.transform = 'translateX(100%)'

        expect(wrapper.vm.reset()).toBeUndefined()
        expect(content.$style('transform')).toBe('translate(0,0)')
      })
    })
  })
})
