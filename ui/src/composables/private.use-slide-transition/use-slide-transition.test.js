import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { Transition, defineComponent, h, ref, vShow, withDirectives } from 'vue'

import useSlideTransition, {
  createMeasuredSlide,
  createNativeSlide,
  cssAutoHeightSupport
} from './use-slide-transition.js'

// a Transition fed the hooks directly, the way QStep uses them
function mountHarness({
  create = useSlideTransition,
  duration = 300,
  emit,
  keep = false,
  visible = true
} = {}) {
  const durationRef = ref(duration)
  const hooks = {}

  const wrapper = mount(
    defineComponent({
      data: () => ({ visible }),
      setup() {
        Object.assign(
          hooks,
          create(() => durationRef.value, emit)
        )
      },
      render() {
        return h(Transition, { css: false, ...hooks }, () => {
          const content = h('div', { class: 'content' }, 'content')

          return keep
            ? withDirectives(content, [[vShow, this.visible]])
            : this.visible === true
              ? content
              : null
        })
      }
    }),
    { global: { stubs: { transition: false } } }
  )

  return { wrapper, hooks, durationRef }
}

function expectSliding(create, el, duration) {
  if (create === createMeasuredSlide) {
    expect(el.style.transition).toContain(`height ${duration}ms`)
  } else {
    const [animation] = el.getAnimations()
    expect(animation.effect.getTiming().duration).toBe(duration)
  }
}

// the behavior every engine shares, defined under each engine's own
// describe (the Specs script only reads literal describe/test calls)
function defineEngineTests(create) {
  test('animates the height of the entering and leaving element', async () => {
    const { wrapper } = mountHarness({ create, visible: false })

    await wrapper.setData({ visible: true })

    const content = wrapper.get('.content').element
    expectSliding(create, content, 300)
    expect(content.style.overflowY).toBe('hidden')

    await vi.runAllTimersAsync()

    expect(content.getAnimations()).toHaveLength(0)
    expect(content.style.transition).toBe('')
    expect(content.style.height).toBe('')
    expect(content.style.overflowY).toBe('')

    await wrapper.setData({ visible: false })

    expectSliding(create, content, 300)
    expect(content.style.overflowY).toBe('hidden')
  })

  test('reads the duration at every run', async () => {
    const { wrapper, durationRef } = mountHarness({
      create,
      visible: false
    })

    await wrapper.setData({ visible: true })

    // the leaving element outlives the wrapper's view of the tree
    const content = wrapper.get('.content').element
    expectSliding(create, content, 300)

    await vi.runAllTimersAsync()

    durationRef.value = 450

    await wrapper.setData({ visible: false })

    expect(content.isConnected).toBe(true)
    expectSliding(create, content, 450)
  })

  test('reports show and hide through the given emit', async () => {
    const emit = vi.fn()
    const { wrapper } = mountHarness({ create, emit, visible: false })

    await wrapper.setData({ visible: true })
    await vi.runAllTimersAsync()

    expect(emit).toHaveBeenLastCalledWith('show')

    await wrapper.setData({ visible: false })
    await vi.runAllTimersAsync()

    expect(emit).toHaveBeenLastCalledWith('hide')
    expect(emit).toHaveBeenCalledTimes(2)
  })

  test('emits nothing when an interrupted slide returns to its origin', async () => {
    const emit = vi.fn()
    const { wrapper } = mountHarness({
      create,
      emit,
      keep: true,
      visible: false
    })

    await wrapper.setData({ visible: true })
    vi.advanceTimersByTime(100)

    // interrupt the enter halfway through: hidden -> hidden overall
    await wrapper.setData({ visible: false })
    await vi.runAllTimersAsync()

    expect(emit).not.toHaveBeenCalled()
    expect(wrapper.get('.content').element.style.display).toBe('none')
  })

  test('works without an emit', async () => {
    const { wrapper } = mountHarness({ create, visible: false })

    await wrapper.setData({ visible: true })
    await vi.runAllTimersAsync()
    await wrapper.setData({ visible: false })
    await vi.runAllTimersAsync()

    expect(wrapper.find('.content').exists()).toBe(false)
  })
}

describe('[useSlideTransition API]', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('[Variables]', () => {
    describe('[(variable)cssAutoHeightSupport]', () => {
      test('picks the Web Animation engine where calc-size() is supported', () => {
        // the test browser is a Chromium
        expect(cssAutoHeightSupport).toBe(true)
        expect(useSlideTransition).toBe(createNativeSlide)
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)createNativeSlide]', () => {
      defineEngineTests(createNativeSlide)

      test('settles on the finish event, clearing the timer fallback', async () => {
        const emit = vi.fn()
        const { wrapper } = mountHarness({
          create: createNativeSlide,
          duration: 50,
          emit,
          visible: false
        })

        await wrapper.setData({ visible: true })

        const content = wrapper.get('.content').element
        const [animation] = content.getAnimations()

        expect(vi.getTimerCount()).toBe(1)

        // the animation runs on the real clock (the timers are fake);
        // the engine's own finish handler runs before this later listener
        await new Promise(resolve => {
          animation.addEventListener('finish', resolve)
        })

        expect(emit).toHaveBeenCalledWith('show')
        expect(content.getAnimations()).toHaveLength(0)
        expect(content.style.overflowY).toBe('')
        expect(vi.getTimerCount()).toBe(0)
      })

      test('reverses an interrupted slide of a kept element in place', async () => {
        const { wrapper } = mountHarness({
          create: createNativeSlide,
          keep: true,
          visible: false
        })

        await wrapper.setData({ visible: true })

        const content = wrapper.get('.content').element
        const [animation] = content.getAnimations()

        await wrapper.setData({ visible: false })

        expect(content.getAnimations()).toStrictEqual([animation])

        // the reversed rate applies once the animation is ready
        await animation.ready

        expect(animation.playbackRate).toBe(-1)
      })

      test('slides a re-created element on its own animation', async () => {
        const { wrapper } = mountHarness({
          create: createNativeSlide,
          visible: false
        })

        await wrapper.setData({ visible: true })

        const first = wrapper.get('.content').element
        const [animation] = first.getAnimations()

        await wrapper.setData({ visible: false })
        await wrapper.setData({ visible: true })

        const second = wrapper.get('.content').element

        expect(second).not.toBe(first)
        expect(animation.playState).toBe('idle')
        expect(second.getAnimations()).toHaveLength(1)
        expect(second.getAnimations()[0].playbackRate).toBe(1)
      })
    })

    describe('[(function)createMeasuredSlide]', () => {
      defineEngineTests(createMeasuredSlide)

      test('measures the content height as the show target', async () => {
        const { wrapper } = mountHarness({
          create: createMeasuredSlide,
          visible: false
        })

        await wrapper.setData({ visible: true })

        const content = wrapper.get('.content').element
        expect(content.style.height).toBe(`${content.scrollHeight}px`)
      })
    })
  })

  describe('[Generic]', () => {
    test('can be used in a Vue Component', () => {
      const { hooks } = mountHarness()

      expect(hooks.onEnter).toBeTypeOf('function')
      expect(hooks.onLeave).toBeTypeOf('function')
    })
  })
})
