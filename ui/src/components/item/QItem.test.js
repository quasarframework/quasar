import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'

import { getRouter } from 'testing/runtime/router.js'
import QItem from './QItem.js'

describe('[QItem API]', () => {
  describe('[Props]', () => {
    describe('[(prop)to]', () => {
      test('type String has effect', async () => {
        const propVal = '/home/dashboard'
        const router = await getRouter(propVal)
        const wrapper = mount(QItem, {
          props: { to: propVal },
          global: { plugins: [router] }
        })

        expect(wrapper.get('a').attributes('href')).toBe(propVal)

        await wrapper.trigger('click')
        await flushPromises()

        expect(router.currentRoute.value.path).toBe(propVal)
      })

      test('type Object has effect', async () => {
        const path = '/my-route-name'
        const propVal = { path }
        const router = await getRouter(path)
        const wrapper = mount(QItem, {
          props: { to: propVal },
          global: { plugins: [router] }
        })

        expect(wrapper.get('a').attributes('href')).toBe(path)

        await wrapper.trigger('click')
        await flushPromises()

        expect(router.currentRoute.value.path).toBe(path)
      })
    })

    describe('[(prop)exact]', () => {
      test('type Boolean has effect', async () => {
        const router = await getRouter({ '/route': 'child' })
        await router.push('/route/child')
        const wrapper = mount(QItem, {
          props: {
            to: '/route',
            exact: true
          },
          global: { plugins: [router] }
        })

        expect(wrapper.get('a').classes()).not.toContain(
          'q-router-link--active'
        )

        await wrapper.setProps({ exact: false })

        expect(wrapper.get('a').classes()).toContain('q-router-link--active')
      })
    })

    describe('[(prop)replace]', () => {
      test('type Boolean has effect', async () => {
        const propVal = '/replacement'
        const router = await getRouter(propVal)
        const replace = vi.spyOn(router, 'replace')
        const wrapper = mount(QItem, {
          props: {
            to: propVal,
            replace: true
          },
          global: { plugins: [router] }
        })

        await wrapper.trigger('click')
        await flushPromises()

        expect(replace).toHaveBeenCalledWith(propVal)
      })
    })

    describe('[(prop)active-class]', () => {
      test('type String has effect', async () => {
        const propVal = 'item-is-active'
        const router = await getRouter('/active')
        const wrapper = mount(QItem, {
          props: {
            to: '/active',
            activeClass: propVal
          },
          global: { plugins: [router] }
        })

        await router.push('/active')

        expect(wrapper.get('a').classes()).toContain(propVal)
      })
    })

    describe('[(prop)exact-active-class]', () => {
      test('type String has effect', async () => {
        const propVal = 'item-is-exact-active'
        const router = await getRouter('/active')
        const wrapper = mount(QItem, {
          props: {
            to: '/active',
            exactActiveClass: propVal
          },
          global: { plugins: [router] }
        })

        await router.push('/active')

        expect(wrapper.get('a').classes()).toContain(propVal)
      })
    })

    describe('[(prop)href]', () => {
      test('type String has effect', () => {
        const propVal = 'https://quasar.dev'
        const wrapper = mount(QItem, {
          props: { href: propVal }
        })

        expect(wrapper.get('a').attributes('href')).toBe(propVal)
      })
    })

    describe('[(prop)target]', () => {
      test('type String has effect', () => {
        const propVal = '_blank'
        const wrapper = mount(QItem, {
          props: {
            href: 'https://quasar.dev',
            target: propVal
          }
        })

        expect(wrapper.get('a').attributes('target')).toBe(propVal)
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QItem, {
          props: { clickable: true }
        })
        const target = wrapper.get('.q-item')

        expect(target.attributes('tabindex')).toBe('0')

        await wrapper.setProps({ disable: true })

        expect(target.classes()).toContain('disabled')
        expect(target.attributes('aria-disabled')).toBe('true')
        expect(target.attributes('tabindex')).toBeUndefined()
      })
    })

    describe('[(prop)active]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QItem, {
          props: {
            active: true,
            activeClass: 'selected'
          }
        })

        expect(wrapper.get('.q-item').classes()).toEqual(
          expect.arrayContaining(['q-item--active', 'selected'])
        )
      })

      test('type null has effect', async () => {
        const router = await getRouter('/active')
        const wrapper = mount(QItem, {
          props: {
            to: '/active',
            active: null
          },
          global: { plugins: [router] }
        })

        await router.push('/active')

        expect(wrapper.get('a').classes()).toContain('q-router-link--active')
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QItem)
        const target = wrapper.get('.q-item')

        expect(target.classes()).not.toContain('q-item--dark')

        await wrapper.setProps({ dark: true })

        expect(target.classes()).toContain('q-item--dark')
      })

      test('type null has effect', async () => {
        const wrapper = mount(QItem, {
          props: { dark: null }
        })
        await wrapper.vm.$q.dark.set(false)

        expect(wrapper.get('.q-item').classes()).not.toContain('q-item--dark')

        await wrapper.vm.$q.dark.set(true)

        expect(wrapper.get('.q-item').classes()).toContain('q-item--dark')

        await wrapper.vm.$q.dark.set(false)
      })
    })

    describe('[(prop)clickable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QItem)
        const target = wrapper.get('.q-item')

        expect(target.attributes('role')).toBe('listitem')

        await wrapper.setProps({ clickable: true })

        expect(target.classes()).toContain('q-item--clickable')
        expect(target.attributes('role')).toBe('button')
        expect(target.attributes('tabindex')).toBe('0')
        expect(wrapper.find('.q-focus-helper').exists()).toBe(true)
      })
    })

    describe('[(prop)dense]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QItem)
        const target = wrapper.get('.q-item')

        expect(target.classes()).not.toContain('q-item--dense')

        await wrapper.setProps({ dense: true })

        expect(target.classes()).toContain('q-item--dense')
      })
    })

    describe('[(prop)inset-level]', () => {
      test('type Number has effect', async () => {
        const wrapper = mount(QItem)
        const target = wrapper.get('.q-item')

        expect(target.$style('padding-left')).toBe('')

        await wrapper.setProps({ insetLevel: 1 })

        expect(target.$style('padding-left')).toBe('72px')
      })
    })

    describe('[(prop)tabindex]', () => {
      test('type Number has effect', () => {
        const wrapper = mount(QItem, {
          props: {
            clickable: true,
            tabindex: 100
          }
        })

        expect(wrapper.get('.q-item').attributes('tabindex')).toBe('100')
      })

      test('type String has effect', () => {
        const wrapper = mount(QItem, {
          props: {
            clickable: true,
            tabindex: '-1'
          }
        })

        expect(wrapper.get('.q-item').attributes('tabindex')).toBe('-1')
      })
    })

    describe('[(prop)tag]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QItem, {
          props: { tag: 'section' }
        })

        expect(wrapper.get('.q-item').element.tagName).toBe('SECTION')
      })
    })

    describe('[(prop)manual-focus]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QItem, {
          props: { clickable: true }
        })
        const target = wrapper.get('.q-item')

        expect(target.classes()).toContain('q-focusable')

        await wrapper.setProps({ manualFocus: true })

        expect(target.classes()).toContain('q-manual-focusable')
        expect(target.classes()).not.toContain('q-focusable')
      })
    })

    describe('[(prop)focused]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QItem, {
          props: {
            clickable: true,
            manualFocus: true
          }
        })
        const target = wrapper.get('.q-item')

        expect(target.classes()).not.toContain('q-manual-focusable--focused')

        await wrapper.setProps({ focused: true })

        expect(target.classes()).toContain('q-manual-focusable--focused')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QItem, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.html()).toContain(slotContent)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)click]', () => {
      test('is emitting', async () => {
        const router = await getRouter('/destination')
        const wrapper = mount(QItem, {
          props: { to: '/destination' },
          global: { plugins: [router] }
        })

        await wrapper.trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('click')
        expect(eventList.click).toHaveLength(1)

        const [evt, go] = eventList.click[0]
        expect(evt).toBeInstanceOf(Event)
        expect(go).toBeTypeOf('function')
      })
    })
  })
})
