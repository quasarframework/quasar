import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, test, vi } from 'vitest'

import QTabPanel from './QTabPanel.js'
import QTabPanels from './QTabPanels.js'

function createCounter(name) {
  return defineComponent({
    name,
    data: () => ({ count: 0 }),
    template: `<button data-panel="${name}" @click="count++">{{ count }}</button>`
  })
}

function mountPanels(props, panels) {
  props ||= {}

  const panelList = panels || [
    ['panel-a', createCounter('PanelA')],
    ['panel-b', createCounter('PanelB')],
    ['panel-c', createCounter('PanelC')]
  ]

  return mount(QTabPanels, {
    props: {
      modelValue: 'panel-a',
      ...props
    },
    slots: {
      default: () =>
        panelList.map(([name, component, disable = false]) =>
          h(QTabPanel, { name, disable }, () => h(component))
        )
    }
  })
}

async function expectPanelCached(filterProps) {
  const wrapper = mountPanels({
    keepAlive: true,
    ...filterProps
  })

  await wrapper.get('button').trigger('click')
  expect(wrapper.get('button').text()).toBe('1')

  await wrapper.setProps({ modelValue: 'panel-b' })
  await wrapper.setProps({ modelValue: 'panel-a' })

  expect(wrapper.get('button').text()).toBe('1')
}

