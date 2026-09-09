import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import QSlideTransition from './QSlideTransition.js'

// the test browser is a Chromium, so the slide runs on a Web Animation
// by default; flipping this flag before mounting forces the measuring
// CSS transition of non-supporting browsers instead
const engineOverride = vi.hoisted(() => ({ forceMeasured: false }))

vi.mock(
  '../../composables/private.use-slide-transition/use-slide-transition.js',
  async importOriginal => {
    const mod = await importOriginal()
    return {
      ...mod,
      default: (...args) =>
        (engineOverride.forceMeasured ? mod.createMeasuredSlide : mod.default)(
          ...args
        )
    }
  }
)

const engines = [
  ['Web Animation', false],
  ['measured transition', true]
]

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

function expectSliding(content, duration) {
  if (engineOverride.forceMeasured) {
    expect(content.$style('transition')).toContain(`height ${duration}ms`)
  } else {
    const [animation] = content.element.getAnimations()
    expect(animation.effect.getTiming().duration).toBe(duration)
  }
}

function expectSettled(content) {
  expect(content.element.getAnimations()).toHaveLength(0)
  expect(content.$style('height')).toBe('')
  expect(content.$style('transition')).toBe('')
  expect(content.$style('overflow-y')).toBe('')
}

describe('[QSlideTransition API]', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    engineOverride.forceMeasured = false
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
      test.each(engines)(
        'type Number has effect (%s)',
        async (_, forceMeasured) => {
          engineOverride.forceMeasured = forceMeasured

          const { wrapper } = mountTransition({
            duration: 450,
            visible: false
          })

          await wrapper.setData({ visible: true })

          expectSliding(wrapper.get('.content'), 450)
        }
      )
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
    describe.each(engines)('%s', (_, forceMeasured) => {
      beforeEach(() => {
        engineOverride.forceMeasured = forceMeasured
      })

      test('starts the height animation in the same frame', async () => {
        const { wrapper } = mountTransition({ visible: false })

        await wrapper.setData({ visible: true })

        // the slide is applied synchronously by the enter hook -- no
        // timer has run yet
        const content = wrapper.get('.content')
        expectSliding(content, 300)
        expect(content.$style('overflow-y')).toBe('hidden')

        if (forceMeasured) {
          // the (non-zero) target height is the measured content height
          expect(content.$style('height')).toMatch(/^[1-9]\d*px$/)
        }
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

        expectSettled(wrapper.get('.content'))

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

        expectSettled(wrapper.get('.content'))
      })

      test('does not animate the initial render without appear', async () => {
        const { wrapper, transition } = mountTransition({ visible: true })

        await vi.runAllTimersAsync()

        expect(transition.emitted('show')).toBeUndefined()
        expectSettled(wrapper.get('.content'))
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
