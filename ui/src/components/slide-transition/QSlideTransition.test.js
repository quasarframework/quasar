import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import QSlideTransition from './QSlideTransition.js'

function mountTransition({
  appear = false,
  duration = 300,
  visible = true
} = {}) {
  const wrapper = mount(
    defineComponent({
      components: { QSlideTransition },
      props: {
        appear: Boolean,
        duration: Number
      },
      data: () => ({ visible }),
      template: `
        <QSlideTransition :appear :duration>
          <div v-if="visible" class="content">content</div>
        </QSlideTransition>
      `
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
