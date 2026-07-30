import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import { getMainEvent } from 'testing/runtime/directive.js'

import QPullToRefresh from './QPullToRefresh.js'

function mountPullToRefresh(props = {}, slots = {}) {
  return mount(QPullToRefresh, {
    props,
    slots
  })
}

function getPanContext(wrapper) {
  return wrapper.get('.q-pull-to-refresh').element.__qtouchpan
}

function startPull(wrapper) {
  return getPanContext(wrapper).handler({
    direction: 'down',
    distance: { x: 0, y: 30 },
    evt: new Event('touchmove', { cancelable: true }),
    isFirst: true
  })
}

describe('[QPullToRefresh API]', () => {
  describe('[Props]', () => {
    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const wrapper = mountPullToRefresh({ color: 'primary' })

        expect(wrapper.get('.q-icon').classes()).toContain('text-primary')
      })
    })

    describe('[(prop)bg-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountPullToRefresh({ bgColor: 'primary' })

        expect(wrapper.get('.q-pull-to-refresh__puller').classes()).toContain(
          'bg-primary'
        )
      })
    })

    describe('[(prop)icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountPullToRefresh({ icon: 'map' })

        expect(wrapper.get('.q-icon').text()).toBe('map')
      })
    })

    describe('[(prop)no-mouse]', () => {
      test('type Boolean has effect', () => {
        const withMouse = mountPullToRefresh()
        const withoutMouse = mountPullToRefresh({ noMouse: true })

        expect(
          getMainEvent(getPanContext(withMouse), 'mousedown')
        ).toBeDefined()
        expect(
          getMainEvent(getPanContext(withoutMouse), 'mousedown')
        ).toBeUndefined()
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountPullToRefresh({ disable: true })

        expect(getPanContext(wrapper)).toBeUndefined()
      })
    })

    describe('[(prop)scroll-target]', () => {
      test('type Element has effect', async () => {
        const scrollTarget = document.createElement('div')
        scrollTarget.scrollTop = 10
        document.body.append(scrollTarget)

        const wrapper = mountPullToRefresh({ scrollTarget })
        await nextTick()

        expect(startPull(wrapper)).toBe(false)
        expect(
          wrapper.get('.q-pull-to-refresh__content').classes()
        ).not.toContain('no-pointer-events')

        wrapper.unmount()
        scrollTarget.remove()
      })

      test('type String has effect', async () => {
        const scrollTarget = document.createElement('div')
        scrollTarget.className = 'pull-scroll-target'
        scrollTarget.scrollTop = 10
        document.body.append(scrollTarget)

        const wrapper = mountPullToRefresh({
          scrollTarget: '.pull-scroll-target'
        })
        await nextTick()

        expect(startPull(wrapper)).toBe(false)
        expect(
          wrapper.get('.q-pull-to-refresh__content').classes()
        ).not.toContain('no-pointer-events')

        wrapper.unmount()
        scrollTarget.remove()
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const wrapper = mountPullToRefresh(
          {},
          { default: () => 'Refreshable content' }
        )

        expect(wrapper.get('.q-pull-to-refresh__content').text()).toBe(
          'Refreshable content'
        )
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)refresh]', () => {
      test('is emitting', () => {
        const wrapper = mountPullToRefresh()

        wrapper.vm.trigger()

        expect(wrapper.emitted('refresh')).toHaveLength(1)
        expect(wrapper.emitted('refresh')[0][0]).toBeTypeOf('function')
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)trigger]', () => {
      test('should be callable', () => {
        const wrapper = mountPullToRefresh()

        expect(wrapper.vm.trigger()).toBeUndefined()
        expect(wrapper.emitted('refresh')).toHaveLength(1)
      })
    })

    describe('[(method)updateScrollTarget]', () => {
      test('should be callable', () => {
        const scrollTarget = document.createElement('div')
        scrollTarget.scrollTop = 10
        document.body.append(scrollTarget)

        const wrapper = mountPullToRefresh({ scrollTarget })

        expect(wrapper.vm.updateScrollTarget()).toBeUndefined()
        expect(startPull(wrapper)).toBe(false)

        wrapper.unmount()
        scrollTarget.remove()
      })
    })
  })
})
