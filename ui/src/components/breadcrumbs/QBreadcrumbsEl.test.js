import { mount, flushPromises } from '@vue/test-utils'
import { describe, test, expect, vi } from 'vitest'

import QBreadcrumbsEl from './QBreadcrumbsEl.js'
import { getRouter } from 'testing/runtime/router.js'

describe('[QBreadcrumbsEl API]', () => {
  describe('[Props]', () => {
    describe('[(prop)to]', () => {
      test('type String has effect', async () => {
        const testRoute = '/home/dashboard'
        const router = await getRouter(testRoute)

        const wrapper = mount(QBreadcrumbsEl, {
          global: {
            plugins: [ router ]
          }
        })

        expect(
          wrapper.find('a').exists()
        ).toBe(false)

        await wrapper.setProps({ to: testRoute })
        await flushPromises()

        expect(
          wrapper.get('a').attributes('href')
        ).toBe(testRoute)

        const routerFn = vi.spyOn(router, 'push')

        await wrapper.trigger('click')
        await flushPromises()

        expect(
          router.currentRoute.value.path
        ).toBe(testRoute)

        expect(routerFn).toHaveBeenCalledTimes(1)
        expect(routerFn).toHaveBeenCalledWith(testRoute)
      })

      test('type Object has effect', async () => {
        const testRoute = '/my-route-name'
        const propVal = { path: testRoute }
        const router = await getRouter(testRoute)

        const wrapper = mount(QBreadcrumbsEl, {
          global: {
            plugins: [ router ]
          }
        })

        expect(
          wrapper.find('a').exists()
        ).toBe(false)

        await wrapper.setProps({ to: propVal })
        await flushPromises()

        expect(
          wrapper.get('a').attributes('href')
        ).toBe(testRoute)

        const routerFn = vi.spyOn(router, 'push')

        await wrapper.trigger('click')
        await flushPromises()

        expect(
          router.currentRoute.value.path
        ).toBe(testRoute)

        expect(routerFn).toHaveBeenCalledTimes(1)
        expect(routerFn).toHaveBeenCalledWith(propVal)
      })
    })

    describe('[(prop)exact]', () => {
      test('type Boolean has effect', async () => {
        const activeClass = 'it-is-active'
        const exactActiveClass = 'it-is-exact-active'
        const router = await getRouter({ '/route': 'subRoute' })

        const wrapper = mount(QBreadcrumbsEl, {
          props: {
            exact: true,
            activeClass,
            exactActiveClass
          },
          global: {
            plugins: [ router ]
          }
        })

        expect(
          wrapper.find('a').exists()
        ).toBe(false)

        await wrapper.setProps({ to: '/route/subRoute' })
        await flushPromises()

        expect(
          wrapper.get('a').attributes('href')
        ).toBe('/route/subRoute')

        expect(
          wrapper.get('a').classes()
        ).not.toContain(
          expect.$any([ activeClass, exactActiveClass ])
        )

        await router.push('/route')

        expect(
          router.currentRoute.value.path
        ).toBe('/route')

        expect(
          wrapper.get('a').classes()
        ).not.toContain(
          expect.$any([ activeClass, exactActiveClass ])
        )

        await router.push('/route/subRoute')

        const cls = wrapper.get('a').classes()

        expect(cls).toContain(activeClass)
        expect(cls).toContain(exactActiveClass)
      })
    })

    describe('[(prop)replace]', () => {
      test('type Boolean has effect', async () => {
        const testRoute = '/test-route'
        const router = await getRouter(testRoute)

        const wrapper = mount(QBreadcrumbsEl, {
          props: {
            replace: true
          },
          global: {
            plugins: [ router ]
          }
        })

        expect(
          wrapper.find('a').exists()
        ).toBe(false)

        await wrapper.setProps({ to: testRoute })
        await flushPromises()

        expect(
          wrapper.get('a').attributes('href')
        ).toBe(testRoute)

        const routerFn = vi.spyOn(router, 'replace')

        await wrapper.trigger('click')
        await flushPromises()

        expect(
          router.currentRoute.value.path
        ).toBe(testRoute)

        expect(routerFn).toHaveBeenCalledTimes(1)
        expect(routerFn).toHaveBeenCalledWith(testRoute)
      })
    })

    describe('[(prop)active-class]', () => {
      test('type String has effect', async () => {
        const activeClass = 'it-is-active'
        const router = await getRouter({ '/route': 'subRoute' })

        const wrapper = mount(QBreadcrumbsEl, {
          props: {
            activeClass
          },
          global: {
            plugins: [ router ]
          }
        })

        expect(
          wrapper.find('a').exists()
        ).toBe(false)

        await wrapper.setProps({ to: '/route' })
        await flushPromises()

        expect(
          wrapper.get('a').attributes('href')
        ).toBe('/route')

        expect(
          wrapper.get('a').classes()
        ).not.toContain(activeClass)

        await router.push('/route')

        expect(
          router.currentRoute.value.path
        ).toBe('/route')

        expect(
          wrapper.get('a').classes()
        ).toContain(activeClass)

        await router.push('/route/subRoute')

        expect(
          wrapper.get('a').classes()
        ).toContain(activeClass)
      })
    })

    describe('[(prop)exact-active-class]', () => {
      test('type String has effect', async () => {
        const exactActiveClass = 'it-is-exact-active'
        const router = await getRouter({
          '/route': { subRoute: 'other' }
        })

        const wrapper = mount(QBreadcrumbsEl, {
          props: {
            exact: true,
            exactActiveClass
          },
          global: {
            plugins: [ router ]
          }
        })

        expect(
          wrapper.find('a').exists()
        ).toBe(false)

        await wrapper.setProps({ to: '/route/subRoute' })
        await flushPromises()

        expect(
          wrapper.get('a').attributes('href')
        ).toBe('/route/subRoute')

        expect(
          wrapper.get('a').classes()
        ).not.toContain(exactActiveClass)

        await router.push('/route')

        expect(
          router.currentRoute.value.path
        ).toBe('/route')

        expect(
          wrapper.get('a').classes()
        ).not.toContain(exactActiveClass)

        await router.push('/route/subRoute')

        expect(
          wrapper.get('a').classes()
        ).toContain(exactActiveClass)

        await router.push('/route/subRoute/other')

        expect(
          wrapper.get('a').classes()
        ).not.toContain(exactActiveClass)
      })
    })

    describe('[(prop)href]', () => {
      test('type String has effect', async () => {
        const propVal = 'https://quasar.dev'
        const wrapper = mount(QBreadcrumbsEl)

        expect(
          wrapper.find('a').exists()
        ).toBe(false)

        await wrapper.setProps({ href: propVal })
        await flushPromises()

        expect(
          wrapper.get('a').attributes('href')
        ).toBe(propVal)
      })
    })

    describe('[(prop)target]', () => {
      test('type String has effect', async () => {
        const propVal = '_blank'
        const href = 'https://quasar.dev'
        const wrapper = mount(QBreadcrumbsEl, {
          props: {
            target: propVal
          }
        })

        expect(
          wrapper.find('a').exists()
        ).toBe(false)

        await wrapper.setProps({ href })
        await flushPromises()

        const link = wrapper.get('a')

        expect(
          link.attributes('href')
        ).toBe(href)

        expect(
          link.attributes('target')
        ).toBe(propVal)
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const testRoute = '/home'
        const router = await getRouter(testRoute)

        const wrapper = mount(QBreadcrumbsEl, {
          props: {
            to: testRoute
          },
          global: {
            plugins: [ router ]
          }
        })

        expect(
          wrapper.find('a').exists()
        ).toBe(true)

        await wrapper.setProps({ disable: true })
        await flushPromises()

        expect(
          wrapper.find('a').exists()
        ).toBe(false)

        await wrapper.trigger('click')
        await flushPromises()

        expect(
          router.currentRoute.value.path
        ).not.toBe(testRoute)
      })
    })

    describe('[(prop)label]', () => {
      test('type String has effect', async () => {
        const propVal = 'Home'
        const wrapper = mount(QBreadcrumbsEl)

        expect(wrapper.text()).not.toContain(propVal)

        await wrapper.setProps({ label: propVal })
        await flushPromises()

        expect(wrapper.text()).toContain(propVal)
      })
    })

    describe('[(prop)icon]', () => {
      test('type String has effect', async () => {
        const propVal = 'map'
        const wrapper = mount(QBreadcrumbsEl)

        expect(
          wrapper.find('.q-icon').exists()
        ).toBe(false)

        await wrapper.setProps({ icon: propVal })
        await flushPromises()

        expect(
          wrapper.get('.q-icon').text()
        ).toContain(propVal)
      })
    })

    describe('[(prop)tag]', () => {
      test('type String has effect', async () => {
        const propVal = 'div'
        const wrapper = mount(QBreadcrumbsEl)

        expect(
          // default is 'span'
          wrapper.element.tagName
        ).not.toBe(propVal.toUpperCase())

        await wrapper.setProps({ tag: propVal })
        await flushPromises()

        expect(
          wrapper.element.tagName
        ).toBe(propVal.toUpperCase())
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QBreadcrumbsEl, {
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
      test('is emitting without router', async () => {
        const wrapper = mount(QBreadcrumbsEl)

        await wrapper.trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('click')
        expect(eventList.click).toHaveLength(1)

        const [ evt, go ] = eventList.click[ 0 ]
        expect(evt).toBeInstanceOf(Event)
        expect(go).not.toBeDefined()
      })

      test('is emitting with router', async () => {
        const testRoute = '/home/dashboard'
        const router = await getRouter(testRoute)

        const wrapper = mount(QBreadcrumbsEl, {
          props: {
            to: testRoute
          },
          global: {
            plugins: [ router ]
          }
        })

        await wrapper.trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('click')
        expect(eventList.click).toHaveLength(1)

        const [ evt, go ] = eventList.click[ 0 ]
        expect(evt).toBeInstanceOf(Event)
        expect(go).toBeTypeOf('function')
      })

      test('does not navigates when prevented', async () => {
        const testRoute = '/home/dashboard'
        const router = await getRouter(testRoute)

        const wrapper = mount(QBreadcrumbsEl, {
          props: {
            to: testRoute,
            onClick: e => e.preventDefault()
          },
          global: {
            plugins: [ router ]
          }
        })

        await wrapper.trigger('click')
        await flushPromises()

        expect(
          router.currentRoute.value.path
        ).not.toBe(testRoute)
      })

      test('can manually navigate by calling go()', async () => {
        const testRoute = '/home/dashboard'
        const router = await getRouter(testRoute)

        const wrapper = mount(QBreadcrumbsEl, {
          props: {
            to: testRoute,
            onClick: (e, go) => {
              e.preventDefault()
              go()
            }
          },
          global: {
            plugins: [ router ]
          }
        })

        await wrapper.trigger('click')
        await flushPromises()

        expect(
          router.currentRoute.value.path
        ).toBe(testRoute)
      })
    })
  })
})
