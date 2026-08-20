import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { h } from 'vue'

import { alignMap } from 'quasar/src/composables/private.use-align/use-align.js'
import { getRouter } from 'testing/runtime/router.js'
import QBtnDropdown from './QBtnDropdown.js'
import QTooltip from '../tooltip/QTooltip.js'

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
 * The dropdown menu is rendered through a portal, so it gets looked up
 * in the document instead of inside of the wrapper.
 */
function mountBtnDropdown(props, slots, mountOptions) {
  props ||= {}
  mountOptions ||= {}

  activeWrapper = mount(QBtnDropdown, {
    props,
    slots: { default: () => 'Menu content', ...slots },
    attachTo: document.body,
    ...mountOptions
  })

  return activeWrapper
}

function getRoot(wrapper) {
  return wrapper.get('.q-btn-dropdown')
}

function getMainBtn(wrapper) {
  // in split mode the component renders two buttons
  return wrapper.find('.q-btn-dropdown--current').exists()
    ? wrapper.get('.q-btn-dropdown--current')
    : getRoot(wrapper)
}

function getArrowBtn(wrapper) {
  return wrapper.get('.q-btn-dropdown__arrow-container')
}

function getArrowIcon(wrapper) {
  return wrapper.get('.q-btn-dropdown__arrow')
}

function getContent(wrapper) {
  return wrapper.get('.q-btn__content')
}

function getMenu() {
  return document.querySelector('.q-menu')
}

function getIconTexts(wrapper) {
  return wrapper.findAll('.q-icon').map(icon => icon.text())
}

async function settle() {
  await flushPromises()
  await vi.runAllTimersAsync()
}

async function showMenu(wrapper) {
  wrapper.vm.show()
  await settle()
}

async function hideMenu(wrapper) {
  wrapper.vm.hide()
  await settle()
}

/**
 * The button becomes a real fixed-positioned 100x50 box at (100, 100),
 * which means:
 *   top: 100, center: 125, bottom: 150
 *   left: 100, middle: 150, right: 200
 */
function givePositionContext(wrapper) {
  // the button content carries "q-anchor--skip", so the menu anchors
  // itself to the button element itself
  Object.assign(getRoot(wrapper).element.style, {
    position: 'fixed',
    top: '100px',
    left: '100px',
    width: '100px',
    height: '50px'
  })
}

/**
 * Mounts a dropdown with deterministic real geometry: the button is the
 * box described above and the menu content a real 50x20 box, so the
 * position engine measures everything through the actual layout engine.
 * Everything sits far from the viewport edges, so nothing gets clamped.
 */
async function mountPositionedBtnDropdown(props) {
  const wrapper = mountBtnDropdown(props, {
    default: () => h('div', { style: { width: '50px', height: '20px' } })
  })

  givePositionContext(wrapper)
  await showMenu(wrapper)

  return wrapper
}

