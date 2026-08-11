import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { h } from 'vue'

import QTab from './QTab.js'
import QTabs from './QTabs.js'

/**
 * QTab requires a QTabs parent, so everything is mounted through one.
 */
function mountTab(props, slots, tabsProps) {
  props ||= {}
  tabsProps ||= {}

  return mount(QTabs, {
    props: {
      modelValue: 'home',
      // QTabs only emits when a listener is actually attached
      'onUpdate:modelValue': () => {},
      ...tabsProps
    },
    slots: {
      default: () => [
        h(QTab, { name: 'home', ...props }, slots),
        h(QTab, { name: 'other' })
      ]
    }
  })
}

function getTab(wrapper) {
  return wrapper.get('.q-tab')
}

describe('[QTab API]', () => {
  describe('[Props]', () => {
    describe('[(prop)icon]', () => {
      test('type String has effect', () => {
        // the lookup is scoped to the tab: QTabs' own arrows reuse the class
        expect(getTab(mountTab()).find('.q-tab__icon').exists()).toBe(false)

        const wrapper = mountTab({ icon: 'map' })

        expect(getTab(wrapper).get('.q-tab__icon').classes()).toContain(
          'q-icon'
        )
      })
    })

    describe('[(prop)label]', () => {
      test('type Number has effect', () => {
        const wrapper = mountTab({ label: 10 })

        expect(wrapper.get('.q-tab__label').text()).toBe('10')
      })

      test('type String has effect', () => {
        expect(mountTab().find('.q-tab__label').exists()).toBe(false)

        const wrapper = mountTab({ label: 'Home' })

        expect(wrapper.get('.q-tab__label').text()).toBe('Home')
      })

      test('renders full size along with an icon', () => {
        expect(getTab(mountTab({ label: 'Home' })).classes()).not.toContain(
          'q-tab--full'
        )
        expect(
          getTab(mountTab({ label: 'Home', icon: 'map' })).classes()
        ).toContain('q-tab--full')
      })
    })

    describe('[(prop)alert]', () => {
      test('type Boolean has effect', () => {
        expect(mountTab().find('.q-tab__alert').exists()).toBe(false)

        const wrapper = mountTab({ alert: true })

        expect(wrapper.get('.q-tab__alert').classes()).toStrictEqual([
          'q-tab__alert'
        ])
      })

      test('type String has effect', () => {
        const wrapper = mountTab({ alert: 'purple' })

        expect(wrapper.get('.q-tab__alert').classes()).toContain('text-purple')
      })
    })

    describe('[(prop)alert-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountTab({ alert: true, alertIcon: 'alarm_on' })

        expect(wrapper.get('.q-tab__alert-icon').classes()).toContain('q-icon')
        // the plain badge is replaced by the icon
        expect(wrapper.find('.q-tab__alert').exists()).toBe(false)
      })

      test('colors the alert icon through the alert prop', () => {
        const wrapper = mountTab({ alert: 'purple', alertIcon: 'alarm_on' })

        expect(wrapper.get('.q-tab__alert-icon').classes()).toContain(
          'text-purple'
        )
      })

      test('needs the alert prop to show up', () => {
        const wrapper = mountTab({ alertIcon: 'alarm_on' })

        expect(wrapper.find('.q-tab__alert-icon').exists()).toBe(false)
      })
    })

    describe('[(prop)name]', () => {
      test('type Number has effect', () => {
        const wrapper = mount(QTabs, {
          props: { modelValue: 1 },
          slots: {
            default: () => [h(QTab, { name: 1 }), h(QTab, { name: 2 })]
          }
        })

        const [first, second] = wrapper.findAll('.q-tab')
        expect(first.classes()).toContain('q-tab--active')
        expect(second.classes()).toContain('q-tab--inactive')
      })

      test('type String has effect', async () => {
        const wrapper = mountTab()

        expect(getTab(wrapper).classes()).toContain('q-tab--active')

        await wrapper.setProps({ modelValue: 'other' })

        expect(getTab(wrapper).classes()).toContain('q-tab--inactive')
      })

      test('is used as the payload when selecting the tab', async () => {
        const wrapper = mountTab()

        await wrapper.findAll('.q-tab').at(1).trigger('click')

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([['other']])
      })
    })

    describe('[(prop)no-caps]', () => {
      test('type Boolean has effect', () => {
        expect(getTab(mountTab()).classes()).not.toContain('q-tab--no-caps')

        const wrapper = mountTab({ noCaps: true })

        expect(getTab(wrapper).classes()).toContain('q-tab--no-caps')
      })
    })

    describe('[(prop)content-class]', () => {
      test('type String has effect', () => {
        const propVal = 'my-special-class'

        expect(mountTab().get('.q-tab__content').classes()).not.toContain(
          propVal
        )

        const wrapper = mountTab({ contentClass: propVal })

        expect(wrapper.get('.q-tab__content').classes()).toContain(propVal)
      })
    })

    describe('[(prop)ripple]', () => {
      // QTab always turns on the "early" modifier, so the ripple
      // starts on pointerdown rather than on click
      test('type Boolean has effect', async () => {
        const wrapper = mountTab({ ripple: false })
        const tab = getTab(wrapper)

        await tab.trigger('pointerdown')

        expect(tab.find('.q-ripple').exists()).toBe(false)
      })

      test('type Object has effect', async () => {
        const wrapper = mountTab({
          ripple: { early: true, center: true, color: 'teal', keyCodes: [] }
        })
        const tab = getTab(wrapper)

        await tab.trigger('pointerdown')

        expect(tab.get('.q-ripple').classes()).toContain('text-teal')
      })

      test('is enabled by default', async () => {
        const wrapper = mountTab()
        const tab = getTab(wrapper)

        await tab.trigger('pointerdown')

        expect(tab.find('.q-ripple').exists()).toBe(true)
      })
    })

    describe('[(prop)tabindex]', () => {
      test('type Number has effect', () => {
        const wrapper = mountTab({ tabindex: 100 })

        expect(getTab(wrapper).attributes('tabindex')).toBe('100')
      })

      test('type String has effect', () => {
        const wrapper = mountTab({ tabindex: '0' })

        expect(getTab(wrapper).attributes('tabindex')).toBe('0')
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountTab({ disable: true })
        const tab = getTab(wrapper)

        expect(tab.classes()).toContain('disabled')
        expect(tab.attributes('aria-disabled')).toBe('true')
        expect(tab.attributes('tabindex')).toBe('-1')

        await tab.trigger('click')

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountTab({}, () => slotContent)

        expect(wrapper.html()).toContain(slotContent)
      })

      test('renders next to the generated content', () => {
        const wrapper = mountTab({ label: 'Home' }, () => 'Extra')

        const content = wrapper.get('.q-tab__content').text()
        expect(content).toContain('Home')
        expect(content).toContain('Extra')
      })
    })
  })
})
