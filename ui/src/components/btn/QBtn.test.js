import { mount, flushPromises } from '@vue/test-utils'
import { describe, test, expect, vi } from 'vitest'

import QBtn from './QBtn.js'
import { btnPadding, defaultSizes } from './use-btn.js'
import { alignMap } from 'quasar/src/composables/private/use-align.js'
import { getRouter } from 'testing/runtime/router.js'

describe('[QBtn API]', () => {
  describe('[Props]', () => {
    describe('[(prop)size]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.size).toBeDefined()
      })

      test('type String has effect (in pixels)', () => {
        const propVal = '50px'
        const wrapper = mount(QBtn, {
          props: {
            size: propVal
          }
        })

        expect(
          wrapper.get('button').element.style.fontSize
        ).toBe(propVal)
      })

      test('type String has effect (as "xs")', () => {
        const wrapper = mount(QBtn, {
          props: {
            size: 'xs'
          }
        })

        expect(
          wrapper.get('button').element.style.fontSize
        ).toBe(`${ defaultSizes.xs }px`)
      })
    })

    describe('[(prop)type]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.type).toBeDefined()
      })

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
      test('is defined correctly', () => {
        expect(QBtn.props.to).toBeDefined()
      })

      test('type String has effect', async () => {
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
          props: {
            to: propVal
          },
          global: {
            plugins: [ router ]
          }
        })

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
      test('is defined correctly', () => {
        expect(QBtn.props.replace).toBeDefined()
      })

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
      test('is defined correctly', () => {
        expect(QBtn.props.href).toBeDefined()
      })

      test('type String has effect', () => {
        const propVal = 'https://quasar.dev'
        const wrapper = mount(QBtn, {
          props: {
            href: propVal
          }
        })

        expect(
          wrapper.get('a').attributes('href')
        ).toBe(propVal)
      })
    })

    describe('[(prop)target]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.target).toBeDefined()
      })

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
      test('is defined correctly', () => {
        expect(QBtn.props.label).toBeDefined()
      })

      test('type String has effect', () => {
        const propVal = 'Button Label'
        const wrapper = mount(QBtn, {
          props: {
            label: propVal
          }
        })

        expect(wrapper.text()).toContain(propVal)
      })

      test('type Number has effect', () => {
        const propVal = 10
        const wrapper = mount(QBtn, {
          props: {
            label: propVal
          }
        })

        expect(wrapper.text()).toContain('' + propVal)
      })
    })

    describe('[(prop)icon]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.icon).toBeDefined()
      })

      test('type String has effect', () => {
        const propVal = 'map'
        const wrapper = mount(QBtn, {
          props: {
            icon: propVal
          }
        })

        expect(
          wrapper.get('.q-icon').text()
        ).toContain(propVal)
      })
    })

    describe('[(prop)icon-right]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.iconRight).toBeDefined()
      })

      test('type String has effect', () => {
        const propVal = 'map'
        const wrapper = mount(QBtn, {
          props: {
            iconRight: propVal
          }
        })

        expect(
          wrapper.get('.q-icon').text()
        ).toContain(propVal)
      })
    })

    describe('[(prop)outline]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.outline).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBtn, {
          props: {
            outline: true
          }
        })

        expect(
          wrapper.get('.q-btn').classes()
        ).toContain('q-btn--outline')

        expect(
          wrapper.get('.q-btn').$computedStyle('background')
        ).toBe('transparent')
      })
    })

    describe('[(prop)flat]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.flat).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBtn, {
          props: {
            flat: true
          }
        })

        expect(
          wrapper.get('.q-btn').classes()
        ).toContain('q-btn--flat')
      })
    })

    describe('[(prop)unelevated]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.unelevated).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBtn, {
          props: {
            unelevated: true
          }
        })

        expect(
          wrapper.get('.q-btn').classes()
        ).toContain('q-btn--unelevated')
      })
    })

    describe('[(prop)rounded]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.rounded).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBtn, {
          props: {
            rounded: true
          }
        })

        expect(
          wrapper.get('.q-btn').classes()
        ).toContain('q-btn--rounded')

        expect(
          wrapper.get('.q-btn').$computedStyle('border-radius')
        ).toBe('28px')
      })
    })

    describe('[(prop)push]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.push).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBtn, {
          props: {
            push: true
          }
        })

        const target = wrapper.get('.q-btn')

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
      test('is defined correctly', () => {
        expect(QBtn.props.square).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBtn, {
          props: {
            square: true
          }
        })

        const target = wrapper.get('.q-btn')

        expect(
          target.classes()
        ).toContain('q-btn--square')

        expect(
          target.$computedStyle('border-radius')
        ).toBe('0')
      })
    })

    describe('[(prop)glossy]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.glossy).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBtn, {
          props: {
            glossy: true
          }
        })

        expect(
          wrapper.get('.q-btn').classes()
        ).toContain('glossy')
      })
    })

    describe('[(prop)fab]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.fab).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBtn, {
          props: {
            fab: true
          }
        })

        expect(
          wrapper.get('.q-btn').classes()
        ).toContain('q-btn--fab')
      })
    })

    describe('[(prop)fab-mini]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.fabMini).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBtn, {
          props: {
            fabMini: true
          }
        })

        expect(
          wrapper.get('.q-btn').classes()
        ).toContain('q-btn--fab-mini')
      })
    })

    describe('[(prop)padding]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.padding).toBeDefined()
      })

      test('type String has effect (in pixels)', () => {
        const propVal = '50px'
        const wrapper = mount(QBtn, {
          props: {
            padding: propVal
          }
        })

        expect(
          wrapper.get('button').element.style.padding
        ).toBe(propVal)
      })

      test('type String has effect (as "xs")', () => {
        const wrapper = mount(QBtn, {
          props: {
            padding: 'xs'
          }
        })

        expect(
          wrapper.get('button').element.style.padding
        ).toBe(`${ btnPadding.xs }px`)
      })
    })

    describe('[(prop)color]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.color).toBeDefined()
      })

      test('(default design) is applied correctly', () => {
        const wrapper = mount(QBtn, {
          props: {
            color: 'red'
          }
        })

        const cls = wrapper.get('button').classes()
        expect(cls).toContain('bg-red')
        expect(cls).toContain('text-white')
      })

      test.each([
        [ 'push' ],
        [ 'unelevated' ]
      ])('(design "%s") is applied correctly', designProp => {
        const wrapper = mount(QBtn, {
          props: {
            color: 'red',
            [ designProp ]: true
          }
        })

        const cls = wrapper.get('button').classes()
        expect(cls).toContain('bg-red')
        expect(cls).toContain('text-white')
      })

      test.each([
        [ 'flat' ],
        [ 'outline' ]
      ])('(design "%s") is applied correctly', designProp => {
        const wrapper = mount(QBtn, {
          props: {
            color: 'red',
            [ designProp ]: true
          }
        })

        const cls = wrapper.get('button').classes()
        expect(cls).toContain('text-red')
        expect(cls).not.toContain('bg-red')
      })
    })

    describe('[(prop)text-color]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.textColor).toBeDefined()
      })

      test('is applied correctly with no "color" prop', () => {
        const wrapper = mount(QBtn, {
          props: {
            textColor: 'red'
          }
        })

        const cls = wrapper.get('button').classes()
        expect(cls).toContain('text-red')
        expect(cls).not.toContain('bg-red')
      })

      test('(default design + color) is applied correctly', () => {
        const wrapper = mount(QBtn, {
          props: {
            color: 'red',
            textColor: 'blue'
          }
        })

        const cls = wrapper.get('button').classes()

        expect(cls).toContain('bg-red')
        expect(cls).toContain('text-blue')

        expect(cls).not.toContain('text-red')
        expect(cls).not.toContain('bg-blue')
      })

      test.each([
        [ 'push' ],
        [ 'unelevated' ]
      ])('(design "%s" + color) is applied correctly', designProp => {
        const wrapper = mount(QBtn, {
          props: {
            color: 'red',
            textColor: 'blue',
            [ designProp ]: true
          }
        })

        const cls = wrapper.get('button').classes()

        expect(cls).toContain('bg-red')
        expect(cls).toContain('text-blue')

        expect(cls).not.toContain('text-red')
        expect(cls).not.toContain('bg-blue')
      })

      test.each([
        [ 'flat' ],
        [ 'outline' ]
      ])('(design "%s" + color) is applied correctly', designProp => {
        const wrapper = mount(QBtn, {
          props: {
            color: 'red',
            textColor: 'blue',
            [ designProp ]: true
          }
        })

        const cls = wrapper.get('button').classes()

        expect(cls).toContain('text-blue')

        expect(cls).not.toContain('text-red')
        expect(cls).not.toContain('bg-red')
        expect(cls).not.toContain('bg-blue')
      })
    })

    describe('[(prop)no-caps]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.noCaps).toBeDefined()
      })

      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)

        expect(
          wrapper.get('button').$computedStyle('text-transform')
        ).toBe('uppercase')

        await wrapper.setProps({ noCaps: true })
        await flushPromises()

        expect(
          wrapper.get('button').classes()
        ).toContain('q-btn--no-uppercase')
      })
    })

    describe('[(prop)no-wrap]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.noWrap).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBtn, {
          props: {
            noWrap: true
          }
        })

        const cls = wrapper.get('.q-btn__content').classes()
        expect(cls).toContain('no-wrap')
        expect(cls).toContain('text-no-wrap')
      })
    })

    describe('[(prop)dense]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.dense).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBtn, {
          props: {
            dense: true
          }
        })

        expect(
          wrapper.get('.q-btn').classes()
        ).toContain('q-btn--dense')
      })
    })

    describe('[(prop)ripple]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.ripple).toBeDefined()
      })

      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn, {
          props: {
            ripple: true
          }
        })

        await wrapper.trigger('click')

        expect(
          wrapper.find('.q-ripple')
            .exists()
        ).toBe(true)
      })

      test('type Object has effect', async () => {
        const wrapper = mount(QBtn, {
          props: {
            ripple: { center: true }
          }
        })

        await wrapper.trigger('click')

        expect(
          wrapper.find('.q-ripple')
            .exists()
        ).toBe(true)
      })
    })

    describe('[(prop)tabindex]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.tabindex).toBeDefined()
      })

      test.each([
        [ 'Number', 100 ],
        [ 'String', '100' ]
      ])('type %s has effect', async (_, propVal) => {
        const wrapper = mount(QBtn, {
          props: {
            tabindex: propVal
          }
        })

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
      test('is defined correctly', () => {
        expect(QBtn.props.align).toBeDefined()
      })

      test.each([
        [ 'left' ],
        [ 'center' ],
        [ 'right' ],
        [ 'between' ],
        [ 'around' ],
        [ 'evenly' ]
      ])('value "%s" has effect', propVal => {
        const wrapper = mount(QBtn, {
          props: {
            align: propVal
          }
        })

        expect(
          wrapper.get('.q-btn__content')
            .classes()
        ).toContain(`justify-${ alignMap[ propVal ] }`)
      })
    })

    describe('[(prop)stack]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.stack).toBeDefined()
      })

      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)

        expect(
          wrapper.get('.q-btn__content')
            .classes()
        ).toContain('row')

        await wrapper.setProps({ stack: true })
        await flushPromises()

        expect(
          wrapper.get('.q-btn__content')
            .classes()
        ).toContain('column')
      })
    })

    describe('[(prop)stretch]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.stretch).toBeDefined()
      })

      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)

        expect(
          wrapper.get('button')
            .classes()
        ).not.toContain('self-stretch')

        await wrapper.setProps({ stretch: true })
        await flushPromises()

        expect(
          wrapper.get('button')
            .classes()
        ).toContain('self-stretch')
      })
    })

    describe('[(prop)loading]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.loading).toBeDefined()
      })

      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn, {
          props: {
            loading: true
          }
        })

        expect(
          wrapper.get('button')
            .attributes('role')
        ).not.toBe('progressbar')

        expect(
          wrapper.get('button')
            .attributes('aria-valuenow')
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
          wrapper.get('button')
            .attributes('role')
        ).toBe('progressbar')

        expect(
          wrapper.get('button')
            .attributes('aria-valuenow')
        ).toBe('50')
      })

      test('type null has effect', () => {
        const wrapper = mount(QBtn, {
          props: {
            loading: null
          }
        })

        expect(
          wrapper.get('button')
            .attributes('role')
        ).not.toBe('progressbar')

        expect(
          wrapper.get('button')
            .attributes('aria-valuenow')
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
      test('is defined correctly', () => {
        expect(QBtn.props.disable).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBtn, {
          props: {
            disable: true
          }
        })

        expect(
          wrapper.get('button')
            .classes()
        ).toContain('disabled')

        expect(
          wrapper.get('button')
            .attributes('aria-disabled')
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
      test('is defined correctly', () => {
        expect(QBtn.props.round).toBeDefined()
      })

      test('type Boolean has effect', async () => {
        const wrapper = mount(QBtn)

        expect(
          wrapper.get('button')
            .classes()
        ).toContain('q-btn--rectangle')

        await wrapper.setProps({ round: true })
        await flushPromises()

        const target = wrapper.get('button')

        expect(
          target.classes()
        ).toContain('q-btn--round')

        expect(
          target.$computedStyle('border-radius')
        ).toBe('50%')
      })
    })

    describe('[(prop)percentage]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.percentage).toBeDefined()
      })

      test('type Number has effect', async () => {
        const percentage = 58
        const wrapper = mount(QBtn, {
          props: {
            percentage
          }
        })

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
        ).toContain(`${ 100 - percentage }%`)

        expect(
          wrapper.find('.q-spinner')
            .exists()
        ).toBe(true)

        expect(
          wrapper.get('.q-btn')
            .attributes('aria-valuenow')
        ).toBe('' + percentage)
      })
    })

    describe('[(prop)dark-percentage]', () => {
      test('is defined correctly', () => {
        expect(QBtn.props.darkPercentage).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const percentage = 50
        const wrapper = mount(QBtn, {
          props: {
            percentage,
            loading: true,
            darkPercentage: true
          }
        })

        expect(
          wrapper.get('.q-btn')
            .attributes('aria-valuenow')
        ).toBe(percentage.toString())

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
      test('is defined correctly', () => {
        expect(
          QBtn.emits?.includes('click')
          ^ (QBtn.props?.onClick !== void 0)
        ).toBe(1)
      })

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
