import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import { validatePosition } from '../../utils/private.position-engine/position-engine.js'
import QTooltip from './QTooltip.js'

let activeWrapper

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  activeWrapper?.unmount()
  activeWrapper = void 0
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

/**
 * QTooltip renders through a portal, so it is mounted inside an anchor
 * and the resulting node is looked up in the document.
 */
function mountTooltip(props, slots) {
  props ||= {}
  slots ||= { default: () => 'Tip' }

  activeWrapper = mount(
    defineComponent({
      props: { tooltipProps: Object },
      setup(componentProps, { slots: componentSlots }) {
        return () =>
          h('div', { class: 'my-anchor', tabindex: 0 }, [
            h(QTooltip, componentProps.tooltipProps, componentSlots)
          ])
      }
    }),
    {
      props: { tooltipProps: props },
      slots,
      attachTo: document.body
    }
  )

  return activeWrapper
}

function getTooltip() {
  return document.querySelector('.q-tooltip')
}

function getAnchor(wrapper) {
  return wrapper.get('.my-anchor')
}

function getTooltipComponent(wrapper) {
  return wrapper.findComponent(QTooltip)
}

async function showTooltip(wrapper) {
  getTooltipComponent(wrapper).vm.show()
  await flushPromises()
  await vi.runAllTimersAsync()
}

/**
 * jsdom reports a zero size for every element, which makes the position
 * engine give up before it applies any style; give it something to work with.
 */
function giveElementsSize() {
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(50)
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(20)
}

async function hideTooltip(wrapper) {
  getTooltipComponent(wrapper).vm.hide()
  await flushPromises()
  await vi.runAllTimersAsync()
}