describe('[QTabPanels API]', () => {
  describe('[Props]', () => {
    describe('[(prop)model-value]', () => {
      test('type Any has effect', async () => {
        const wrapper = mountPanels()

        expect(wrapper.get('button').attributes('data-panel')).toBe('PanelA')

        await wrapper.setProps({ modelValue: 'panel-b' })

        expect(wrapper.get('button').attributes('data-panel')).toBe('PanelB')
      })
    })

    describe('[(prop)keep-alive]', () => {
      test('type Boolean has effect', async () => {
        await expectPanelCached({})
      })
    })

    describe('[(prop)keep-alive-include]', () => {
      test('type String has effect', async () => {
        await expectPanelCached({ keepAliveInclude: 'panel-a' })
      })

      test('type Array has effect', async () => {
        await expectPanelCached({ keepAliveInclude: ['panel-a'] })
      })

      test('type RegExp has effect', async () => {
        await expectPanelCached({ keepAliveInclude: /^panel-a$/ })
      })
    })

    describe('[(prop)keep-alive-exclude]', () => {
      test('type String has effect', async () => {
        await expectPanelCached({ keepAliveExclude: 'panel-b' })
      })

      test('type Array has effect', async () => {
        await expectPanelCached({ keepAliveExclude: ['panel-b'] })
      })

      test('type RegExp has effect', async () => {
        await expectPanelCached({ keepAliveExclude: /^panel-b$/ })
      })
    })

    describe('[(prop)keep-alive-max]', () => {
      test('type Number has effect', async () => {
        const wrapper = mountPanels({
          keepAlive: true,
          keepAliveMax: 1
        })

        await wrapper.get('button').trigger('click')
        await wrapper.setProps({ modelValue: 'panel-b' })
        await wrapper.setProps({ modelValue: 'panel-a' })

        expect(wrapper.get('button').text()).toBe('0')
      })
    })

    describe('[(prop)animated]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountPanels({ animated: true })

        await wrapper.setProps({ modelValue: 'panel-b' })

        expect(wrapper.get('transition-stub').attributes('name')).toBe(
          'q-transition--slide-left'
        )
      })
    })

    describe('[(prop)infinite]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountPanels({
          modelValue: 'panel-c',
          infinite: true
        })

        wrapper.vm.next()

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['panel-a']
        ])
      })
    })

    describe('[(prop)swipeable]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountPanels({ swipeable: true })
        const swipe = wrapper.get('.q-tab-panels').element.__qtouchswipe

        expect(swipe.direction.horizontal).toBe(true)
        swipe.handler({ direction: 'left' })

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['panel-b']
        ])
      })
    })

    describe('[(prop)vertical]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountPanels({
          swipeable: true,
          vertical: true
        })
        const swipe = wrapper.get('.q-tab-panels').element.__qtouchswipe

        expect(swipe.direction.vertical).toBe(true)
        swipe.handler({ direction: 'up' })

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['panel-b']
        ])
      })
    })

    describe('[(prop)transition-prev]', () => {
      test('type String has effect', async () => {
        const wrapper = mountPanels({
          modelValue: 'panel-b',
          animated: true,
          transitionPrev: 'fade'
        })

        await wrapper.setProps({ modelValue: 'panel-a' })

        expect(wrapper.get('transition-stub').attributes('name')).toBe(
          'q-transition--fade'
        )
      })
    })

    describe('[(prop)transition-next]', () => {
      test('type String has effect', async () => {
        const wrapper = mountPanels({
          animated: true,
          transitionNext: 'fade'
        })

        await wrapper.setProps({ modelValue: 'panel-b' })

        expect(wrapper.get('transition-stub').attributes('name')).toBe(
          'q-transition--fade'
        )
      })
    })

    describe('[(prop)transition-duration]', () => {
      test('type String has effect', () => {
        const wrapper = mountPanels({ transitionDuration: '450' })

        expect(wrapper.get('.q-panel').attributes('style')).toContain(
          '--q-transition-duration: 450ms'
        )
      })

      test('type Number has effect', () => {
        const wrapper = mountPanels({ transitionDuration: 450 })

        expect(wrapper.get('.q-panel').attributes('style')).toContain(
          '--q-transition-duration: 450ms'
        )
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountPanels()
        const target = wrapper.get('.q-tab-panels')

        expect(target.classes()).not.toContain('q-tab-panels--dark')

        await wrapper.setProps({ dark: true })

        expect(target.classes()).toContain('q-tab-panels--dark')
      })

      test('type null has effect', async () => {
        const wrapper = mountPanels({ dark: null })
        const target = wrapper.get('.q-tab-panels')
        await wrapper.vm.$q.dark.set(false)

        expect(target.classes()).not.toContain('q-tab-panels--dark')

        await wrapper.vm.$q.dark.set(true)

        await wrapper.vm.$q.dark.set(false)
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QTabPanels, {
          props: {
            modelValue: 'slot'
          },
          slots: {
            default: () => h(QTabPanel, { name: 'slot' }, () => slotContent)
          }
        })

        expect(wrapper.html()).toContain(slotContent)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', () => {
        const wrapper = mountPanels()

        wrapper.vm.goTo('panel-b')

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['panel-b']
        ])
      })
    })

    describe('[(event)before-transition]', () => {
      test('is emitting', async () => {
        const wrapper = mountPanels()

        await wrapper.setProps({ modelValue: 'panel-b' })

        expect(wrapper.emitted('beforeTransition')).toStrictEqual([
          ['panel-b', 'panel-a']
        ])
      })
    })

    describe('[(event)transition]', () => {
      test('is emitting', async () => {
        vi.useFakeTimers()
        const wrapper = mountPanels({ transitionDuration: 25 })

        await wrapper.setProps({ modelValue: 'panel-b' })
        await vi.advanceTimersByTimeAsync(25)

        expect(wrapper.emitted('transition')).toStrictEqual([
          ['panel-b', 'panel-a']
        ])

        vi.useRealTimers()
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)next]', () => {
      test('should be callable', () => {
        const wrapper = mountPanels()

        expect(wrapper.vm.next()).toBeUndefined()
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['panel-b']
        ])
      })
    })

    describe('[(method)previous]', () => {
      test('should be callable', () => {
        const wrapper = mountPanels({ modelValue: 'panel-b' })

        expect(wrapper.vm.previous()).toBeUndefined()
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['panel-a']
        ])
      })
    })

    describe('[(method)goTo]', () => {
      test('should be callable', () => {
        const wrapper = mountPanels()

        expect(wrapper.vm.goTo('dashboard')).toBeUndefined()
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['dashboard']
        ])
      })
    })
  })
})
