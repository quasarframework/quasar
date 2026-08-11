import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import QSlideTransition from './QSlideTransition.js'

function mountTransition({
  appear = false,
  duration = 300,
  visible = true
} = {}) {
  const wrapper = mount(
    defineComponent({
      props: {
        appear: Boolean,
        duration: Number
      },
      data: () => ({ visible }),
      render() {
        return h(
          QSlideTransition,
          { appear: this.appear, duration: this.duration },
          () =>
            this.visible === true
              ? h('div', { class: 'content' }, 'content')
              : null
        )
      }
    }),
    {
      props: { appear, duration },
      global: {
        stubs: {
          transition: false
        }
      }
    }
  )

  return {
    wrapper,
    transition: wrapper.getComponent(QSlideTransition)
  }
}

describe('[QSlideTransition API]', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('[Props]', () => {
    describe('[(prop)appear]', () => {
      test('type Boolean has effect', async () => {
        const { transition } = mountTransition({ appear: true })

        await vi.runAllTimersAsync()

        expect(transition.emitted('show')).toHaveLength(1)
      })
    })

    describe('[(prop)duration]', () => {
      test('type Number has effect', async () => {
        const { wrapper } = mountTransition({
          duration: 450,
          visible: false
        })

        await wrapper.setData({ visible: true })

        expect(wrapper.get('.content').$style('transition')).toContain('450ms')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QSlideTransition, {
          slots: {
            default: () => `<div>${slotContent}</div>`
          }
        })

        expect(wrapper.html()).toContain(slotContent)
      })
    })
  })

  describe('[Generic]', () => {
    test('starts the height animation in the same frame', async () => {
      const { wrapper } = mountTransition({ visible: false })

      await wrapper.setData({ visible: true })

      // the (non-zero) target height and the transition are applied
      // synchronously by the enter hook -- no timer has run yet
      const content = wrapper.get('.content')
      expect(content.$style('height')).toMatch(/^[1-9]\d*px$/)
      expect(content.$style('transition')).toContain('height')
    })

    test('settles immediately with a zero duration', async () => {
      const { wrapper, transition } = mountTransition({
        visible: false,
        duration: 0
      })

      await wrapper.setData({ visible: true })

      // no layout read, no timers -- the event arrives synchronously
      expect(transition.emitted('show')).toHaveLength(1)
      expect(vi.getTimerCount()).toBe(0)

      const content = wrapper.get('.content')
      expect(content.$style('height')).toBe('')
      expect(content.$style('transition')).toBe('')

      await wrapper.setData({ visible: false })

      expect(transition.emitted('hide')).toHaveLength(1)
      expect(vi.getTimerCount()).toBe(0)
    })

    test('emits nothing when an interrupted slide returns to its origin', async () => {
      const { wrapper, transition } = mountTransition({ visible: false })

      await wrapper.setData({ visible: true })
      vi.advanceTimersByTime(100)

      // interrupt the enter halfway through: hidden -> hidden overall
      await wrapper.setData({ visible: false })
      await vi.runAllTimersAsync()

      expect(transition.emitted('show')).toBeUndefined()
      expect(transition.emitted('hide')).toBeUndefined()
      expect(wrapper.find('.content').exists()).toBe(false)
    })

    test('cleans up the inline styles once the slide completes', async () => {
      const { wrapper, transition } = mountTransition({ visible: false })

      await wrapper.setData({ visible: true })
      await vi.runAllTimersAsync()

      expect(transition.emitted('show')).toHaveLength(1)

      const content = wrapper.get('.content')
      expect(content.$style('height')).toBe('')
      expect(content.$style('transition')).toBe('')
      expect(content.$style('overflow-y')).toBe('')
    })

    test('does not animate the initial render without appear', async () => {
      const { wrapper, transition } = mountTransition({ visible: true })

      await vi.runAllTimersAsync()

      expect(transition.emitted('show')).toBeUndefined()
      expect(wrapper.get('.content').$style('transition')).toBe('')
    })
  })

  describe('[Events]', () => {
    describe('[(event)show]', () => {
      test('is emitting', async () => {
        const { wrapper, transition } = mountTransition({ visible: false })

        await wrapper.setData({ visible: true })
        await vi.runAllTimersAsync()

        expect(transition.emitted('show')).toStrictEqual([[]])
      })
    })

    describe('[(event)hide]', () => {
      test('is emitting', async () => {
        const { wrapper, transition } = mountTransition()

        await wrapper.setData({ visible: false })
        await vi.runAllTimersAsync()

        expect(transition.emitted('hide')).toStrictEqual([[]])
      })
    })
  })
})