describe('[QBtnDropdown API]', () => {
  describe('[Props]', () => {
    describe('[(prop)transition-show]', () => {
      test('type String has effect', async () => {
        const propVal = 'scale'
        // @vue/test-utils stubs out Transition by default; disable the
        // stub so that the real transition can be watched while it runs
        const wrapper = mountBtnDropdown({ transitionShow: propVal }, void 0, {
          global: { stubs: { transition: false } }
        })

        wrapper.vm.show()
        await flushPromises()

        // while entering, the menu carries the requested enter classes
        expect(getMenu().classList).toContain(
          `q-transition--${propVal}-enter-active`
        )

        await vi.runAllTimersAsync()

        // and it sheds them once the transition is over
        expect(getMenu().classList).not.toContain(
          `q-transition--${propVal}-enter-active`
        )
      })
    })

    describe('[(prop)transition-hide]', () => {
      test('type String has effect', async () => {
        const propVal = 'scale'
        // @vue/test-utils stubs out Transition by default; disable the
        // stub so that the real transition can be watched while it runs
        const wrapper = mountBtnDropdown({ transitionHide: propVal }, void 0, {
          global: { stubs: { transition: false } }
        })

        await showMenu(wrapper)

        wrapper.vm.hide()
        await flushPromises()

        // while leaving, the menu carries the requested leave classes
        expect(getMenu().classList).toContain(
          `q-transition--${propVal}-leave-active`
        )

        await vi.runAllTimersAsync()

        // and it is gone once the transition is over
        expect(getMenu()).toBeNull()
      })
    })

    describe('[(prop)transition-duration]', () => {
      test('type String has effect', async () => {
        const wrapper = mountBtnDropdown({ transitionDuration: '450' })

        await showMenu(wrapper)

        expect(
          getMenu().style.getPropertyValue('--q-transition-duration')
        ).toBe('450ms')
      })

      test('type Number has effect', async () => {
        const wrapper = mountBtnDropdown({ transitionDuration: 450 })

        wrapper.vm.show()
        await flushPromises()

        expect(
          getMenu().style.getPropertyValue('--q-transition-duration')
        ).toBe('450ms')

        // the show event is delayed by the transition duration
        expect(wrapper.emitted('show')).toBeUndefined()

        await vi.advanceTimersByTimeAsync(450)

        expect(wrapper.emitted('show')).toHaveLength(1)
      })
    })

    describe('[(prop)model-value]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown({ modelValue: true })

        await settle()

        expect(getMenu()).not.toBeNull()
        expect(getRoot(wrapper).attributes('aria-expanded')).toBe('true')

        await wrapper.setProps({ modelValue: false })
        await settle()

        expect(getMenu()).toBeNull()
        expect(getRoot(wrapper).attributes('aria-expanded')).toBe('false')
      })
    })

    describe('[(prop)size]', () => {
      test('type String has effect', async () => {
        const propVal = '50px'
        const wrapper = mountBtnDropdown()

        expect(getRoot(wrapper).$style('font-size')).not.toBe(propVal)

        await wrapper.setProps({ size: propVal })

        expect(getRoot(wrapper).$style('font-size')).toBe(propVal)
      })
    })

    describe('[(prop)type]', () => {
      test('type String has effect', async () => {
        const wrapper = mountBtnDropdown()

        expect(getRoot(wrapper).element.tagName.toLowerCase()).toBe('button')
        expect(getRoot(wrapper).attributes('type')).toBe('button')

        await wrapper.setProps({ type: 'submit' })

        expect(getRoot(wrapper).attributes('type')).toBe('submit')

        await wrapper.setProps({ type: 'a' })

        expect(getRoot(wrapper).element.tagName.toLowerCase()).toBe('a')
      })
    })

    describe('[(prop)to]', () => {
      test('type String has effect', async () => {
        const testRoute = '/home/dashboard'
        const router = await getRouter(testRoute)
        const wrapper = mountBtnDropdown({ to: testRoute }, void 0, {
          global: { plugins: [router] }
        })

        expect(wrapper.get('a').attributes('href')).toBe(testRoute)

        const routerFn = vi.spyOn(router, 'push')

        await getRoot(wrapper).trigger('click')
        await flushPromises()

        expect(routerFn).toHaveBeenCalledWith(testRoute)
      })

      test('type Object has effect', async () => {
        const testRoute = '/my-route-name'
        const propVal = { path: testRoute }
        const router = await getRouter(testRoute)
        const wrapper = mountBtnDropdown({ to: propVal }, void 0, {
          global: { plugins: [router] }
        })

        expect(wrapper.get('a').attributes('href')).toBe(testRoute)

        const routerFn = vi.spyOn(router, 'push')

        await getRoot(wrapper).trigger('click')
        await flushPromises()

        expect(routerFn).toHaveBeenCalledWith(propVal)
      })
    })

    describe('[(prop)replace]', () => {
      test('type Boolean has effect', async () => {
        const testRoute = '/test-route'
        const router = await getRouter(testRoute)
        const wrapper = mountBtnDropdown(
          { to: testRoute, replace: true },
          void 0,
          { global: { plugins: [router] } }
        )

        const routerFn = vi.spyOn(router, 'replace')

        await getRoot(wrapper).trigger('click')
        await flushPromises()

        expect(routerFn).toHaveBeenCalledWith(testRoute)
      })
    })

    describe('[(prop)href]', () => {
      test('type String has effect', async () => {
        const propVal = 'https://quasar.dev'
        const wrapper = mountBtnDropdown()

        expect(wrapper.find('a').exists()).toBe(false)

        await wrapper.setProps({ href: propVal })

        expect(wrapper.get('a').attributes('href')).toBe(propVal)
      })
    })

    describe('[(prop)target]', () => {
      test('type String has effect', () => {
        const propVal = '_blank'
        const wrapper = mountBtnDropdown({
          href: 'https://quasar.dev',
          target: propVal
        })

        expect(wrapper.get('a').attributes('target')).toBe(propVal)
      })
    })

    describe('[(prop)label]', () => {
      test('type String has effect', async () => {
        const propVal = 'Button Label'
        const wrapper = mountBtnDropdown()

        expect(wrapper.text()).not.toContain(propVal)

        await wrapper.setProps({ label: propVal })

        expect(wrapper.text()).toContain(propVal)
      })

      test('type Number has effect', async () => {
        const propVal = 10
        const wrapper = mountBtnDropdown()

        await wrapper.setProps({ label: propVal })

        expect(wrapper.text()).toContain(String(propVal))
      })
    })

    describe('[(prop)icon]', () => {
      test('type String has effect', async () => {
        const propVal = 'map'
        const wrapper = mountBtnDropdown()

        // the dropdown arrow is an icon of its own
        expect(getIconTexts(wrapper)).not.toContain(propVal)

        await wrapper.setProps({ icon: propVal })

        expect(getIconTexts(wrapper)[0]).toBe(propVal)
      })
    })

    describe('[(prop)icon-right]', () => {
      test('type String has effect', async () => {
        const propVal = 'map'
        const wrapper = mountBtnDropdown()

        expect(getIconTexts(wrapper)).not.toContain(propVal)

        await wrapper.setProps({ iconRight: propVal })

        expect(getIconTexts(wrapper)).toContain(propVal)
      })
    })

    describe('[(prop)outline]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown()

        expect(getRoot(wrapper).classes()).not.toContain('q-btn--outline')

        await wrapper.setProps({ outline: true })

        expect(getRoot(wrapper).classes()).toContain('q-btn--outline')
      })
    })

    describe('[(prop)flat]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown()

        expect(getRoot(wrapper).classes()).not.toContain('q-btn--flat')

        await wrapper.setProps({ flat: true })

        expect(getRoot(wrapper).classes()).toContain('q-btn--flat')
      })
    })

    describe('[(prop)unelevated]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown()

        expect(getRoot(wrapper).classes()).not.toContain('q-btn--unelevated')

        await wrapper.setProps({ unelevated: true })

        expect(getRoot(wrapper).classes()).toContain('q-btn--unelevated')
      })
    })

    describe('[(prop)rounded]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown()

        expect(getRoot(wrapper).classes()).not.toContain('q-btn--rounded')

        await wrapper.setProps({ rounded: true })

        expect(getRoot(wrapper).classes()).toContain('q-btn--rounded')
      })
    })

    describe('[(prop)push]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown()

        expect(getRoot(wrapper).classes()).not.toContain('q-btn--push')

        await wrapper.setProps({ push: true })

        expect(getRoot(wrapper).classes()).toContain('q-btn--push')
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown()

        expect(getRoot(wrapper).classes()).not.toContain('q-btn--square')

        await wrapper.setProps({ square: true })

        expect(getRoot(wrapper).classes()).toContain('q-btn--square')
      })
    })

    describe('[(prop)glossy]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown()

        expect(getRoot(wrapper).classes()).not.toContain('glossy')

        await wrapper.setProps({ glossy: true })

        expect(getRoot(wrapper).classes()).toContain('glossy')
      })
    })

    describe('[(prop)fab]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown()

        expect(getRoot(wrapper).classes()).not.toContain('q-btn--fab')

        await wrapper.setProps({ fab: true })

        expect(getRoot(wrapper).classes()).toContain('q-btn--fab')
      })
    })

    describe('[(prop)fab-mini]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown()

        expect(getRoot(wrapper).classes()).not.toContain('q-btn--fab-mini')

        await wrapper.setProps({ fabMini: true })

        expect(getRoot(wrapper).classes()).toContain('q-btn--fab-mini')
      })
    })

    describe('[(prop)padding]', () => {
      test('type String has effect', async () => {
        const propVal = '50px 100px'
        const wrapper = mountBtnDropdown()

        expect(getRoot(wrapper).$style('padding')).not.toBe(propVal)

        await wrapper.setProps({ padding: propVal })

        expect(getRoot(wrapper).$style('padding')).toBe(propVal)
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountBtnDropdown()

        expect(getRoot(wrapper).classes()).not.toContain(`bg-${propVal}`)

        await wrapper.setProps({ color: propVal })

        expect(getRoot(wrapper).classes()).toEqual(
          expect.arrayContaining([`bg-${propVal}`, 'text-white'])
        )
      })
    })

    describe('[(prop)text-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountBtnDropdown({ color: 'red' })

        expect(getRoot(wrapper).classes()).not.toContain(`text-${propVal}`)

        await wrapper.setProps({ textColor: propVal })

        expect(getRoot(wrapper).classes()).toEqual(
          expect.arrayContaining(['bg-red', `text-${propVal}`])
        )
      })
    })

    describe('[(prop)no-caps]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown()

        expect(getRoot(wrapper).classes()).not.toContain('q-btn--no-uppercase')

        await wrapper.setProps({ noCaps: true })

        expect(getRoot(wrapper).classes()).toContain('q-btn--no-uppercase')
      })
    })

    describe('[(prop)no-wrap]', () => {
      test('type Boolean has effect', () => {
        // the dropdown always renders its button with no-wrap turned on
        const wrapper = mountBtnDropdown({ noWrap: false })

        expect(getContent(wrapper).classes()).toEqual(
          expect.arrayContaining(['no-wrap', 'text-no-wrap'])
        )
      })
    })

    describe('[(prop)dense]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown()

        expect(getRoot(wrapper).classes()).not.toContain('q-btn--dense')

        await wrapper.setProps({ dense: true })

        expect(getRoot(wrapper).classes()).toContain('q-btn--dense')
      })
    })

    describe('[(prop)ripple]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown({ ripple: false })

        await getRoot(wrapper).trigger('click')

        expect(wrapper.find('.q-ripple').exists()).toBe(false)

        await wrapper.setProps({ ripple: true })
        await getRoot(wrapper).trigger('click')

        expect(wrapper.find('.q-ripple').exists()).toBe(true)
      })

      test('type Object has effect', async () => {
        const propVal = { center: true, color: 'teal', keyCodes: [] }
        const wrapper = mountBtnDropdown({ ripple: false })

        await wrapper.setProps({ ripple: propVal })
        await getRoot(wrapper).trigger('click')

        expect(wrapper.find('.q-ripple').exists()).toBe(true)
      })
    })

    describe('[(prop)tabindex]', () => {
      test('type Number has effect', async () => {
        const propVal = 100
        const wrapper = mountBtnDropdown()

        expect(getRoot(wrapper).attributes('tabindex')).not.toBe(
          String(propVal)
        )

        await wrapper.setProps({ tabindex: propVal })

        expect(getRoot(wrapper).attributes('tabindex')).toBe(String(propVal))

        await wrapper.setProps({ disable: true })

        expect(getRoot(wrapper).attributes('tabindex')).toBe('-1')
      })

      test('type String has effect', () => {
        const propVal = '100'
        const wrapper = mountBtnDropdown({ tabindex: propVal })

        expect(getRoot(wrapper).attributes('tabindex')).toBe(propVal)
      })
    })

    describe('[(prop)align]', () => {
      async function testAlign(propVal) {
        const wrapper = mountBtnDropdown()

        if (propVal !== 'center') {
          expect(getContent(wrapper).classes()).not.toContain(
            `justify-${alignMap[propVal]}`
          )
        }

        await wrapper.setProps({ align: propVal })

        expect(getContent(wrapper).classes()).toContain(
          `justify-${alignMap[propVal]}`
        )
      }

      test('value "left" has effect', async () => {
        await testAlign('left')
      })

      test('value "right" has effect', async () => {
        await testAlign('right')
      })

      test('value "center" has effect', async () => {
        await testAlign('center')
      })

      test('value "around" has effect', async () => {
        await testAlign('around')
      })

      test('value "between" has effect', async () => {
        await testAlign('between')
      })

      test('value "evenly" has effect', async () => {
        await testAlign('evenly')
      })
    })

    describe('[(prop)stack]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown()

        expect(getContent(wrapper).classes()).toContain('row')

        await wrapper.setProps({ stack: true })

        expect(getContent(wrapper).classes()).toContain('column')
      })
    })

    describe('[(prop)stretch]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown()

        expect(getRoot(wrapper).classes()).not.toContain('self-stretch')

        await wrapper.setProps({ stretch: true })

        expect(getRoot(wrapper).classes()).toContain('self-stretch')
      })
    })

    describe('[(prop)loading]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown()

        expect(wrapper.find('.q-spinner').exists()).toBe(false)

        await wrapper.setProps({ loading: true })

        expect(wrapper.find('.q-spinner').exists()).toBe(true)
        expect(getContent(wrapper).classes()).toContain(
          'q-btn__content--hidden'
        )
      })

      test('type null has effect', async () => {
        const wrapper = mountBtnDropdown()

        await wrapper.setProps({ loading: null })

        expect(wrapper.find('.q-spinner').exists()).toBe(false)
        expect(getContent(wrapper).classes()).not.toContain(
          'q-btn__content--hidden'
        )
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown()

        await wrapper.setProps({ disable: true })

        expect(getRoot(wrapper).classes()).toContain('disabled')
        expect(getRoot(wrapper).attributes('aria-disabled')).toBe('true')

        await getRoot(wrapper).trigger('click')
        await settle()

        expect(getMenu()).toBeNull()
        expect(wrapper.emitted('click')).toBeUndefined()
      })
    })

    describe('[(prop)split]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown({ split: true, label: 'Split' })

        expect(getRoot(wrapper).classes()).toContain('q-btn-dropdown--split')
        expect(wrapper.findAll('.q-btn')).toHaveLength(2)

        // only the arrow half opens the menu
        await getMainBtn(wrapper).trigger('click')
        await settle()

        expect(getMenu()).toBeNull()
        expect(wrapper.emitted('click')).toHaveLength(1)

        await getArrowBtn(wrapper).trigger('click')
        await settle()

        expect(getMenu()).not.toBeNull()
      })

      test('keeps the menu anchored to the whole component', async () => {
        await mountPositionedBtnDropdown({ split: true, label: 'Split' })

        // "fit" sizes the menu to its anchor: the full 100px wide
        // component, not the narrower toggle button hosting it
        expect(getMenu().style.minWidth).toBe('100px')
        expect(getMenu().style.top).toBe('150px')
      })
    })

    describe('[(prop)dropdown-icon]', () => {
      test('type String has effect', async () => {
        const propVal = 'map'
        const wrapper = mountBtnDropdown()

        const defaultIcon = getArrowIcon(wrapper).text()
        expect(defaultIcon).not.toBe(propVal)

        await wrapper.setProps({ dropdownIcon: propVal })

        expect(getArrowIcon(wrapper).text()).toBe(propVal)
      })
    })

    describe('[(prop)disable-main-btn]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown({ split: true, label: 'Split' })

        await wrapper.setProps({ disableMainBtn: true })

        expect(getMainBtn(wrapper).classes()).toContain('disabled')
        // the dropdown half keeps working
        expect(getArrowBtn(wrapper).classes()).not.toContain('disabled')

        await getArrowBtn(wrapper).trigger('click')
        await settle()

        expect(getMenu()).not.toBeNull()
      })
    })

    describe('[(prop)disable-dropdown]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown({ disableDropdown: true })

        expect(getRoot(wrapper).attributes('aria-disabled')).toBe('true')

        await getRoot(wrapper).trigger('click')
        await settle()

        // there is no menu at all
        expect(getMenu()).toBeNull()
        expect(wrapper.findComponent({ name: 'QMenu' }).exists()).toBe(false)
      })
    })

    describe('[(prop)no-icon-animation]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown()

        await showMenu(wrapper)

        expect(getArrowIcon(wrapper).classes()).toContain('rotate-180')

        await wrapper.setProps({ noIconAnimation: true })

        expect(getArrowIcon(wrapper).classes()).not.toContain('rotate-180')
      })
    })

    describe('[(prop)content-style]', () => {
      test('type String has effect', async () => {
        const wrapper = mountBtnDropdown({ contentStyle: 'color: red' })

        await showMenu(wrapper)

        expect(getMenu().style.color).toBe('red')
      })

      test('type Array has effect', async () => {
        const wrapper = mountBtnDropdown({
          contentStyle: ['color: red', { backgroundColor: 'blue' }]
        })

        await showMenu(wrapper)

        expect(getMenu().style.color).toBe('red')
        expect(getMenu().style.backgroundColor).toBe('blue')
      })

      test('type Object has effect', async () => {
        const wrapper = mountBtnDropdown({ contentStyle: { color: 'red' } })

        await showMenu(wrapper)

        expect(getMenu().style.color).toBe('red')
      })
    })

    describe('[(prop)content-class]', () => {
      test('type String has effect', async () => {
        const propVal = 'my-class'
        const wrapper = mountBtnDropdown({ contentClass: propVal })

        await showMenu(wrapper)

        expect(getMenu().classList).toContain(propVal)
      })

      test('type Array has effect', async () => {
        const wrapper = mountBtnDropdown({
          contentClass: ['my-class', 'my-other-class']
        })

        await showMenu(wrapper)

        expect(getMenu().classList).toContain('my-class')
        expect(getMenu().classList).toContain('my-other-class')
      })

      test('type Object has effect', async () => {
        const wrapper = mountBtnDropdown({
          contentClass: { 'my-class': true, unused: false }
        })

        await showMenu(wrapper)

        expect(getMenu().classList).toContain('my-class')
        expect(getMenu().classList).not.toContain('unused')
      })
    })

    describe('[(prop)cover]', () => {
      test('type Boolean has effect', async () => {
        await mountPositionedBtnDropdown()

        expect(getMenu().style.top).toBe('150px')
        expect(getMenu().style.minHeight).toBe('')

        activeWrapper.unmount()
        await vi.runAllTimersAsync()

        await mountPositionedBtnDropdown({ cover: true })

        // the menu now sits on top of the button
        expect(getMenu().style.top).toBe('100px')
        expect(getMenu().style.minHeight).toBe('50px')
      })
    })

    describe('[(prop)persistent]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown({ persistent: true })

        await showMenu(wrapper)

        window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27 }))
        window.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 27 }))
        await settle()

        expect(getMenu()).not.toBeNull()
      })
    })

    describe('[(prop)hover]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown({ hover: true })

        await getRoot(wrapper).trigger('pointerenter', {
          pointerType: 'mouse'
        })
        await flushPromises()

        expect(getMenu()).not.toBeNull()

        await getRoot(wrapper).trigger('pointerleave', {
          pointerType: 'mouse'
        })
        await settle()

        expect(getMenu()).toBeNull()
      })
    })

    describe('[(prop)hover-delay]', () => {
      test('type Number has effect', async () => {
        const wrapper = mountBtnDropdown({ hover: true, hoverDelay: 500 })

        await getRoot(wrapper).trigger('pointerenter', {
          pointerType: 'mouse'
        })
        await vi.advanceTimersByTimeAsync(499)

        expect(getMenu()).toBeNull()

        await vi.advanceTimersByTimeAsync(1)
        await flushPromises()

        expect(getMenu()).not.toBeNull()
      })
    })

    describe('[(prop)hover-hide-delay]', () => {
      test('type Number has effect', async () => {
        const wrapper = mountBtnDropdown({ hover: true, hoverHideDelay: 500 })

        await getRoot(wrapper).trigger('pointerenter', {
          pointerType: 'mouse'
        })
        await settle()
        expect(getMenu()).not.toBeNull()

        await getRoot(wrapper).trigger('pointerleave', {
          pointerType: 'mouse'
        })
        await vi.advanceTimersByTimeAsync(499)

        expect(getMenu()).not.toBeNull()

        await settle()

        expect(getMenu()).toBeNull()
      })
    })

    describe('[(prop)no-esc-dismiss]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown({ noEscDismiss: true })

        await showMenu(wrapper)

        window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27 }))
        window.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 27 }))
        await settle()

        expect(getMenu()).not.toBeNull()
      })

      test('closes on ESC without it', async () => {
        const wrapper = mountBtnDropdown()

        await showMenu(wrapper)

        window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27 }))
        window.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 27 }))
        await settle()

        expect(getMenu()).toBeNull()
      })
    })

    describe('[(prop)no-route-dismiss]', () => {
      test('type Boolean has effect', async () => {
        const router = await getRouter('/other')
        const wrapper = mountBtnDropdown({ noRouteDismiss: true }, void 0, {
          global: { plugins: [router] }
        })

        await showMenu(wrapper)

        router.push('/other')
        await settle()

        expect(getMenu()).not.toBeNull()
      })
    })

    describe('[(prop)auto-close]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountBtnDropdown(
          { autoClose: true },
          { default: () => h('div', { class: 'my-item' }, 'Item') }
        )

        await showMenu(wrapper)

        document
          .querySelector('.q-menu .my-item')
          .dispatchEvent(new MouseEvent('click', { bubbles: true }))
        await settle()

        expect(getMenu()).toBeNull()
      })
    })

    describe('[(prop)no-refocus]', () => {
      test('type Boolean has effect', async () => {
        const button = document.createElement('button')
        document.body.append(button)

        try {
          const wrapper = mountBtnDropdown({ noRefocus: true })

          button.focus()
          await showMenu(wrapper)
          await hideMenu(wrapper)

          // the previously focused element is not restored
          expect(document.activeElement).not.toBe(button)
        } finally {
          button.remove()
        }
      })

      test('refocuses the previous element without it', async () => {
        const button = document.createElement('button')
        document.body.append(button)

        try {
          const wrapper = mountBtnDropdown()

          button.focus()
          await showMenu(wrapper)
          await hideMenu(wrapper)

          expect(document.activeElement).toBe(button)
        } finally {
          button.remove()
        }
      })
    })

    describe('[(prop)no-focus]', () => {
      test('type Boolean has effect', async () => {
        const button = document.createElement('button')
        document.body.append(button)

        try {
          const wrapper = mountBtnDropdown({ noFocus: true })

          button.focus()
          await showMenu(wrapper)

          // the menu does not steal the focus
          expect(document.activeElement).toBe(button)
        } finally {
          button.remove()
        }
      })
    })

    describe('[(prop)menu-anchor]', () => {
      const anchorPositionList = [
        ['top left', '100px', '0px'],
        ['top middle', '100px', '50px'],
        ['top right', '100px', '100px'],
        ['top start', '100px', '0px'],
        ['top end', '100px', '100px'],
        ['center left', '125px', '0px'],
        ['center middle', '125px', '50px'],
        ['center right', '125px', '100px'],
        ['center start', '125px', '0px'],
        ['center end', '125px', '100px'],
        ['bottom left', '150px', '0px'],
        ['bottom middle', '150px', '50px'],
        ['bottom right', '150px', '100px'],
        ['bottom start', '150px', '0px'],
        ['bottom end', '150px', '100px']
      ]

      /**
       * The menu is as wide as the button (it is always "fit") and
       * attaches its default "top end" corner to the requested point.
       */
      async function testMenuAnchor(propVal) {
        const [, top, left] = anchorPositionList.find(
          ([value]) => value === propVal
        )

        await mountPositionedBtnDropdown({ menuAnchor: propVal })

        expect(getMenu().style.top).toBe(top)
        expect(getMenu().style.left).toBe(left)
      }

      test('value "top left" has effect', async () => {
        await testMenuAnchor('top left')
      })

      test('value "top middle" has effect', async () => {
        await testMenuAnchor('top middle')
      })

      test('value "top right" has effect', async () => {
        await testMenuAnchor('top right')
      })

      test('value "top start" has effect', async () => {
        await testMenuAnchor('top start')
      })

      test('value "top end" has effect', async () => {
        await testMenuAnchor('top end')
      })

      test('value "center left" has effect', async () => {
        await testMenuAnchor('center left')
      })

      test('value "center middle" has effect', async () => {
        await testMenuAnchor('center middle')
      })

      test('value "center right" has effect', async () => {
        await testMenuAnchor('center right')
      })

      test('value "center start" has effect', async () => {
        await testMenuAnchor('center start')
      })

      test('value "center end" has effect', async () => {
        await testMenuAnchor('center end')
      })

      test('value "bottom left" has effect', async () => {
        await testMenuAnchor('bottom left')
      })

      test('value "bottom middle" has effect', async () => {
        await testMenuAnchor('bottom middle')
      })

      test('value "bottom right" has effect', async () => {
        await testMenuAnchor('bottom right')
      })

      test('value "bottom start" has effect', async () => {
        await testMenuAnchor('bottom start')
      })

      test('value "bottom end" has effect', async () => {
        await testMenuAnchor('bottom end')
      })
    })

    describe('[(prop)menu-self]', () => {
      const selfPositionList = [
        ['top left', '150px', '200px'],
        ['top middle', '150px', '150px'],
        ['top right', '150px', '100px'],
        ['top start', '150px', '200px'],
        ['top end', '150px', '100px'],
        ['center left', '140px', '200px'],
        ['center middle', '140px', '150px'],
        ['center right', '140px', '100px'],
        ['center start', '140px', '200px'],
        ['center end', '140px', '100px'],
        ['bottom left', '130px', '200px'],
        ['bottom middle', '130px', '150px'],
        ['bottom right', '130px', '100px'],
        ['bottom start', '130px', '200px'],
        ['bottom end', '130px', '100px']
      ]

      /**
       * The requested corner of the menu gets attached to the default
       * "bottom end" point of the button.
       */
      async function testMenuSelf(propVal) {
        const [, top, left] = selfPositionList.find(
          ([value]) => value === propVal
        )

        await mountPositionedBtnDropdown({ menuSelf: propVal })

        expect(getMenu().style.top).toBe(top)
        expect(getMenu().style.left).toBe(left)
      }

      test('value "top left" has effect', async () => {
        await testMenuSelf('top left')
      })

      test('value "top middle" has effect', async () => {
        await testMenuSelf('top middle')
      })

      test('value "top right" has effect', async () => {
        await testMenuSelf('top right')
      })

      test('value "top start" has effect', async () => {
        await testMenuSelf('top start')
      })

      test('value "top end" has effect', async () => {
        await testMenuSelf('top end')
      })

      test('value "center left" has effect', async () => {
        await testMenuSelf('center left')
      })

      test('value "center middle" has effect', async () => {
        await testMenuSelf('center middle')
      })

      test('value "center right" has effect', async () => {
        await testMenuSelf('center right')
      })

      test('value "center start" has effect', async () => {
        await testMenuSelf('center start')
      })

      test('value "center end" has effect', async () => {
        await testMenuSelf('center end')
      })

      test('value "bottom left" has effect', async () => {
        await testMenuSelf('bottom left')
      })

      test('value "bottom middle" has effect', async () => {
        await testMenuSelf('bottom middle')
      })

      test('value "bottom right" has effect', async () => {
        await testMenuSelf('bottom right')
      })

      test('value "bottom start" has effect', async () => {
        await testMenuSelf('bottom start')
      })

      test('value "bottom end" has effect', async () => {
        await testMenuSelf('bottom end')
      })
    })

    describe('[(prop)menu-offset]', () => {
      test('type Array has effect', async () => {
        await mountPositionedBtnDropdown({ menuOffset: [20, 30] })

        // the button is inflated by the offset, so the default
        // "bottom end" attaching point moves accordingly
        expect(getMenu().style.top).toBe('180px')
        expect(getMenu().style.minWidth).toBe('120px')
      })
    })

    describe('[(prop)toggle-aria-label]', () => {
      test('type String has effect', async () => {
        const propVal = 'Toggle the menu'
        const wrapper = mountBtnDropdown({ label: 'Actions' })

        const defaultLabel = getRoot(wrapper).attributes('aria-label')
        expect(defaultLabel).toBeTruthy()
        expect(defaultLabel).not.toBe(propVal)

        await wrapper.setProps({ toggleAriaLabel: propVal })

        expect(getRoot(wrapper).attributes('aria-label')).toBe(propVal)
      })
    })

    describe('[(prop)toggle-aria-haspopup]', () => {
      test('type String has effect', async () => {
        const propVal = 'menu'
        const wrapper = mountBtnDropdown({ label: 'Actions' })

        expect(getRoot(wrapper).attributes('aria-haspopup')).toBeUndefined()

        await wrapper.setProps({ toggleAriaHaspopup: propVal })

        expect(getRoot(wrapper).attributes('aria-haspopup')).toBe(propVal)
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', async () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountBtnDropdown({}, { default: () => slotContent })

        await showMenu(wrapper)

        expect(getMenu().textContent).toBe(slotContent)
      })
    })

    describe('[(slot)label]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountBtnDropdown({}, { label: () => slotContent })

        expect(getContent(wrapper).text()).toContain(slotContent)
      })
    })

    describe('[(slot)loading]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountBtnDropdown(
          { loading: true },
          { loading: () => slotContent }
        )

        expect(wrapper.text()).toContain(slotContent)
        // it replaces the default spinner
        expect(wrapper.find('.q-spinner').exists()).toBe(false)
      })
    })

    describe('[(slot)toggle]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountBtnDropdown({}, { toggle: () => slotContent })

        // rendered next to the arrow icon, which it does not replace
        expect(getContent(wrapper).text()).toContain(slotContent)
        expect(getArrowIcon(wrapper).exists()).toBe(true)
      })

      test('renders the content inside the toggle button when split', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountBtnDropdown(
          { split: true },
          { toggle: () => slotContent }
        )

        expect(getArrowBtn(wrapper).text()).toContain(slotContent)
        expect(getMainBtn(wrapper).text()).not.toContain(slotContent)
      })

      test('anchors slotted QTooltip to the toggle button alone when split', async () => {
        const wrapper = mountBtnDropdown(
          { split: true, label: 'Main' },
          { toggle: () => h(QTooltip, () => 'toggle help') }
        )

        await getMainBtn(wrapper).trigger('pointerenter')
        await settle()

        expect(document.querySelector('.q-tooltip')).toBeNull()

        await getArrowBtn(wrapper).trigger('pointerenter')
        await settle()

        expect(document.querySelector('.q-tooltip')).not.toBeNull()
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountBtnDropdown()

        await showMenu(wrapper)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:modelValue')
        expect(eventList['update:modelValue']).toHaveLength(1)

        const [value] = eventList['update:modelValue'][0]
        expect(value).toBe(true)

        await hideMenu(wrapper)

        expect(wrapper.emitted('update:modelValue')[1]).toStrictEqual([false])
      })
    })

    describe('[(event)show]', () => {
      test('is emitting', async () => {
        const wrapper = mountBtnDropdown()

        await showMenu(wrapper)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('show')
        expect(eventList.show).toHaveLength(1)

        const [evt] = eventList.show[0]
        expect(evt).toBeUndefined()
      })
    })

    describe('[(event)before-show]', () => {
      test('is emitting', async () => {
        const wrapper = mountBtnDropdown()

        wrapper.vm.show()
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('beforeShow')
        expect(eventList.beforeShow).toHaveLength(1)

        // it fires before the menu is done showing
        expect(eventList.show).toBeUndefined()
        expect(getRoot(wrapper).attributes('aria-expanded')).toBe('true')
      })
    })

    describe('[(event)hide]', () => {
      test('is emitting', async () => {
        const wrapper = mountBtnDropdown()

        await showMenu(wrapper)
        await hideMenu(wrapper)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('hide')
        expect(eventList.hide).toHaveLength(1)
      })
    })

    describe('[(event)before-hide]', () => {
      test('is emitting', async () => {
        const wrapper = mountBtnDropdown()

        await showMenu(wrapper)

        wrapper.vm.hide()
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('beforeHide')
        expect(eventList.beforeHide).toHaveLength(1)

        expect(eventList.hide).toBeUndefined()
        expect(getRoot(wrapper).attributes('aria-expanded')).toBe('false')
      })
    })

    describe('[(event)click]', () => {
      test('is emitting', async () => {
        const wrapper = mountBtnDropdown()

        await getRoot(wrapper).trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('click')
        expect(eventList.click).toHaveLength(1)

        const [evt] = eventList.click[0]
        expect(evt).toBeInstanceOf(Event)
      })

      test('closes the menu when the main half of a split is clicked', async () => {
        const wrapper = mountBtnDropdown({ split: true, label: 'Split' })

        await showMenu(wrapper)
        expect(getMenu()).not.toBeNull()

        await getMainBtn(wrapper).trigger('click')
        await settle()

        expect(getMenu()).toBeNull()
        expect(wrapper.emitted('click')).toHaveLength(1)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)show]', () => {
      test('should be callable', async () => {
        const wrapper = mountBtnDropdown()

        expect(wrapper.vm.show(new Event('click'))).toBeUndefined()
        await settle()

        expect(getMenu()).not.toBeNull()
      })
    })

    describe('[(method)hide]', () => {
      test('should be callable', async () => {
        const wrapper = mountBtnDropdown()

        await showMenu(wrapper)

        expect(wrapper.vm.hide(new Event('click'))).toBeUndefined()
        await settle()

        expect(getMenu()).toBeNull()
      })
    })

    describe('[(method)toggle]', () => {
      test('should be callable', async () => {
        const wrapper = mountBtnDropdown()

        expect(wrapper.vm.toggle(new Event('click'))).toBeUndefined()
        await settle()
        expect(getMenu()).not.toBeNull()

        wrapper.vm.toggle(new Event('click'))
        await settle()

        expect(getMenu()).toBeNull()
      })
    })
  })

  describe('[Accessibility]', () => {
    test('exposes the popup through the disclosure pattern', async () => {
      const wrapper = mountBtnDropdown()
      const toggle = getRoot(wrapper)

      // the popup holds arbitrary content without a default ARIA role,
      // so aria-haspopup (whose value names the popup's role; 'true'
      // means role="menu") must not be claimed by default
      expect(toggle.attributes('aria-haspopup')).toBeUndefined()
      expect(toggle.attributes('aria-expanded')).toBe('false')
      // the menu does not exist in the DOM while hidden, and
      // aria-controls must not reference a missing id
      expect(toggle.attributes('aria-controls')).toBeUndefined()

      await showMenu(wrapper)

      expect(toggle.attributes('aria-expanded')).toBe('true')
      expect(toggle.attributes('aria-controls')).toBe(getMenu().id)

      await hideMenu(wrapper)

      expect(toggle.attributes('aria-controls')).toBeUndefined()
    })

    test('carries the declared popup role on the toggle button in split mode', () => {
      const wrapper = mountBtnDropdown({
        label: 'Actions',
        split: true,
        toggleAriaHaspopup: 'menu'
      })

      // fall-through attrs land on the QBtnGroup in split mode, which is
      // why the popup role needs a prop that reaches the toggle button
      expect(getArrowBtn(wrapper).attributes('aria-haspopup')).toBe('menu')
      expect(getRoot(wrapper).attributes('aria-haspopup')).toBeUndefined()
      expect(getMainBtn(wrapper).attributes('aria-haspopup')).toBeUndefined()
    })
  })
})
