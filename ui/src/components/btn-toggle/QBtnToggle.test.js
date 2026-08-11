import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QBtnToggle from './QBtnToggle.js'

const options = [
  { label: 'One', value: 'one' },
  { label: 'Two', value: 'two' }
]

function mountBtnToggle(props = {}, slots = {}) {
  return mount(QBtnToggle, {
    props: {
      modelValue: 'one',
      options,
      ...props
    },
    slots
  })
}

function getButtons(wrapper) {
  return wrapper.findAll('.q-btn')
}

describe('[QBtnToggle API]', () => {
  describe('[Props]', () => {
    describe('[(prop)name]', () => {
      test('type String has effect', () => {
        const wrapper = mountBtnToggle({ name: 'view' })
        const input = wrapper.get('input[type="hidden"]')

        expect(input.attributes('name')).toBe('view')
        expect(input.attributes('value')).toBe('one')
      })
    })

    describe('[(prop)model-value]', () => {
      test('type Any has effect', () => {
        const wrapper = mountBtnToggle({ modelValue: 'two' })
        const [first, second] = getButtons(wrapper)

        expect(first.attributes('aria-pressed')).toBe('false')
        expect(second.attributes('aria-pressed')).toBe('true')
      })
    })

    describe('[(prop)options]', () => {
      test('type Array has effect', () => {
        const wrapper = mountBtnToggle({
          options: [
            { label: 'Grid', value: 'grid' },
            { icon: 'list', value: 'list' }
          ]
        })

        expect(getButtons(wrapper)).toHaveLength(2)
        expect(getButtons(wrapper)[0].text()).toContain('Grid')
        expect(getButtons(wrapper)[1].get('.q-icon').text()).toBe('list')
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const wrapper = mountBtnToggle({ color: 'secondary' })

        expect(getButtons(wrapper)[1].classes()).toContain('bg-secondary')
      })
    })

    describe('[(prop)text-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountBtnToggle({ textColor: 'dark' })

        expect(getButtons(wrapper)[1].classes()).toContain('text-dark')
      })
    })

    describe('[(prop)toggle-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountBtnToggle({ toggleColor: 'accent' })

        expect(getButtons(wrapper)[0].classes()).toContain('bg-accent')
      })
    })

    describe('[(prop)toggle-text-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountBtnToggle({ toggleTextColor: 'dark' })

        expect(getButtons(wrapper)[0].classes()).toContain('text-dark')
      })
    })

    describe('[(prop)spread]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountBtnToggle({ spread: true })

        expect(wrapper.classes()).toContain('q-btn-group--spread')
      })
    })

    describe('[(prop)outline]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountBtnToggle({ outline: true })

        expect(wrapper.classes()).toContain('q-btn-group--outline')
        expect(getButtons(wrapper)[0].classes()).toContain('q-btn--outline')
      })
    })

    describe('[(prop)flat]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountBtnToggle({ flat: true })

        expect(wrapper.classes()).toContain('q-btn-group--flat')
        expect(getButtons(wrapper)[0].classes()).toContain('q-btn--flat')
      })
    })

    describe('[(prop)unelevated]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountBtnToggle({ unelevated: true })

        expect(wrapper.classes()).toContain('q-btn-group--unelevated')
        expect(getButtons(wrapper)[0].classes()).toContain('q-btn--unelevated')
      })
    })

    describe('[(prop)rounded]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountBtnToggle({ rounded: true })

        expect(wrapper.classes()).toContain('q-btn-group--rounded')
        expect(getButtons(wrapper)[0].classes()).toContain('q-btn--rounded')
      })
    })

    describe('[(prop)push]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountBtnToggle({ push: true })

        expect(wrapper.classes()).toContain('q-btn-group--push')
        expect(getButtons(wrapper)[0].classes()).toContain('q-btn--push')
      })
    })

    describe('[(prop)glossy]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountBtnToggle({ glossy: true })

        expect(wrapper.classes()).toContain('q-btn-group--glossy')
      })
    })

    describe('[(prop)size]', () => {
      test('type String has effect', () => {
        const wrapper = mountBtnToggle({ size: '16px' })

        expect(getButtons(wrapper)[0].$style('font-size')).toBe('16px')
      })
    })

    describe('[(prop)padding]', () => {
      test('type String has effect', () => {
        const wrapper = mountBtnToggle({ padding: '4px 8px' })

        expect(getButtons(wrapper)[0].$style('padding')).toBe('4px 8px')
      })
    })

    describe('[(prop)no-caps]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountBtnToggle({ noCaps: true })

        expect(getButtons(wrapper)[0].classes()).toContain(
          'q-btn--no-uppercase'
        )
      })
    })

    describe('[(prop)no-wrap]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountBtnToggle({ noWrap: true })

        expect(
          getButtons(wrapper)[0].get('.q-btn__content').classes()
        ).toContain('text-no-wrap')
      })
    })

    describe('[(prop)ripple]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnToggle({ ripple: true })
        const button = getButtons(wrapper)[1]

        await button.trigger('click')

        expect(button.find('.q-ripple').exists()).toBe(true)
      })

      test('type Object has effect', async () => {
        const wrapper = mountBtnToggle({
          ripple: { center: true, color: 'teal', keyCodes: [] }
        })
        const button = getButtons(wrapper)[1]

        await button.trigger('click')

        expect(button.find('.q-ripple').exists()).toBe(true)
      })
    })

    describe('[(prop)dense]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountBtnToggle({ dense: true })

        expect(getButtons(wrapper)[0].classes()).toContain('q-btn--dense')
      })
    })

    describe('[(prop)readonly]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnToggle({ readonly: true })

        await getButtons(wrapper)[1].trigger('click')

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountBtnToggle({ disable: true })

        for (const button of getButtons(wrapper)) {
          expect(button.attributes('disabled')).toBe('')
          expect(button.attributes('aria-disabled')).toBe('true')
        }
      })
    })

    describe('[(prop)stack]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountBtnToggle({ stack: true })

        expect(
          getButtons(wrapper)[0].get('.q-btn__content').classes()
        ).toContain('column')
      })
    })

    describe('[(prop)stretch]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountBtnToggle({ stretch: true })

        expect(wrapper.classes()).toContain('q-btn-group--stretch')
        expect(getButtons(wrapper)[0].classes()).toContain('self-stretch')
      })
    })

    describe('[(prop)clearable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnToggle({ clearable: true })

        await getButtons(wrapper)[0].trigger('click')

        expect(wrapper.emitted('update:modelValue')[0]).toStrictEqual([
          null,
          null
        ])
        expect(wrapper.emitted('clear')).toStrictEqual([[]])
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const wrapper = mountBtnToggle(
          {},
          { default: () => 'Additional toggle content' }
        )

        expect(wrapper.text()).toContain('Additional toggle content')
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountBtnToggle()

        await getButtons(wrapper)[1].trigger('click')

        const [value, option] = wrapper.emitted('update:modelValue')[0]
        expect(value).toBe('two')
        expect(option).toStrictEqual(options[1])
      })
    })

    describe('[(event)clear]', () => {
      test('is emitting', async () => {
        const wrapper = mountBtnToggle({ clearable: true })

        await getButtons(wrapper)[0].trigger('click')

        expect(wrapper.emitted('clear')).toStrictEqual([[]])
      })
    })
  })
})
