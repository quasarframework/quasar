import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QKnob from './QKnob.js'

function mountKnob(props = {}, options = {}) {
  return mount(QKnob, {
    ...options,
    props: {
      modelValue: 10,
      ...props
    }
  })
}

describe('[QKnob API]', () => {
  describe('[Props]', () => {
    describe('[(prop)name]', () => {
      test('type String has effect', () => {
        const wrapper = mountKnob({ name: 'car_id' })
        const input = wrapper.get('input[type="hidden"]')

        expect(input.attributes()).toMatchObject({
          name: 'car_id',
          value: '10'
        })
      })
    })

    describe('[(prop)size]', () => {
      test('type String has effect', async () => {
        const wrapper = mountKnob()
        const target = wrapper.get('.q-knob')

        await wrapper.setProps({ size: '16px' })

        expect(target.$style('font-size')).toBe('16px')
      })
    })

    describe('[(prop)model-value]', () => {
      test('type Number has effect', () => {
        const wrapper = mountKnob({ modelValue: 42 })

        expect(wrapper.get('.q-knob').attributes('aria-valuenow')).toBe('42')
      })
    })

    describe('[(prop)min]', () => {
      test('type Number has effect', () => {
        const wrapper = mountKnob({ min: 5 })

        expect(wrapper.get('.q-knob').attributes('aria-valuemin')).toBe('5')
      })
    })

    describe('[(prop)max]', () => {
      test('type Number has effect', () => {
        const wrapper = mountKnob({ max: 50 })

        expect(wrapper.get('.q-knob').attributes('aria-valuemax')).toBe('50')
      })
    })

    describe('[(prop)inner-min]', () => {
      test('type Number has effect', () => {
        const wrapper = mountKnob({ innerMin: 8 })

        expect(wrapper.get('.q-knob').attributes('aria-valuemin')).toBe('8')
      })
    })

    describe('[(prop)inner-max]', () => {
      test('type Number has effect', () => {
        const wrapper = mountKnob({ innerMax: 80 })

        expect(wrapper.get('.q-knob').attributes('aria-valuemax')).toBe('80')
      })
    })

    describe('[(prop)step]', () => {
      test('type Number has effect', async () => {
        const wrapper = mountKnob({ step: 5 })

        await wrapper.trigger('keydown', { keyCode: 39 })

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[15]])
      })
    })

    describe('[(prop)reverse]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountKnob()
        const svg = wrapper.get('svg')

        expect(svg.$style('transform')).not.toContain('scale3d')

        await wrapper.setProps({ reverse: true })

        expect(svg.$style('transform')).toContain('scale3d(-1, 1, 1)')
      })
    })

    describe('[(prop)instant-feedback]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountKnob()
        const circle = wrapper.get('.q-circular-progress__circle')

        expect(circle.$style('transition')).toContain('stroke-dashoffset')

        await wrapper.setProps({ instantFeedback: true })

        expect(circle.$style('transition')).toBe('')
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const wrapper = mountKnob({ color: 'primary' })

        expect(wrapper.get('.q-circular-progress__circle').classes()).toContain(
          'text-primary'
        )
      })
    })

    describe('[(prop)center-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountKnob({ centerColor: 'primary' })

        expect(wrapper.get('.q-circular-progress__center').classes()).toContain(
          'text-primary'
        )
      })
    })

    describe('[(prop)track-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountKnob({ trackColor: 'primary' })

        expect(wrapper.get('.q-circular-progress__track').classes()).toContain(
          'text-primary'
        )
      })
    })

    describe('[(prop)font-size]', () => {
      test('type String has effect', () => {
        const wrapper = mountKnob({
          showValue: true,
          fontSize: '1em'
        })

        expect(
          wrapper.get('.q-circular-progress__text').$style('font-size')
        ).toBe('1em')
      })
    })

    describe('[(prop)rounded]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountKnob({ rounded: true })

        expect(
          wrapper
            .get('.q-circular-progress__circle')
            .attributes('stroke-linecap')
        ).toBe('round')
      })
    })

    describe('[(prop)thickness]', () => {
      test('type Number has effect', async () => {
        const wrapper = mountKnob()
        const circle = wrapper.get('.q-circular-progress__circle')
        const initial = circle.attributes('stroke-width')

        await wrapper.setProps({ thickness: 0.4 })

        expect(circle.attributes('stroke-width')).not.toBe(initial)
      })
    })

    describe('[(prop)angle]', () => {
      test('type Number has effect', async () => {
        const wrapper = mountKnob()
        const svg = wrapper.get('svg')
        const initial = svg.$style('transform')

        await wrapper.setProps({ angle: 45 })

        expect(svg.$style('transform')).not.toBe(initial)
        expect(svg.$style('transform')).toContain('-45deg')
      })
    })

    describe('[(prop)show-value]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountKnob()

        expect(wrapper.find('.q-circular-progress__text').exists()).toBe(false)

        await wrapper.setProps({ showValue: true })

        expect(wrapper.get('.q-circular-progress__text').text()).toBe('10')
      })
    })

    describe('[(prop)tabindex]', () => {
      test('type Number has effect', () => {
        const wrapper = mountKnob({ tabindex: 2 })

        expect(wrapper.get('.q-knob').attributes('tabindex')).toBe('2')
      })

      test('type String has effect', () => {
        const wrapper = mountKnob({ tabindex: '-1' })

        expect(wrapper.get('.q-knob').attributes('tabindex')).toBe('-1')
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountKnob({ disable: true })
        const target = wrapper.get('.q-knob')

        expect(target.classes()).toContain('disabled')
        expect(target.attributes('aria-disabled')).toBe('true')
        expect(target.attributes('tabindex')).toBeUndefined()
      })
    })

    describe('[(prop)readonly]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountKnob({ readonly: true })
        const target = wrapper.get('.q-knob')

        expect(target.classes()).not.toContain('disabled')
        expect(target.attributes('aria-readonly')).toBe('true')
        expect(target.attributes('tabindex')).toBeUndefined()
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountKnob(
          { showValue: true },
          {
            slots: {
              default: () => slotContent
            }
          }
        )

        expect(wrapper.html()).toContain(slotContent)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountKnob()

        await wrapper.trigger('keydown', { keyCode: 39 })

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[11]])
      })
    })

    describe('[(event)change]', () => {
      test('is emitting', async () => {
        const wrapper = mountKnob()
        const initialCount = wrapper.emitted('change').length

        await wrapper.trigger('keydown', { keyCode: 39 })
        await wrapper.trigger('keyup', { keyCode: 39 })

        const changes = wrapper.emitted('change')
        expect(changes).toHaveLength(initialCount + 1)
        expect(changes.at(-1)).toStrictEqual([11])
      })
    })

    describe('[(event)drag-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountKnob()

        await wrapper.trigger('click', {
          clientX: 10,
          clientY: 0
        })

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('dragValue')
        expect(eventList.dragValue).toHaveLength(1)

        const [value] = eventList.dragValue[0]
        expect(value).toBeTypeOf('number')
      })
    })
  })
})