describe('[QTooltip API]', () => {
  describe('[Props]', () => {
    describe('[(prop)transition-show]', () => {
      test('type String has effect', async () => {
        const wrapper = mountTooltip({ transitionShow: 'fade' })

        await showTooltip(wrapper)

        expect(
          getTooltip().style.getPropertyValue('--q-transition-duration')
        ).not.toBe('')
        expect(getTooltipComponent(wrapper).vm.$props.transitionShow).toBe(
          'fade'
        )
      })

      test('defaults to a jump-down transition', () => {
        const wrapper = mountTooltip()

        expect(getTooltipComponent(wrapper).vm.$props.transitionShow).toBe(
          'jump-down'
        )
      })
    })

    describe('[(prop)transition-hide]', () => {
      test('type String has effect', () => {
        const wrapper = mountTooltip({ transitionHide: 'fade' })

        expect(getTooltipComponent(wrapper).vm.$props.transitionHide).toBe(
          'fade'
        )
      })

      test('defaults to a jump-up transition', () => {
        const wrapper = mountTooltip()

        expect(getTooltipComponent(wrapper).vm.$props.transitionHide).toBe(
          'jump-up'
        )
      })
    })

    describe('[(prop)transition-duration]', () => {
      test('type String has effect', async () => {
        const wrapper = mountTooltip({ transitionDuration: '450' })

        await showTooltip(wrapper)

        expect(
          getTooltip().style.getPropertyValue('--q-transition-duration')
        ).toBe('450ms')
      })

      test('type Number has effect', async () => {
        const wrapper = mountTooltip({ transitionDuration: 450 })

        await showTooltip(wrapper)

        expect(
          getTooltip().style.getPropertyValue('--q-transition-duration')
        ).toBe('450ms')
      })

      test('delays the show event by that long', async () => {
        const wrapper = mountTooltip({ transitionDuration: 300 })
        const tooltip = getTooltipComponent(wrapper)

        tooltip.vm.show()
        await flushPromises()

        expect(tooltip.emitted('show')).toBeUndefined()

        await vi.advanceTimersByTimeAsync(300)

        expect(tooltip.emitted('show')).toHaveLength(1)
      })
    })

    describe('[(prop)target]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTooltip({ target: false })

        await getAnchor(wrapper).trigger('mouseenter')
        await vi.runAllTimersAsync()

        // no anchor means the parent events are never wired up
        expect(getTooltip()).toBeNull()
      })

      test('type String has effect', async () => {
        const target = document.createElement('div')
        target.id = 'my-target'
        document.body.append(target)

        try {
          const wrapper = mountTooltip({ target: '#my-target' })
          await showTooltip(wrapper)

          expect(target.getAttribute('aria-describedby')).toBe(getTooltip().id)
        } finally {
          target.remove()
        }
      })

      test('type Element has effect', async () => {
        const target = document.createElement('div')
        document.body.append(target)

        try {
          const wrapper = mountTooltip({ target })
          await showTooltip(wrapper)

          expect(target.getAttribute('aria-describedby')).toBe(getTooltip().id)
        } finally {
          target.remove()
        }
      })

      test('defaults to the parent element', async () => {
        const wrapper = mountTooltip()

        await showTooltip(wrapper)

        expect(getAnchor(wrapper).attributes('aria-describedby')).toBe(
          getTooltip().id
        )
      })
    })

    describe('[(prop)no-parent-event]', () => {
      test('type Boolean has effect', async () => {
        const withEvents = mountTooltip()
        await getAnchor(withEvents).trigger('mouseenter')
        await vi.runAllTimersAsync()
        expect(getTooltip()).not.toBeNull()
        withEvents.unmount()
        await vi.runAllTimersAsync()

        const wrapper = mountTooltip({ noParentEvent: true })

        await getAnchor(wrapper).trigger('mouseenter')
        await vi.runAllTimersAsync()

        expect(getTooltip()).toBeNull()
      })
    })

    describe('[(prop)model-value]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTooltip({ modelValue: true })

        await flushPromises()
        await vi.runAllTimersAsync()

        expect(getTooltip()).not.toBeNull()

        await wrapper.setProps({ tooltipProps: { modelValue: false } })
        await vi.runAllTimersAsync()

        expect(getTooltip()).toBeNull()
      })
    })

    describe('[(prop)max-height]', () => {
      test('type String has effect', async () => {
        giveElementsSize()
        const wrapper = mountTooltip({ maxHeight: '100px' })

        await showTooltip(wrapper)

        expect(getTooltip().style.maxHeight).toBe('100px')
      })

      test('leaves the height unbounded without it', async () => {
        giveElementsSize()
        const wrapper = mountTooltip()

        await showTooltip(wrapper)

        expect(getTooltip().style.maxHeight).toBe('')
      })
    })

    describe('[(prop)max-width]', () => {
      test('type String has effect', async () => {
        giveElementsSize()
        const wrapper = mountTooltip({ maxWidth: '100px' })

        await showTooltip(wrapper)

        const maxWidth = getTooltip().style.maxWidth

        // the viewport can narrow it down further, but never widen it
        expect(maxWidth).not.toBe('')
        expect(Number.parseInt(maxWidth, 10)).toBeLessThanOrEqual(100)
      })
    })

    describe('[(prop)anchor]', () => {
      test('type String has effect', async () => {
        const wrapper = mountTooltip({ anchor: 'top left' })

        await showTooltip(wrapper)

        expect(getTooltip()).not.toBeNull()
        expect(getTooltipComponent(wrapper).vm.$props.anchor).toBe('top left')
      })

      test('only accepts a valid position', () => {
        const { validator, default: defaultValue } = QTooltip.props.anchor

        expect(validator).toBe(validatePosition)
        expect(validator('top left')).toBe(true)
        expect(validator('center middle')).toBe(true)
        expect(validator('nowhere')).toBe(false)
        expect(validator(defaultValue)).toBe(true)
      })
    })

    describe('[(prop)self]', () => {
      test('type String has effect', async () => {
        const wrapper = mountTooltip({ self: 'bottom right' })

        await showTooltip(wrapper)

        expect(getTooltip()).not.toBeNull()
        expect(getTooltipComponent(wrapper).vm.$props.self).toBe('bottom right')
      })

      test('only accepts a valid position', () => {
        const { validator, default: defaultValue } = QTooltip.props.self

        expect(validator('bottom right')).toBe(true)
        expect(validator('nowhere')).toBe(false)
        expect(validator(defaultValue)).toBe(true)
      })
    })

    describe('[(prop)offset]', () => {
      test('type Array has effect', async () => {
        const wrapper = mountTooltip({ offset: [20, 30] })

        await showTooltip(wrapper)

        expect(getTooltip()).not.toBeNull()
        expect(getTooltipComponent(wrapper).vm.$props.offset).toStrictEqual([
          20, 30
        ])
      })

      test('only accepts two numbers', () => {
        const { validator, default: getDefault } = QTooltip.props.offset

        expect(validator([10, 20])).toBe(true)
        expect(validator([10])).toBe(false)
        expect(validator(['a', 'b'])).toBe(false)
        expect(validator(getDefault())).toBe(true)
      })
    })

    describe('[(prop)scroll-target]', () => {
      test('type String has effect', async () => {
        const target = document.createElement('div')
        target.id = 'my-scroll-target'
        target.classList.add('scroll')
        document.body.append(target)

        const addSpy = vi.spyOn(target, 'addEventListener')

        try {
          const wrapper = mountTooltip({ scrollTarget: '#my-scroll-target' })
          await showTooltip(wrapper)

          expect(addSpy).toHaveBeenCalledWith(
            'scroll',
            expect.any(Function),
            expect.anything()
          )
        } finally {
          target.remove()
        }
      })

      test('type Element has effect', async () => {
        const target = document.createElement('div')
        target.classList.add('scroll')
        document.body.append(target)

        const addSpy = vi.spyOn(target, 'addEventListener')

        try {
          const wrapper = mountTooltip({ scrollTarget: target })
          await showTooltip(wrapper)

          expect(addSpy).toHaveBeenCalledWith(
            'scroll',
            expect.any(Function),
            expect.anything()
          )
        } finally {
          target.remove()
        }
      })
    })

    describe('[(prop)delay]', () => {
      test('type Number has effect', async () => {
        const wrapper = mountTooltip({ delay: 500 })

        await getAnchor(wrapper).trigger('mouseenter')
        await vi.advanceTimersByTimeAsync(499)

        expect(getTooltip()).toBeNull()

        await vi.advanceTimersByTimeAsync(1)
        await flushPromises()

        expect(getTooltip()).not.toBeNull()
      })
    })

    describe('[(prop)hide-delay]', () => {
      test('type Number has effect', async () => {
        const wrapper = mountTooltip({ hideDelay: 500 })

        await getAnchor(wrapper).trigger('mouseenter')
        await vi.runAllTimersAsync()
        expect(getTooltip()).not.toBeNull()

        await getAnchor(wrapper).trigger('mouseleave')
        await vi.advanceTimersByTimeAsync(499)

        expect(getTooltip()).not.toBeNull()

        await vi.runAllTimersAsync()

        expect(getTooltip()).toBeNull()
      })
    })

    describe('[(prop)persistent]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTooltip({ persistent: true })

        await showTooltip(wrapper)
        expect(getTooltip()).not.toBeNull()

        document.body.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 27 }))
        await vi.runAllTimersAsync()

        // the ESC key is ignored while persistent
        expect(getTooltip()).not.toBeNull()
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', async () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountTooltip({}, { default: () => slotContent })

        await showTooltip(wrapper)

        expect(getTooltip().textContent).toBe(slotContent)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountTooltip({
          modelValue: false,
          'onUpdate:modelValue': () => {}
        })

        await showTooltip(wrapper)

        const tooltip = getTooltipComponent(wrapper)
        expect(tooltip.emitted('update:modelValue')).toStrictEqual([[true]])
      })
    })

    describe('[(event)show]', () => {
      test('is emitting', async () => {
        const wrapper = mountTooltip()

        await showTooltip(wrapper)

        expect(getTooltipComponent(wrapper).emitted('show')).toHaveLength(1)
      })
    })

    describe('[(event)before-show]', () => {
      test('is emitting', async () => {
        const wrapper = mountTooltip()

        await showTooltip(wrapper)

        const tooltip = getTooltipComponent(wrapper)
        expect(tooltip.emitted('beforeShow')).toHaveLength(1)
      })
    })

    describe('[(event)hide]', () => {
      test('is emitting', async () => {
        const wrapper = mountTooltip()

        await showTooltip(wrapper)
        await hideTooltip(wrapper)

        expect(getTooltipComponent(wrapper).emitted('hide')).toHaveLength(1)
      })
    })

    describe('[(event)before-hide]', () => {
      test('is emitting', async () => {
        const wrapper = mountTooltip()

        await showTooltip(wrapper)
        await hideTooltip(wrapper)

        expect(getTooltipComponent(wrapper).emitted('beforeHide')).toHaveLength(
          1
        )
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)show]', () => {
      test('should be callable', async () => {
        const wrapper = mountTooltip()

        expect(getTooltipComponent(wrapper).vm.show()).toBeUndefined()
        await flushPromises()
        await vi.runAllTimersAsync()

        expect(getTooltip()).not.toBeNull()
      })
    })

    describe('[(method)hide]', () => {
      test('should be callable', async () => {
        const wrapper = mountTooltip()

        await showTooltip(wrapper)

        expect(getTooltipComponent(wrapper).vm.hide()).toBeUndefined()
        await flushPromises()
        await vi.runAllTimersAsync()

        expect(getTooltip()).toBeNull()
      })
    })

    describe('[(method)toggle]', () => {
      test('should be callable', async () => {
        const wrapper = mountTooltip()
        const tooltip = getTooltipComponent(wrapper)

        expect(tooltip.vm.toggle()).toBeUndefined()
        await flushPromises()
        await vi.runAllTimersAsync()
        expect(getTooltip()).not.toBeNull()

        tooltip.vm.toggle()
        await flushPromises()
        await vi.runAllTimersAsync()
        expect(getTooltip()).toBeNull()
      })
    })

    describe('[(method)updatePosition]', () => {
      test('should be callable', async () => {
        giveElementsSize()
        const wrapper = mountTooltip({ maxHeight: '100px' })

        await showTooltip(wrapper)

        expect(getTooltipComponent(wrapper).vm.updatePosition()).toBeUndefined()

        const style = getTooltip().style
        expect(style.visibility).toBe('visible')
        expect(style.maxHeight).toBe('100px')
        expect(style.top).not.toBe('')
        expect(style.left).not.toBe('')
      })
    })
  })

  describe('[Computed props]', () => {
    describe('[(computedProp)contentEl]', () => {
      test('should be exposed', async () => {
        const wrapper = mountTooltip()
        const tooltip = getTooltipComponent(wrapper)

        await showTooltip(wrapper)

        expect(tooltip.vm.contentEl).toBeInstanceOf(Element)
        expect(tooltip.vm.contentEl).toBe(getTooltip())
      })
    })
  })
})
