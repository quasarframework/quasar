import { mount, flushPromises } from '@vue/test-utils'
import { describe, test, expect, vi } from 'vitest'

import QBtn from './QBtn.js'

import { btnPadding, defaultSizes } from './use-btn.js'
import { alignMap } from 'quasar/src/composables/private.use-align/use-align.js'
import { getRouter } from 'testing/runtime/router.js'

describe('[QBtn API]', () => {
  describe('[Props]', () => {
    describe('[(prop)size]', () => {
      test('type String has effect (in pixels)', async () => {
        const propVal = '50px'
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.$style('font-size')
        ).not.toBe(propVal)

        await wrapper.setProps({ size: propVal })
        await flushPromises()

        expect(
          target.$style('font-size')
        ).toBe(propVal)
      })

      test('type String has effect (as "xs")', async () => {
        const propVal = 'xs'
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.$style('font-size')
        ).not.toBe(`${ defaultSizes.xs }px`)

        await wrapper.setProps({ size: propVal })
        await flushPromises()

        expect(
          target.$style('font-size')
        ).toBe(`${ defaultSizes.xs }px`)
      })
    })

    describe('[(prop)type]', () => {
      test.each([
        [ 'button' ],
        [ 'a' ]
      ])('type "%s" has effect', (propVal) => {
        const wrapper = mount(QBtn, {
          props: {
            type: propVal
          }
        })

        expect(
          wrapper.get('.q-btn').element.tagName.toLowerCase()
        ).toBe(propVal)
      })

      test.each([
        [ 'submit' ],
        [ 'reset' ]
      ])('type "%s" has effect', (propVal) => {
        const wrapper = mount(QBtn, {
          props: {
            type: propVal
          }
        })

        expect(
          wrapper.get('.q-btn').element.tagName.toLowerCase()
        ).toBe('button')
      })

      // accessibility
      test.each([
        [ 'media/html' ],
        [ 'image/png' ]
      ])('type "%s" has effect', (propVal) => {
        const wrapper = mount(QBtn, {
          props: {
            type: propVal,
            href: 'https://quasar.dev'
          }
        })

        const target = wrapper.get('.q-btn')

        expect(
          target.element.tagName.toLowerCase()
        ).toBe('a')

        expect(
          target.attributes('type')
        ).toBe(propVal)
      })
    })

    describe('[(prop)to]', () => {
      test('type String has effect', async () => {
        const testRoute = '/home/dashboard'
        const router = await getRouter(testRoute)

        const wrapper = mount(QBtn, {
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

        const wrapper = mount(QBtn, {
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

    describe('[(prop)replace]', () => {
      test('type Boolean has effect', async () => {
        const testRoute = '/test-route'
        const router = await getRouter(testRoute)

        const wrapper = mount(QBtn, {
          props: {
            replace: true,
            to: testRoute
          },
          global: {
            plugins: [ router ]
          }
        })

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

    describe('[(prop)href]', () => {
      test('type String has effect', async () => {
        const propVal = 'https://quasar.dev'
        const wrapper = mount(QBtn)

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
      test('type String has effect', () => {
        const propVal = '_blank'
        const href = 'https://quasar.dev'
        const wrapper = mount(QBtn, {
          props: {
            href,
            target: propVal
          }
        })

        const link = wrapper.get('a')

        expect(
          link.attributes('href')
        ).toBe(href)

        expect(
          link.attributes('target')
        ).toBe(propVal)
      })
    })

    describe('[(prop)label]', () => {
      test('type String has effect', async () => {
        const propVal = 'Button Label'
        const wrapper = mount(QBtn)

        expect(wrapper.text()).not.toContain(propVal)

        await wrapper.setProps({ label: propVal })
        await flushPromises()

        expect(wrapper.text()).toContain(propVal)
      })

      test('type Number has effect', async () => {
        const propVal = 10
        const wrapper = mount(QBtn)

        expect(wrapper.text()).not.toContain('' + propVal)

        await wrapper.setProps({ label: propVal })
        await flushPromises()

        expect(wrapper.text()).toContain('' + propVal)
      })
    })

    describe('[(prop)icon]', () => {
      test('type String has effect', async () => {
        const propVal = 'map'
        const wrapper = mount(QBtn)

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

    describe('[(prop)icon-right]', () => {
      test('type String has effect', async () => {
        const propVal = 'map'
        const wrapper = mount(QBtn)

        expect(
          wrapper.find('.q-icon').exists()
        ).toBe(false)

        await wrapper.setProps({ iconRight: propVal })
        await flushPromises()

        expect(
          wrapper.get('.q-icon').text()
        ).toContain(propVal)
      })
    })

    describe('[(prop)outline]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.classes()
        ).not.toContain('q-btn--outline')

        await wrapper.setProps({ outline: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-btn--outline')

        expect(
          target.$computedStyle('background')
        ).toBe('transparent')
      })
    })

    describe('[(prop)flat]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.classes()
        ).not.toContain('q-btn--flat')

        await wrapper.setProps({ flat: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-btn--flat')
      })
    })

    describe('[(prop)unelevated]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.classes()
        ).not.toContain('q-btn--unelevated')

        await wrapper.setProps({ unelevated: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-btn--unelevated')
      })
    })

    describe('[(prop)rounded]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.classes()
        ).not.toContain('q-btn--rounded')

        await wrapper.setProps({ rounded: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-btn--rounded')

        expect(
          target.$computedStyle('border-radius')
        ).toBe('28px')
      })
    })

    describe('[(prop)push]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.classes()
        ).not.toContain('q-btn--push')

        await wrapper.setProps({ push: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-btn--push')

        expect(
          target.$computedStyle('border-radius')
        ).toBe('7px')

        expect(
          target.$computedStyle('transition')
        ).toBeDefined()
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.classes()
        ).not.toContain('q-btn--square')

        await wrapper.setProps({ square: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-btn--square')

        expect(
          target.$computedStyle('border-radius')
        ).toBe('0')
      })
    })

    describe('[(prop)glossy]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.classes()
        ).not.toContain('glossy')

        await wrapper.setProps({ glossy: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('glossy')
      })
    })

    describe('[(prop)fab]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.classes()
        ).not.toContain('q-btn--fab')

        await wrapper.setProps({ fab: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-btn--fab')
      })
    })

    describe('[(prop)fab-mini]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.classes()
        ).not.toContain('q-btn--fab-mini')

        await wrapper.setProps({ fabMini: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-btn--fab-mini')
      })
    })

    describe('[(prop)padding]', () => {
      test.each([
        [ 'pixels; single value', '50px' ],
        [ 'pixels; multiple values', '50px 100px' ]
      ])('type String has effect (%s)', async (_, propVal) => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.$style('padding')
        ).not.toBe(propVal)

        await wrapper.setProps({ padding: propVal })
        await flushPromises()

        expect(
          target.$style('padding')
        ).toBe(propVal)
      })

      test('type String has effect (as "xs")', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.$style('padding')
        ).not.toBe(`${ btnPadding.xs }px`)

        await wrapper.setProps({ padding: 'xs' })
        await flushPromises()

        expect(
          target.$style('padding')
        ).toBe(`${ btnPadding.xs }px`)
      })

      test('type String has effect (as "xs xl")', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.$style('padding')
        ).not.toBe(`${ btnPadding.xs }px ${ btnPadding.xl }px`)

        await wrapper.setProps({ padding: 'xs xl' })
        await flushPromises()

        expect(
          target.$style('padding')
        ).toBe(`${ btnPadding.xs }px ${ btnPadding.xl }px`)
      })

      test('padding "0" is applied correctly', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.$style('min-width')
        ).not.toBe('0')

        expect(
          target.$style('min-height')
        ).not.toBe('0')

        await wrapper.setProps({ padding: 'xs xl' })
        await flushPromises()

        expect(
          target.$style('min-width')
        ).toBe('0')

        expect(
          target.$style('min-height')
        ).toBe('0')
      })
    })

    describe('[(prop)color]', () => {
      test('(default design) is applied correctly', async () => {
        const propVal = 'red'
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        let cls = target.classes()
        expect(cls).not.toContain('bg-red')
        expect(cls).not.toContain('text-white')

        await wrapper.setProps({ color: propVal })
        await flushPromises()

        cls = target.classes()
        expect(cls).toContain('bg-red')
        expect(cls).toContain('text-white')
      })

      test.each([
        [ 'push' ],
        [ 'unelevated' ]
      ])('(design "%s") is applied correctly', async designProp => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        let cls = target.classes()
        expect(cls).not.toContain('bg-red')
        expect(cls).not.toContain('text-white')

        await wrapper.setProps({
          color: 'red',
          [ designProp ]: true
        })
        await flushPromises()

        cls = target.classes()
        expect(cls).toContain('bg-red')
        expect(cls).toContain('text-white')
      })

      test.each([
        [ 'flat' ],
        [ 'outline' ]
      ])('(design "%s") is applied correctly', async designProp => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        let cls = target.classes()
        expect(cls).not.toContain('text-red')
        expect(cls).not.toContain('bg-red')

        await wrapper.setProps({
          color: 'red',
          [ designProp ]: true
        })
        await flushPromises()

        cls = target.classes()
        expect(cls).toContain('text-red')
        expect(cls).not.toContain('bg-red')
      })
    })

    describe('[(prop)text-color]', () => {
      test('is applied correctly with no "color" prop', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        let cls = target.classes()
        expect(cls).not.toContain('text-red')
        expect(cls).not.toContain('bg-red')

        await wrapper.setProps({ textColor: 'red' })
        await flushPromises()

        cls = target.classes()
        expect(cls).toContain('text-red')
        expect(cls).not.toContain('bg-red')
      })

      test('(default design + color) is applied correctly', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        let cls = target.classes()

        expect(cls).not.toContain('bg-red')
        expect(cls).not.toContain('text-red')
        expect(cls).not.toContain('bg-blue')
        expect(cls).not.toContain('text-blue')

        await wrapper.setProps({
          color: 'red',
          textColor: 'blue'
        })
        await flushPromises()

        cls = target.classes()

        expect(cls).toContain('bg-red')
        expect(cls).toContain('text-blue')

        expect(cls).not.toContain('text-red')
        expect(cls).not.toContain('bg-blue')
      })

      test.each([
        [ 'push' ],
        [ 'unelevated' ]
      ])('(design "%s" + color) is applied correctly', async designProp => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        let cls = target.classes()

        expect(cls).not.toContain('bg-red')
        expect(cls).not.toContain('text-red')
        expect(cls).not.toContain('bg-blue')
        expect(cls).not.toContain('text-blue')

        await wrapper.setProps({
          color: 'red',
          textColor: 'blue',
          [ designProp ]: true
        })
        await flushPromises()

        cls = target.classes()

        expect(cls).toContain('bg-red')
        expect(cls).toContain('text-blue')

        expect(cls).not.toContain('text-red')
        expect(cls).not.toContain('bg-blue')
      })

      test.each([
        [ 'flat' ],
        [ 'outline' ]
      ])('(design "%s" + color) is applied correctly', async designProp => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        let cls = target.classes()

        expect(cls).not.toContain('text-blue')
        expect(cls).not.toContain('text-red')
        expect(cls).not.toContain('bg-red')
        expect(cls).not.toContain('bg-blue')

        await wrapper.setProps({
          color: 'red',
          textColor: 'blue',
          [ designProp ]: true
        })
        await flushPromises()

        cls = target.classes()

        expect(cls).toContain('text-blue')

        expect(cls).not.toContain('text-red')
        expect(cls).not.toContain('bg-red')
        expect(cls).not.toContain('bg-blue')
      })
    })

    describe('[(prop)no-caps]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.classes()
        ).not.toContain('q-btn--no-uppercase')

        await wrapper.setProps({ noCaps: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-btn--no-uppercase')

        expect(
          target.$computedStyle('text-transform')
        ).toBe('none')
      })
    })

    describe('[(prop)no-wrap]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)

        let cls = wrapper.get('.q-btn__content').classes()
        expect(cls).not.toContain('no-wrap')
        expect(cls).not.toContain('text-no-wrap')

        await wrapper.setProps({ noWrap: true })
        await flushPromises()

        cls = wrapper.get('.q-btn__content').classes()
        expect(cls).toContain('no-wrap')
        expect(cls).toContain('text-no-wrap')
      })
    })

    describe('[(prop)dense]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.classes()
        ).not.toContain('q-btn--dense')

        await wrapper.setProps({ dense: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-btn--dense')
      })
    })

    describe('[(prop)ripple]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)

        expect(
          wrapper.find('.q-ripple')
            .exists()
        ).toBe(false)

        await wrapper.setProps({ ripple: true })
        await flushPromises()

        await wrapper.trigger('click')

        expect(
          wrapper.find('.q-ripple')
            .exists()
        ).toBe(true)
      })

      test('type Object has effect', async () => {
        const propVal = { center: true, color: 'teal', keyCodes: [] }
        const wrapper = mount(QBtn)

        expect(
          wrapper.find('.q-ripple')
            .exists()
        ).toBe(false)

        await wrapper.setProps({ ripple: propVal })
        await flushPromises()

        await wrapper.trigger('click')

        expect(
          wrapper.find('.q-ripple')
            .exists()
        ).toBe(true)
      })
    })

    describe('[(prop)tabindex]', () => {
      test.each([
        [ 'Number', 100 ],
        [ 'String', '100' ]
      ])('type %s has effect', async (_, propVal) => {
        const wrapper = mount(QBtn)

        expect(
          wrapper.attributes('tabindex')
        ).not.toBe('' + propVal)

        await wrapper.setProps({ tabindex: propVal })
        await flushPromises()

        expect(
          wrapper.attributes('tabindex')
        ).toBe('' + propVal)

        // we'll test tabindex + disable
        await wrapper.setProps({ disable: true })
        await flushPromises()

        expect(
          wrapper.attributes('tabindex')
        ).toBe('-1')

        // we'll now test loading + disable
        await wrapper.setProps({
          disable: false,
          loading: true
        })
        await flushPromises()

        expect(
          wrapper.attributes('tabindex')
        ).toBe('-1')
      })
    })

    describe('[(prop)align]', () => {
      test.each([
        [ 'left' ],
        [ 'center' ],
        [ 'right' ],
        [ 'between' ],
        [ 'around' ],
        [ 'evenly' ]
      ])('value "%s" has effect', async propVal => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn__content')

        if (propVal !== 'center') {
          // the default value
          expect(
            target.classes()
          ).not.toContain(`justify-${ alignMap[ propVal ] }`)
        }

        await wrapper.setProps({ align: propVal })
        await flushPromises()

        expect(
          target.classes()
        ).toContain(`justify-${ alignMap[ propVal ] }`)
      })
    })

    describe('[(prop)stack]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn__content')

        expect(
          target.classes()
        ).toContain('row')

        await wrapper.setProps({ stack: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('column')
      })
    })

    describe('[(prop)stretch]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.classes()
        ).not.toContain('self-stretch')

        await wrapper.setProps({ stretch: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('self-stretch')
      })
    })

    describe('[(prop)loading]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.attributes('role')
        ).not.toBe('progressbar')

        expect(
          target.attributes('aria-valuenow')
        ).toBeUndefined()

        await wrapper.setProps({ loading: true })
        await flushPromises()

        expect(
          target.attributes('role')
        ).not.toBe('progressbar')

        expect(
          target.attributes('aria-valuenow')
        ).toBeUndefined()

        expect(
          wrapper.find('.q-spinner')
            .exists()
        ).toBe(true)

        expect(
          wrapper.get('.q-btn__content')
            .classes()
        ).toContain('q-btn__content--hidden')

        await wrapper.setProps({ percentage: 50 })
        await flushPromises()

        expect(
          target.attributes('role')
        ).toBe('progressbar')

        expect(
          target.attributes('aria-valuenow')
        ).toBe('50')
      })

      test('type null has effect', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.attributes('role')
        ).not.toBe('progressbar')

        expect(
          target.attributes('aria-valuenow')
        ).toBeUndefined()

        await wrapper.setProps({ loading: null })
        await flushPromises()

        expect(
          target.attributes('role')
        ).not.toBe('progressbar')

        expect(
          target.attributes('aria-valuenow')
        ).toBeUndefined()

        expect(
          wrapper.get('.q-btn__content')
            .classes()
        ).not.toContain('q-btn__content--hidden')

        expect(
          wrapper.find('.q-spinner')
            .exists()
        ).toBe(false)
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.classes()
        ).not.toContain('disabled')

        expect(
          target.attributes('aria-disabled')
        ).not.toBe('true')

        await wrapper.setProps({ disable: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('disabled')

        expect(
          target.attributes('aria-disabled')
        ).toBe('true')
      })

      test('link + disable', async () => {
        const testRoute = '/home'
        const router = await getRouter(testRoute)

        const wrapper = mount(QBtn, {
          props: {
            disable: true,
            to: testRoute
          },
          global: {
            plugins: [ router ]
          }
        })

        expect(
          wrapper.find('a').exists()
        ).toBe(false)

        await wrapper.trigger('click')
        await flushPromises()

        expect(
          router.currentRoute.value.path
        ).not.toBe(testRoute)
      })

      test('loading + disable', async () => {
        const testRoute = '/home'
        const router = await getRouter(testRoute)

        const wrapper = mount(QBtn, {
          props: {
            loading: true,
            to: testRoute
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
    })

    describe('[(prop)round]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)
        const target = wrapper.get('.q-btn')

        expect(
          target.classes()
        ).toContain('q-btn--rectangle')

        await wrapper.setProps({ round: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-btn--round')

        expect(
          target.$computedStyle('border-radius')
        ).toBe('50%')
      })
    })

    describe('[(prop)percentage]', () => {
      test('type Number has effect', async () => {
        const propVal = 58
        const wrapper = mount(QBtn)

        expect(
          wrapper.find('.q-btn__progress')
            .exists()
        ).toBe(false)

        expect(
          wrapper.get('.q-btn')
            .attributes('aria-valuenow')
        ).toBeUndefined()

        await wrapper.setProps({ percentage: propVal })
        await flushPromises()

        expect(
          wrapper.find('.q-btn__progress')
            .exists()
        ).toBe(false)

        expect(
          wrapper.get('.q-btn')
            .attributes('aria-valuenow')
        ).toBeUndefined()

        await wrapper.setProps({ loading: true })
        await flushPromises()

        expect(
          wrapper.find('.q-btn__progress')
            .exists()
        ).toBe(true)

        expect(
          wrapper.get('.q-btn__progress-indicator')
            .$computedStyle('transform')
        ).toContain(`${ 100 - propVal }%`)

        expect(
          wrapper.find('.q-spinner')
            .exists()
        ).toBe(true)

        expect(
          wrapper.get('.q-btn')
            .attributes('aria-valuenow')
        ).toBe('' + propVal)
      })
    })

    describe('[(prop)dark-percentage]', () => {
      test('type Boolean has effect', async () => {
        const propVal = 58
        const wrapper = mount(QBtn)

        expect(
          wrapper.get('.q-btn')
            .attributes('aria-valuenow')
        ).not.toBe('' + propVal)

        expect(
          wrapper.find('.q-btn__progress')
            .exists()
        ).toBe(false)

        await wrapper.setProps({
          percentage: propVal,
          loading: true,
          darkPercentage: true
        })
        await flushPromises()

        expect(
          wrapper.get('.q-btn')
            .attributes('aria-valuenow')
        ).toBe('' + propVal)

        expect(
          wrapper.get('.q-btn__progress')
            .classes()
        ).toContain('q-btn__progress--dark')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QBtn, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.html()).toContain(slotContent)
      })
    })

    describe('[(slot)loading]', () => {
      test('renders the content', async () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QBtn, {
          slots: {
            loading: () => slotContent
          }
        })

        expect(wrapper.html()).not.toContain(slotContent)

        await wrapper.setProps({ loading: true })
        await flushPromises()

        expect(wrapper.html()).toContain(slotContent)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)click]', () => {
      test('(with route) is emitting', async () => {
        const testRoute = '/home/dashboard'
        const router = await getRouter(testRoute)

        const wrapper = mount(QBtn, {
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

      test('(with route) does not navigates when prevented', async () => {
        const testRoute = '/home/dashboard'
        const router = await getRouter(testRoute)

        const wrapper = mount(QBtn, {
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

      test('(with route) can manually navigate by calling go()', async () => {
        const testRoute = '/home/dashboard'
        const router = await getRouter(testRoute)

        const wrapper = mount(QBtn, {
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

      test('is emitting', async () => {
        const wrapper = mount(QBtn)

        await wrapper.trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('click')
        expect(eventList.click).toHaveLength(1)

        const [ evt, go ] = eventList.click[ 0 ]
        expect(evt).toBeInstanceOf(Event)
        expect(go).toBeUndefined()
      })

      test('is NOT emitting when in loading state', async () => {
        const wrapper = mount(QBtn, {
          props: {
            loading: true
          }
        })

        await wrapper.trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).not.toHaveProperty('click')
      })

      test('is NOT emitting when disabled', async () => {
        const wrapper = mount(QBtn, {
          props: {
            disable: true
          }
        })

        await wrapper.trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).not.toHaveProperty('click')
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)click]', () => {
      test('should be callable', () => {
        const event = new MouseEvent('click')
        const wrapper = mount(QBtn)

        expect(
          wrapper.vm.click(event)
        ).toBeUndefined()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('click')
        expect(eventList.click).toHaveLength(1)

        const [ evt, go ] = eventList.click[ 0 ]
        expect(evt).toBeInstanceOf(Event)
        expect(go).toBeUndefined()
      })

      test('should not do anything when disabled', () => {
        const event = new MouseEvent('click')
        const wrapper = mount(QBtn, {
          props: {
            disable: true
          }
        })

        expect(
          wrapper.vm.click(event)
        ).toBeUndefined()

        const eventList = wrapper.emitted()
        expect(eventList).not.toHaveProperty('click')
      })
    })
  })
})
