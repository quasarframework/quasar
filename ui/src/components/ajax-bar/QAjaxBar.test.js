import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'

import QAjaxBar from './QAjaxBar.js'

function mountAjaxBar(props = {}) {
  return mount(QAjaxBar, {
    props: {
      skipHijack: true,
      ...props
    }
  })
}

function expectPosition(position) {
  const wrapper = mountAjaxBar({ position })

  expect(wrapper.classes()).toContain(`q-loading-bar--${position}`)
}

describe('[QAjaxBar API]', () => {
  describe('[Props]', () => {
    describe('[(prop)position]', () => {
      test('value "top" has effect', () => {
        expectPosition('top')
      })

      test('value "right" has effect', () => {
        expectPosition('right')
      })

      test('value "bottom" has effect', () => {
        expectPosition('bottom')
      })

      test('value "left" has effect', () => {
        expectPosition('left')
      })
    })

    describe('[(prop)size]', () => {
      test('type String has effect', () => {
        const wrapper = mountAjaxBar({
          position: 'right',
          size: '4px'
        })

        expect(wrapper.attributes('style')).toContain('width: 4px')
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const wrapper = mountAjaxBar({ color: 'primary' })

        expect(wrapper.classes()).toContain('bg-primary')
      })
    })

    describe('[(prop)reverse]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountAjaxBar({ reverse: true })

        expect(wrapper.attributes('style')).toContain(
          'translate3d(100%,-200%,0)'
        )
      })
    })

    describe('[(prop)skip-hijack]', () => {
      test('type Boolean has effect', () => {
        const originalOpen = XMLHttpRequest.prototype.open
        const wrapper = mount(QAjaxBar, {
          props: { skipHijack: true }
        })

        expect(XMLHttpRequest.prototype.open).toBe(originalOpen)
        wrapper.unmount()
      })
    })

    describe('[(prop)hijack-filter]', () => {
      test('type Function has effect', () => {
        const hijackFilter = vi.fn(() => false)
        const wrapper = mount(QAjaxBar, {
          props: { hijackFilter }
        })
        const request = new XMLHttpRequest()

        request.open('GET', '/ignored')
        request.dispatchEvent(new Event('loadstart'))

        expect(hijackFilter).toHaveBeenCalledWith('/ignored')
        expect(wrapper.emitted()).not.toHaveProperty('start')

        wrapper.unmount()
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)start]', () => {
      test('is emitting', () => {
        const wrapper = mountAjaxBar()

        wrapper.vm.start(0)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('start')
        expect(eventList.start).toHaveLength(1)
        expect(eventList.start[0]).toHaveLength(0)
      })
    })

    describe('[(event)stop]', () => {
      test('is emitting', () => {
        const wrapper = mountAjaxBar()

        wrapper.vm.start(0)
        wrapper.vm.stop()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('stop')
        expect(eventList.stop).toHaveLength(1)
        expect(eventList.stop[0]).toHaveLength(0)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)start]', () => {
      test('should be callable', async () => {
        const wrapper = mountAjaxBar()

        expect(wrapper.vm.start(0)).toBe(1)
        await nextTick()

        expect(wrapper.attributes('role')).toBe('progressbar')
        expect(wrapper.attributes('aria-valuenow')).toBe('0')
      })
    })

    describe('[(method)increment]', () => {
      test('should be callable', async () => {
        const wrapper = mountAjaxBar()

        wrapper.vm.start(0)
        expect(wrapper.vm.increment(10)).toBe(1)
        await nextTick()

        expect(wrapper.attributes('aria-valuenow')).toBe('10')
      })
    })

    describe('[(method)stop]', () => {
      test('should be callable', async () => {
        const wrapper = mountAjaxBar()

        wrapper.vm.start(0)
        wrapper.vm.increment(10)
        expect(wrapper.vm.stop()).toBe(0)
        await nextTick()

        expect(wrapper.attributes('aria-valuenow')).toBe('100')
      })
    })
  })
})
