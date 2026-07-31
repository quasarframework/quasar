import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import { h } from 'vue'

import { getRouter } from 'testing/runtime/router.js'
import QRouteTab from './QRouteTab.js'
import QTabs from './QTabs.js'

/**
 * QTabs resolves the tab matching the current route through a timeout,
 * which flushPromises() alone does not wait for.
 */
async function settleRoute() {
  await flushPromises()
  await new Promise(resolve => {
    setTimeout(resolve, 0)
  })
  await flushPromises()
}

/**
 * QRouteTab requires both a QTabs parent and a Vue Router instance.
 * It renders with the regular ".q-tab" class of QTab.
 */
async function mountRouteTab(props = {}, { slots, routes, initial } = {}) {
  const router = await getRouter(routes || ['/home', '/other'])
  await router.push(initial || '/home')

  const wrapper = mount(QTabs, {
    slots: {
      default: () => [
        h(QRouteTab, { to: '/home', ...props }, slots),
        h(QRouteTab, { to: '/other' })
      ]
    },
    global: { plugins: [router] }
  })

  await settleRoute()

  return { wrapper, router, tab: wrapper.get('.q-tab') }
}

describe('[QRouteTab API]', () => {
  describe('[Props]', () => {
    describe('[(prop)to]', () => {
      test('type String has effect', async () => {
        const { tab } = await mountRouteTab({ to: '/other' })

        expect(tab.element.tagName).toBe('A')
        expect(tab.attributes('href')).toBe('/other')
      })

      test('type Object has effect', async () => {
        const { tab } = await mountRouteTab({ to: { path: '/other' } })

        expect(tab.attributes('href')).toBe('/other')
      })

      test('navigates to the route on click', async () => {
        const { tab, router } = await mountRouteTab({ to: '/other' })

        await tab.trigger('click')
        await flushPromises()

        expect(router.currentRoute.value.path).toBe('/other')
      })

      test('renders a plain element without it', async () => {
        const { tab } = await mountRouteTab({ to: void 0 })

        expect(tab.element.tagName).toBe('DIV')
        expect(tab.attributes('href')).toBeUndefined()
      })
    })

    describe('[(prop)exact]', () => {
      test('type Boolean has effect', async () => {
        const options = {
          routes: [{ '/home': 'nested' }, '/other'],
          initial: '/home/nested'
        }

        const loose = await mountRouteTab({}, options)
        expect(loose.tab.classes()).toContain('q-router-link--active')

        const exact = await mountRouteTab({ exact: true }, options)
        expect(exact.tab.classes()).not.toContain('q-router-link--active')
      })
    })

    describe('[(prop)replace]', () => {
      test('type Boolean has effect', async () => {
        const { tab, router } = await mountRouteTab({
          to: '/other',
          replace: true
        })
        const replaceSpy = vi.spyOn(router, 'replace')
        const pushSpy = vi.spyOn(router, 'push')

        await tab.trigger('click')
        await flushPromises()

        expect(replaceSpy).toHaveBeenCalledTimes(1)
        expect(pushSpy).not.toHaveBeenCalled()
      })
    })

    describe('[(prop)active-class]', () => {
      test('type String has effect', async () => {
        const propVal = 'my-active-class'
        const options = {
          routes: [{ '/home': 'nested' }, '/other'],
          initial: '/home/nested'
        }

        const { tab } = await mountRouteTab({ activeClass: propVal }, options)

        expect(tab.classes()).toContain(propVal)
        expect(tab.classes()).not.toContain('q-router-link--active')
      })
    })

    describe('[(prop)exact-active-class]', () => {
      test('type String has effect', async () => {
        const propVal = 'my-exact-active-class'

        const { tab } = await mountRouteTab({ exactActiveClass: propVal })

        expect(tab.classes()).toContain(propVal)
        expect(tab.classes()).not.toContain('q-router-link--exact-active')
      })

      test('is not applied to a merely active route', async () => {
        const propVal = 'my-exact-active-class'

        const { tab } = await mountRouteTab(
          { exactActiveClass: propVal },
          { routes: [{ '/home': 'nested' }, '/other'], initial: '/home/nested' }
        )

        expect(tab.classes()).not.toContain(propVal)
      })
    })

    describe('[(prop)href]', () => {
      test('type String has effect', async () => {
        const propVal = 'https://quasar.dev'

        const { tab } = await mountRouteTab({ to: '/other', href: propVal })

        // the href wins over the "to" prop
        expect(tab.element.tagName).toBe('A')
        expect(tab.attributes('href')).toBe(propVal)
      })
    })

    describe('[(prop)target]', () => {
      test('type String has effect', async () => {
        const propVal = '_blank'

        const { tab } = await mountRouteTab({ target: propVal })

        expect(tab.attributes('target')).toBe(propVal)
      })

      test('leaves a new window to the browser', async () => {
        const { tab, router } = await mountRouteTab({
          to: '/other',
          target: '_blank'
        })
        const pushSpy = vi.spyOn(router, 'push')

        await tab.trigger('click')
        await flushPromises()

        expect(pushSpy).not.toHaveBeenCalled()
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const { tab, router } = await mountRouteTab({
          to: '/other',
          disable: true
        })
        const pushSpy = vi.spyOn(router, 'push')

        expect(tab.classes()).toContain('disabled')
        expect(tab.attributes('aria-disabled')).toBe('true')
        expect(tab.attributes('tabindex')).toBe('-1')

        await tab.trigger('click')
        await flushPromises()

        expect(pushSpy).not.toHaveBeenCalled()
        expect(router.currentRoute.value.path).toBe('/home')
      })

      test('keeps rendering the link', async () => {
        const { tab } = await mountRouteTab({ to: '/other', disable: true })

        // unlike the other router-link components, the href stays put
        expect(tab.element.tagName).toBe('A')
        expect(tab.attributes('href')).toBe('/other')
      })
    })

    describe('[(prop)icon]', () => {
      test('type String has effect', async () => {
        const plain = await mountRouteTab()
        expect(plain.tab.find('.q-tab__icon').exists()).toBe(false)

        const { tab } = await mountRouteTab({ icon: 'map' })
        expect(tab.get('.q-tab__icon').classes()).toContain('q-icon')
      })
    })

    describe('[(prop)label]', () => {
      test('type Number has effect', async () => {
        const { tab } = await mountRouteTab({ label: 10 })

        expect(tab.get('.q-tab__label').text()).toBe('10')
      })

      test('type String has effect', async () => {
        const plain = await mountRouteTab()
        expect(plain.tab.find('.q-tab__label').exists()).toBe(false)

        const { tab } = await mountRouteTab({ label: 'Home' })
        expect(tab.get('.q-tab__label').text()).toBe('Home')
      })
    })

    describe('[(prop)alert]', () => {
      test('type Boolean has effect', async () => {
        const plain = await mountRouteTab()
        expect(plain.tab.find('.q-tab__alert').exists()).toBe(false)

        const { tab } = await mountRouteTab({ alert: true })
        expect(tab.get('.q-tab__alert').classes()).toStrictEqual([
          'q-tab__alert'
        ])
      })

      test('type String has effect', async () => {
        const { tab } = await mountRouteTab({ alert: 'purple' })

        expect(tab.get('.q-tab__alert').classes()).toContain('text-purple')
      })
    })

    describe('[(prop)alert-icon]', () => {
      test('type String has effect', async () => {
        const { tab } = await mountRouteTab({
          alert: true,
          alertIcon: 'alarm_on'
        })

        expect(tab.get('.q-tab__alert-icon').classes()).toContain('q-icon')
        expect(tab.find('.q-tab__alert').exists()).toBe(false)
      })
    })

    describe('[(prop)name]', () => {
      test('type Number has effect', async () => {
        const { tab } = await mountRouteTab({ name: 1 })

        // the name is internal bookkeeping, the tab still renders as a link
        expect(tab.attributes('href')).toBe('/home')
      })

      test('type String has effect', async () => {
        const { tab } = await mountRouteTab({ name: 'home', label: 'Home' })

        expect(tab.get('.q-tab__label').text()).toBe('Home')
      })

      test('activates the tab matching the current route', async () => {
        const { wrapper } = await mountRouteTab({ name: 'home' })

        const [first, second] = wrapper.findAll('.q-tab')
        expect(first.classes()).toContain('q-tab--active')
        expect(second.classes()).toContain('q-tab--inactive')
      })
    })

    describe('[(prop)no-caps]', () => {
      test('type Boolean has effect', async () => {
        const plain = await mountRouteTab()
        expect(plain.tab.classes()).not.toContain('q-tab--no-caps')

        const { tab } = await mountRouteTab({ noCaps: true })
        expect(tab.classes()).toContain('q-tab--no-caps')
      })
    })

    describe('[(prop)content-class]', () => {
      test('type String has effect', async () => {
        const propVal = 'my-special-class'

        const plain = await mountRouteTab()
        expect(plain.tab.get('.q-tab__content').classes()).not.toContain(
          propVal
        )

        const { tab } = await mountRouteTab({ contentClass: propVal })
        expect(tab.get('.q-tab__content').classes()).toContain(propVal)
      })
    })

    describe('[(prop)ripple]', () => {
      // the "early" modifier is always on, so the ripple starts on pointerdown
      test('type Boolean has effect', async () => {
        const { tab } = await mountRouteTab({ ripple: false })

        await tab.trigger('pointerdown')

        expect(tab.find('.q-ripple').exists()).toBe(false)
      })

      test('type Object has effect', async () => {
        const { tab } = await mountRouteTab({
          ripple: { early: true, center: true, color: 'teal', keyCodes: [] }
        })

        await tab.trigger('pointerdown')

        expect(tab.get('.q-ripple').classes()).toContain('text-teal')
      })
    })

    describe('[(prop)tabindex]', () => {
      test('type Number has effect', async () => {
        const { tab } = await mountRouteTab({ tabindex: 100 })

        expect(tab.attributes('tabindex')).toBe('100')
      })

      test('type String has effect', async () => {
        const { tab } = await mountRouteTab({ tabindex: '0' })

        expect(tab.attributes('tabindex')).toBe('0')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', async () => {
        const slotContent = 'some-slot-content'
        const { wrapper } = await mountRouteTab(
          {},
          { slots: () => slotContent }
        )

        expect(wrapper.html()).toContain(slotContent)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)click]', () => {
      test('is emitting', async () => {
        const router = await getRouter(['/home', '/other'])
        await router.push('/home')

        const onClick = vi.fn()
        const wrapper = mount(QTabs, {
          slots: {
            default: () => h(QRouteTab, { to: '/other', onClick })
          },
          global: { plugins: [router] }
        })
        await flushPromises()

        await wrapper.get('.q-tab').trigger('click')

        expect(onClick).toHaveBeenCalledTimes(1)

        const [evt, go] = onClick.mock.calls[0]
        expect(evt).toBeInstanceOf(Event)
        expect(go).toBeTypeOf('function')
      })

      test('lets the handler cancel the navigation', async () => {
        const router = await getRouter(['/home', '/other'])
        await router.push('/home')

        const wrapper = mount(QTabs, {
          slots: {
            default: () =>
              h(QRouteTab, {
                to: '/other',
                onClick: evt => evt.preventDefault()
              })
          },
          global: { plugins: [router] }
        })
        await flushPromises()

        await wrapper.get('.q-tab').trigger('click')
        await flushPromises()

        expect(router.currentRoute.value.path).toBe('/home')
      })
    })
  })
})
