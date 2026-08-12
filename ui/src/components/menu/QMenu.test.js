import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import { getRouter } from 'testing/runtime/router.js'
import { validatePosition } from '../../utils/private.position-engine/position-engine.js'
import useFullscreen, {
  useFullscreenProps
} from '../../composables/private.use-fullscreen/use-fullscreen.js'
import QDialog from '../dialog/QDialog.js'
import QMenu from './QMenu.js'

const FullscreenChild = defineComponent({
  name: 'FullscreenChild',
  props: useFullscreenProps,

  setup() {
    useFullscreen()

    return () =>
      h('section', null, [h('input', { 'data-test': 'fullscreen-input' })])
  }
})

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
 * QMenu renders through a portal, so it is mounted inside of an anchor
 * and the resulting node is then looked up in the document.
 */
function mountMenu(props, slots, mountOptions) {
  props ||= {}
  slots ||= { default: () => 'Menu content' }

  activeWrapper = mount(
    defineComponent({
      props: { menuProps: Object },
      setup(componentProps, { slots: componentSlots }) {
        return () =>
          h('div', { class: 'my-anchor', tabindex: 0 }, [
            h(QMenu, componentProps.menuProps, componentSlots)
          ])
      }
    }),
    {
      props: { menuProps: props },
      slots,
      attachTo: document.body,
      ...mountOptions
    }
  )

  return activeWrapper
}

function getMenu() {
  return document.querySelector('.q-menu')
}

function getMenuComponent(wrapper) {
  return wrapper.findComponent(QMenu)
}

function getAnchor(wrapper) {
  return wrapper.get('.my-anchor')
}

function getTransitionProps(wrapper) {
  return wrapper.getComponent({ name: 'Transition' }).props()
}

async function showMenu(wrapper, evt) {
  getMenuComponent(wrapper).vm.show(evt)
  await flushPromises()
  await vi.runAllTimersAsync()
}

async function hideMenu(wrapper, evt) {
  getMenuComponent(wrapper).vm.hide(evt)
  await flushPromises()
  await vi.runAllTimersAsync()
}

/**
 * The anchor becomes a real fixed-positioned 100x50 box at (100, 100),
 * which means:
 *   top: 100, center: 125, bottom: 150
 *   left: 100, middle: 150, right: 200
 */
function setAnchorRect(wrapper) {
  Object.assign(getAnchor(wrapper).element.style, {
    position: 'fixed',
    top: '100px',
    left: '100px',
    width: '100px',
    height: '50px'
  })
}

/**
 * Mounts a menu with deterministic real geometry: the anchor is the box
 * described above and the menu content a real 50x20 box, so the position
 * engine measures everything through the actual layout engine. Everything
 * sits far from the viewport edges, so the boundary logic never corrects
 * the computed position.
 */
async function mountPositionedMenu(props) {
  const wrapper = mountMenu(props, {
    default: () => h('div', { style: { width: '50px', height: '20px' } })
  })
  setAnchorRect(wrapper)

  await showMenu(wrapper)

  return wrapper
}

async function pressEscapeKey() {
  window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27 }))
  window.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 27 }))
  await flushPromises()
  await vi.runAllTimersAsync()
}

describe('[QMenu API]', () => {
  describe('[Props]', () => {
    describe('[(prop)transition-show]', () => {
      test('type String has effect', async () => {
        const propVal = 'scale'
        // @vue/test-utils stubs out Transition by default; disable the
        // stub so that the real transition can be watched while it runs
        const wrapper = mountMenu({ transitionShow: propVal }, void 0, {
          global: { stubs: { transition: false } }
        })

        getMenuComponent(wrapper).vm.show()
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
        expect(getMenu()).not.toBeNull()
      })

      test('defaults to a fade transition', async () => {
        const wrapper = mountMenu()

        await showMenu(wrapper)

        expect(getTransitionProps(wrapper).enterActiveClass).toBe(
          'q-transition--fade-enter-active'
        )
      })
    })

    describe('[(prop)transition-hide]', () => {
      test('type String has effect', async () => {
        const propVal = 'scale'
        // @vue/test-utils stubs out Transition by default; disable the
        // stub so that the real transition can be watched while it runs
        const wrapper = mountMenu({ transitionHide: propVal }, void 0, {
          global: { stubs: { transition: false } }
        })

        await showMenu(wrapper)

        getMenuComponent(wrapper).vm.hide()
        await flushPromises()

        // while leaving, the menu carries the requested leave classes
        expect(getMenu().classList).toContain(
          `q-transition--${propVal}-leave-active`
        )

        await vi.runAllTimersAsync()

        // and it is gone once the transition is over
        expect(getMenu()).toBeNull()
      })

      test('defaults to a fade transition', async () => {
        const wrapper = mountMenu()

        await showMenu(wrapper)

        expect(getTransitionProps(wrapper).leaveActiveClass).toBe(
          'q-transition--fade-leave-active'
        )
      })
    })

    describe('[(prop)transition-duration]', () => {
      test('type String has effect', async () => {
        const wrapper = mountMenu({ transitionDuration: '450' })

        await showMenu(wrapper)

        expect(
          getMenu().style.getPropertyValue('--q-transition-duration')
        ).toBe('450ms')
      })

      test('type Number has effect', async () => {
        const wrapper = mountMenu({ transitionDuration: 450 })
        const menu = getMenuComponent(wrapper)

        menu.vm.show()
        await flushPromises()

        expect(
          getMenu().style.getPropertyValue('--q-transition-duration')
        ).toBe('450ms')

        // the show event is delayed by the transition duration
        expect(menu.emitted('show')).toBeUndefined()

        await vi.advanceTimersByTimeAsync(450)

        expect(menu.emitted('show')).toHaveLength(1)
      })
    })

    describe('[(prop)target]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountMenu({ target: false })

        await getAnchor(wrapper).trigger('click')
        await vi.runAllTimersAsync()

        // no anchor means there is nothing to attach the menu to
        expect(getMenu()).toBeNull()

        await showMenu(wrapper)

        expect(getMenu()).toBeNull()
      })

      test('type String has effect', async () => {
        const target = document.createElement('div')
        target.id = 'my-target'
        document.body.append(target)

        try {
          const wrapper = mountMenu({ target: '#my-target' })

          target.dispatchEvent(new MouseEvent('click'))
          await flushPromises()
          await vi.runAllTimersAsync()

          expect(getMenu()).not.toBeNull()

          // the anchor events are wired up to the target, not to the parent
          await getAnchor(wrapper).trigger('click')
          await vi.runAllTimersAsync()

          expect(getMenu()).not.toBeNull()
        } finally {
          target.remove()
        }
      })

      test('type Element has effect', async () => {
        const target = document.createElement('div')
        document.body.append(target)

        try {
          mountMenu({ target })

          target.dispatchEvent(new MouseEvent('click'))
          await flushPromises()
          await vi.runAllTimersAsync()

          expect(getMenu()).not.toBeNull()
        } finally {
          target.remove()
        }
      })
    })

    describe('[(prop)no-parent-event]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountMenu({ noParentEvent: true })

        await getAnchor(wrapper).trigger('click')
        await vi.runAllTimersAsync()

        expect(getMenu()).toBeNull()

        // it can still be shown programmatically
        await showMenu(wrapper)

        expect(getMenu()).not.toBeNull()
      })
    })

    describe('[(prop)context-menu]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountMenu({ contextMenu: true })

        // a plain click no longer opens it
        await getAnchor(wrapper).trigger('click')
        await vi.runAllTimersAsync()

        expect(getMenu()).toBeNull()

        await getAnchor(wrapper).trigger('contextmenu')
        await flushPromises()
        await vi.runAllTimersAsync()

        expect(getMenu()).not.toBeNull()
      })
    })

    describe('[(prop)model-value]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountMenu({
          modelValue: false,
          'onUpdate:modelValue': () => {}
        })

        await flushPromises()
        await vi.runAllTimersAsync()

        expect(getMenu()).toBeNull()

        await wrapper.setProps({
          menuProps: { modelValue: true, 'onUpdate:modelValue': () => {} }
        })
        await vi.runAllTimersAsync()

        expect(getMenu()).not.toBeNull()
      })

      test('type null has effect', async () => {
        // a null model means that the menu manages its own state
        const wrapper = mountMenu({
          modelValue: null,
          'onUpdate:modelValue': () => {}
        })

        await getAnchor(wrapper).trigger('click')
        await vi.runAllTimersAsync()

        expect(getMenu()).not.toBeNull()
        expect(getMenuComponent(wrapper).emitted('update:modelValue')).toEqual([
          [true]
        ])
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountMenu({ dark: true })

        await showMenu(wrapper)

        expect(getMenu().classList).toContain('q-menu--dark')
        expect(getMenu().classList).toContain('q-dark')
      })

      test('type null has effect', async () => {
        const wrapper = mountMenu({ dark: null })
        const menu = getMenuComponent(wrapper)

        menu.vm.$q.dark.set(false)
        await showMenu(wrapper)

        expect(getMenu().classList).not.toContain('q-menu--dark')

        menu.vm.$q.dark.set(true)
        await flushPromises()

        expect(getMenu().classList).toContain('q-menu--dark')

        menu.vm.$q.dark.set(false)
      })
    })

    describe('[(prop)fit]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = await mountPositionedMenu({ fit: true })

        // the menu is never narrower than its anchor
        expect(getMenu().style.minWidth).toBe('100px')
        expect(getMenu().style.minHeight).toBe('')

        await wrapper.setProps({ menuProps: {} })
        getMenuComponent(wrapper).vm.updatePosition()

        expect(getMenu().style.minWidth).toBe('')
      })
    })

    describe('[(prop)cover]', () => {
      test('type Boolean has effect', async () => {
        await mountPositionedMenu({ cover: true })

        const style = getMenu().style

        // the menu covers the anchor, so it takes over both of its sizes
        // and gets centered on it
        expect(style.minWidth).toBe('100px')
        expect(style.minHeight).toBe('50px')
        expect(style.top).toBe('100px')
        expect(style.left).toBe('100px')
      })
    })

    describe('[(prop)anchor]', () => {
      const anchorPositionList = [
        ['top left', '100px', '100px'],
        ['top middle', '100px', '150px'],
        ['top right', '100px', '200px'],
        ['top start', '100px', '100px'],
        ['top end', '100px', '200px'],
        ['center left', '125px', '100px'],
        ['center middle', '125px', '150px'],
        ['center right', '125px', '200px'],
        ['center start', '125px', '100px'],
        ['center end', '125px', '200px'],
        ['bottom left', '150px', '100px'],
        ['bottom middle', '150px', '150px'],
        ['bottom right', '150px', '200px'],
        ['bottom start', '150px', '100px'],
        ['bottom end', '150px', '200px']
      ]

      /**
       * The menu (50x20) attaches its own "top start" corner
       * to the requested anchor point.
       */
      async function testAnchor(propVal) {
        const [, top, left] = anchorPositionList.find(
          ([value]) => value === propVal
        )

        await mountPositionedMenu({ anchor: propVal })

        expect(getMenu().style.top).toBe(top)
        expect(getMenu().style.left).toBe(left)
      }

      test('value "top left" has effect', async () => {
        await testAnchor('top left')
      })

      test('value "top middle" has effect', async () => {
        await testAnchor('top middle')
      })

      test('value "top right" has effect', async () => {
        await testAnchor('top right')
      })

      test('value "top start" has effect', async () => {
        await testAnchor('top start')
      })

      test('value "top end" has effect', async () => {
        await testAnchor('top end')
      })

      test('value "center left" has effect', async () => {
        await testAnchor('center left')
      })

      test('value "center middle" has effect', async () => {
        await testAnchor('center middle')
      })

      test('value "center right" has effect', async () => {
        await testAnchor('center right')
      })

      test('value "center start" has effect', async () => {
        await testAnchor('center start')
      })

      test('value "center end" has effect', async () => {
        await testAnchor('center end')
      })

      test('value "bottom left" has effect', async () => {
        await testAnchor('bottom left')
      })

      test('value "bottom middle" has effect', async () => {
        await testAnchor('bottom middle')
      })

      test('value "bottom right" has effect', async () => {
        await testAnchor('bottom right')
      })

      test('value "bottom start" has effect', async () => {
        await testAnchor('bottom start')
      })

      test('value "bottom end" has effect', async () => {
        await testAnchor('bottom end')
      })

      test('only accepts a valid position', () => {
        const { validator } = QMenu.props.anchor

        expect(validator).toBe(validatePosition)
        expect(anchorPositionList.every(([value]) => validator(value))).toBe(
          true
        )
        expect(validator('nowhere')).toBe(false)
      })
    })

    describe('[(prop)self]', () => {
      const selfPositionList = [
        ['top left', '150px', '100px'],
        ['top middle', '150px', '75px'],
        ['top right', '150px', '50px'],
        ['top start', '150px', '100px'],
        ['top end', '150px', '50px'],
        ['center left', '140px', '100px'],
        ['center middle', '140px', '75px'],
        ['center right', '140px', '50px'],
        ['center start', '140px', '100px'],
        ['center end', '140px', '50px'],
        ['bottom left', '130px', '100px'],
        ['bottom middle', '130px', '75px'],
        ['bottom right', '130px', '50px'],
        ['bottom start', '130px', '100px'],
        ['bottom end', '130px', '50px']
      ]

      /**
       * The requested corner of the menu (50x20) gets attached
       * to the default "bottom start" point of the anchor.
       */
      async function testSelf(propVal) {
        const [, top, left] = selfPositionList.find(
          ([value]) => value === propVal
        )

        await mountPositionedMenu({ self: propVal })

        expect(getMenu().style.top).toBe(top)
        expect(getMenu().style.left).toBe(left)
      }

      test('value "top left" has effect', async () => {
        await testSelf('top left')
      })

      test('value "top middle" has effect', async () => {
        await testSelf('top middle')
      })

      test('value "top right" has effect', async () => {
        await testSelf('top right')
      })

      test('value "top start" has effect', async () => {
        await testSelf('top start')
      })

      test('value "top end" has effect', async () => {
        await testSelf('top end')
      })

      test('value "center left" has effect', async () => {
        await testSelf('center left')
      })

      test('value "center middle" has effect', async () => {
        await testSelf('center middle')
      })

      test('value "center right" has effect', async () => {
        await testSelf('center right')
      })

      test('value "center start" has effect', async () => {
        await testSelf('center start')
      })

      test('value "center end" has effect', async () => {
        await testSelf('center end')
      })

      test('value "bottom left" has effect', async () => {
        await testSelf('bottom left')
      })

      test('value "bottom middle" has effect', async () => {
        await testSelf('bottom middle')
      })

      test('value "bottom right" has effect', async () => {
        await testSelf('bottom right')
      })

      test('value "bottom start" has effect', async () => {
        await testSelf('bottom start')
      })

      test('value "bottom end" has effect', async () => {
        await testSelf('bottom end')
      })

      test('only accepts a valid position', () => {
        const { validator } = QMenu.props.self

        expect(validator).toBe(validatePosition)
        expect(selfPositionList.every(([value]) => validator(value))).toBe(true)
        expect(validator('nowhere')).toBe(false)
      })
    })

    describe('[(prop)offset]', () => {
      test('type Array has effect', async () => {
        await mountPositionedMenu({ offset: [20, 30] })

        // the anchor is inflated by the offset, so the default
        // "bottom start" attaching point moves accordingly
        expect(getMenu().style.top).toBe('180px')
        expect(getMenu().style.left).toBe('80px')
      })

      test('only accepts two numbers', () => {
        const { validator } = QMenu.props.offset

        expect(validator([10, 20])).toBe(true)
        expect(validator([10])).toBe(false)
        expect(validator(['a', 'b'])).toBe(false)
        expect(validator(void 0)).toBe(true)
      })
    })

    describe('[(prop)scroll-target]', () => {
      test('type Element has effect', async () => {
        const target = document.createElement('div')
        target.classList.add('scroll')
        document.body.append(target)

        const addSpy = vi.spyOn(target, 'addEventListener')

        try {
          const wrapper = mountMenu({ scrollTarget: target })
          await showMenu(wrapper)

          expect(addSpy).toHaveBeenCalledWith(
            'scroll',
            expect.any(Function),
            expect.anything()
          )
        } finally {
          target.remove()
        }
      })

      test('type String has effect', async () => {
        const target = document.createElement('div')
        target.id = 'my-scroll-target'
        target.classList.add('scroll')
        document.body.append(target)

        const addSpy = vi.spyOn(target, 'addEventListener')

        try {
          const wrapper = mountMenu({ scrollTarget: '#my-scroll-target' })
          await showMenu(wrapper)

          expect(addSpy).toHaveBeenCalledWith(
            'scroll',
            expect.any(Function),
            expect.anything()
          )
        } finally {
          target.remove()
        }
      })
    })

    describe('[(prop)touch-position]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountMenu({ touchPosition: true })
        setAnchorRect(wrapper)

        await showMenu(
          wrapper,
          new MouseEvent('click', { clientX: 200, clientY: 300 })
        )

        // the menu latches onto the pointer instead of onto the anchor
        expect(getMenu().style.top).toBe('301px')
        expect(getMenu().style.left).toBe('200px')
      })
    })

    describe('[(prop)persistent]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountMenu({ persistent: true })

        await showMenu(wrapper)

        await pressEscapeKey()
        expect(getMenu()).not.toBeNull()

        document.body.dispatchEvent(new MouseEvent('mousedown'))
        document.body.dispatchEvent(new MouseEvent('click'))
        await flushPromises()
        await vi.runAllTimersAsync()

        expect(getMenu()).not.toBeNull()
      })
    })

    describe('[(prop)no-esc-dismiss]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountMenu({ noEscDismiss: true })

        await showMenu(wrapper)
        await pressEscapeKey()

        expect(getMenu()).not.toBeNull()
        expect(getMenuComponent(wrapper).emitted('escapeKey')).toBeUndefined()
      })
    })

    describe('[(prop)no-route-dismiss]', () => {
      test('type Boolean has effect', async () => {
        const router = await getRouter('/other')
        const wrapper = mountMenu({ noRouteDismiss: true }, void 0, {
          global: { plugins: [router] }
        })

        await showMenu(wrapper)

        router.push('/other')
        await flushPromises()
        await vi.runAllTimersAsync()

        expect(getMenu()).not.toBeNull()
      })
    })

    describe('[(prop)auto-close]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountMenu(
          { autoClose: true },
          { default: () => h('div', { class: 'my-item' }, 'Item') }
        )

        await showMenu(wrapper)

        document
          .querySelector('.q-menu .my-item')
          .dispatchEvent(new MouseEvent('click', { bubbles: true }))
        await flushPromises()
        await vi.runAllTimersAsync()

        expect(getMenu()).toBeNull()
        expect(getMenuComponent(wrapper).emitted('click')).toHaveLength(1)
      })
    })

    describe('[(prop)separate-close-popup]', () => {
      test('type Boolean has effect', async () => {
        // a menu inside of another menu: clicking the inner one closes
        // the whole chain, unless the inner one is a point of separation
        async function mountNestedMenus(innerProps) {
          activeWrapper = mount(
            defineComponent({
              props: { innerProps: Object },
              setup(componentProps) {
                return () =>
                  h('div', { class: 'my-anchor' }, [
                    h(QMenu, { class: 'outer-menu', modelValue: true }, () => [
                      h('div', { class: 'inner-anchor' }, [
                        h(
                          QMenu,
                          {
                            class: 'inner-menu',
                            modelValue: true,
                            autoClose: true,
                            ...componentProps.innerProps
                          },
                          () => h('div', { class: 'my-item' }, 'Item')
                        )
                      ])
                    ])
                  ])
              }
            }),
            {
              props: { innerProps },
              attachTo: document.body
            }
          )

          await flushPromises()
          await vi.runAllTimersAsync()

          return activeWrapper
        }

        async function clickInnerItem() {
          document
            .querySelector('.inner-menu .my-item')
            .dispatchEvent(new MouseEvent('click', { bubbles: true }))
          await flushPromises()
          await vi.runAllTimersAsync()
        }

        await mountNestedMenus()
        await clickInnerItem()

        expect(document.querySelector('.inner-menu')).toBeNull()
        expect(document.querySelector('.outer-menu')).toBeNull()

        activeWrapper.unmount()
        await vi.runAllTimersAsync()

        await mountNestedMenus({ separateClosePopup: true })
        await clickInnerItem()

        expect(document.querySelector('.inner-menu')).toBeNull()
        expect(document.querySelector('.outer-menu')).not.toBeNull()
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountMenu({ square: true })

        await showMenu(wrapper)

        expect(getMenu().classList).toContain('q-menu--square')

        await wrapper.setProps({ menuProps: {} })

        expect(getMenu().classList).not.toContain('q-menu--square')
      })
    })

    describe('[(prop)no-refocus]', () => {
      test('type Boolean has effect', async () => {
        const button = document.createElement('button')
        document.body.append(button)

        try {
          const wrapper = mountMenu({ noRefocus: true })

          button.focus()
          expect(document.activeElement).toBe(button)

          await showMenu(wrapper)
          expect(document.activeElement).toBe(getMenu())

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
          const wrapper = mountMenu()

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
          const wrapper = mountMenu({ noFocus: true })

          button.focus()
          await showMenu(wrapper)

          // the menu does not steal the focus
          expect(document.activeElement).toBe(button)
        } finally {
          button.remove()
        }
      })
    })

    describe('[(prop)max-height]', () => {
      test('type String has effect', async () => {
        const propVal = '16px'
        await mountPositionedMenu({ maxHeight: propVal })

        expect(getMenu().style.maxHeight).toBe(propVal)
      })

      test('type null has effect', async () => {
        await mountPositionedMenu({ maxHeight: null })

        expect(getMenu().style.maxHeight).toBe('')
      })
    })

    describe('[(prop)max-width]', () => {
      test('type String has effect', async () => {
        const propVal = '16px'
        await mountPositionedMenu({ maxWidth: propVal })

        expect(getMenu().style.maxWidth).toBe(propVal)
      })

      test('type null has effect', async () => {
        await mountPositionedMenu({ maxWidth: null })

        expect(getMenu().style.maxWidth).toBe('')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', async () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountMenu({}, { default: () => slotContent })

        await showMenu(wrapper)

        expect(getMenu().textContent).toBe(slotContent)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountMenu({
          modelValue: null,
          'onUpdate:modelValue': () => {}
        })

        await showMenu(wrapper)

        const eventList = getMenuComponent(wrapper).emitted()
        expect(eventList).toHaveProperty('update:modelValue')
        expect(eventList['update:modelValue']).toHaveLength(1)

        const [value] = eventList['update:modelValue'][0]
        expect(value).toBe(true)
      })
    })

    describe('[(event)show]', () => {
      test('is emitting', async () => {
        const wrapper = mountMenu()
        const evt = new MouseEvent('click')

        await showMenu(wrapper, evt)

        const eventList = getMenuComponent(wrapper).emitted()
        expect(eventList).toHaveProperty('show')
        expect(eventList.show).toHaveLength(1)

        expect(eventList.show[0][0]).toBe(evt)
      })
    })

    describe('[(event)before-show]', () => {
      test('is emitting', async () => {
        const wrapper = mountMenu()
        const evt = new MouseEvent('click')

        getMenuComponent(wrapper).vm.show(evt)
        await flushPromises()

        const eventList = getMenuComponent(wrapper).emitted()
        expect(eventList).toHaveProperty('beforeShow')
        expect(eventList.beforeShow).toHaveLength(1)

        // it fires before the menu is done showing
        expect(eventList.show).toBeUndefined()
        expect(eventList.beforeShow[0][0]).toBe(evt)
      })
    })

    describe('[(event)hide]', () => {
      test('is emitting', async () => {
        const wrapper = mountMenu()
        const evt = new MouseEvent('click')

        await showMenu(wrapper)
        await hideMenu(wrapper, evt)

        const eventList = getMenuComponent(wrapper).emitted()
        expect(eventList).toHaveProperty('hide')
        expect(eventList.hide).toHaveLength(1)

        expect(eventList.hide[0][0]).toBe(evt)
      })
    })

    describe('[(event)before-hide]', () => {
      test('is emitting', async () => {
        const wrapper = mountMenu()
        const evt = new MouseEvent('click')

        await showMenu(wrapper)

        getMenuComponent(wrapper).vm.hide(evt)
        await flushPromises()

        const eventList = getMenuComponent(wrapper).emitted()
        expect(eventList).toHaveProperty('beforeHide')
        expect(eventList.beforeHide).toHaveLength(1)

        // it fires before the menu is done hiding
        expect(eventList.hide).toBeUndefined()
        expect(eventList.beforeHide[0][0]).toBe(evt)
      })
    })

    describe('[(event)escape-key]', () => {
      test('is emitting', async () => {
        const wrapper = mountMenu()

        await showMenu(wrapper)
        await pressEscapeKey()

        const eventList = getMenuComponent(wrapper).emitted()
        expect(eventList).toHaveProperty('escapeKey')
        expect(eventList.escapeKey).toHaveLength(1)

        expect(eventList.escapeKey[0]).toHaveLength(0)

        // the menu closes along with it
        expect(getMenu()).toBeNull()
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)show]', () => {
      test('should be callable', async () => {
        const wrapper = mountMenu()

        expect(
          getMenuComponent(wrapper).vm.show(new Event('click'))
        ).toBeUndefined()
        await flushPromises()
        await vi.runAllTimersAsync()

        expect(getMenu()).not.toBeNull()
      })
    })

    describe('[(method)hide]', () => {
      test('should be callable', async () => {
        const wrapper = mountMenu()

        await showMenu(wrapper)

        expect(
          getMenuComponent(wrapper).vm.hide(new Event('click'))
        ).toBeUndefined()
        await flushPromises()
        await vi.runAllTimersAsync()

        expect(getMenu()).toBeNull()
      })
    })

    describe('[(method)toggle]', () => {
      test('should be callable', async () => {
        const wrapper = mountMenu()
        const menu = getMenuComponent(wrapper)

        expect(menu.vm.toggle(new Event('click'))).toBeUndefined()
        await flushPromises()
        await vi.runAllTimersAsync()
        expect(getMenu()).not.toBeNull()

        menu.vm.toggle(new Event('click'))
        await flushPromises()
        await vi.runAllTimersAsync()
        expect(getMenu()).toBeNull()
      })
    })

    describe('[(method)updatePosition]', () => {
      test('should be callable', async () => {
        const wrapper = await mountPositionedMenu()

        // the anchor moved without any of the watched dependencies changing
        Object.assign(getAnchor(wrapper).element.style, {
          top: '200px',
          left: '300px'
        })

        expect(getMenuComponent(wrapper).vm.updatePosition()).toBeUndefined()

        const style = getMenu().style
        expect(style.visibility).toBe('visible')
        expect(style.top).toBe('250px')
        expect(style.left).toBe('300px')
      })
    })

    describe('[(method)focus]', () => {
      test('should be callable', async () => {
        const wrapper = mountMenu(
          { noFocus: true },
          { default: () => h('div', { class: 'my-item', tabindex: 0 }, 'Item') }
        )

        await showMenu(wrapper)
        expect(document.activeElement).not.toBe(getMenu())

        expect(getMenuComponent(wrapper).vm.focus()).toBeUndefined()

        expect(document.activeElement).toBe(getMenu())
      })

      test('prefers the autofocus target', async () => {
        const wrapper = mountMenu(
          { noFocus: true },
          {
            default: () =>
              h('div', { class: 'my-item', tabindex: 0, autofocus: '' }, 'Item')
          }
        )

        await showMenu(wrapper)
        getMenuComponent(wrapper).vm.focus()

        expect(document.activeElement).toBe(
          document.querySelector('.q-menu .my-item')
        )
      })
    })
  })

  describe('[Computed props]', () => {
    describe('[(computedProp)contentEl]', () => {
      test('should be exposed', async () => {
        const wrapper = mountMenu()
        const menu = getMenuComponent(wrapper)

        expect(menu.vm.contentEl).toBeNull()

        await showMenu(wrapper)

        expect(menu.vm.contentEl).toBeInstanceOf(Element)
        expect(menu.vm.contentEl).toBe(getMenu())
      })
    })
  })

  describe('[Generic]', () => {
    test('stays open when clicking inside a fullscreen-detached child (issue #18512)', async () => {
      const wrapper = mountMenu(
        {},
        { default: () => h(FullscreenChild, { fullscreen: true }) }
      )

      await showMenu(wrapper)

      const el = document.body.querySelector('[data-test="fullscreen-input"]')

      // useFullscreen() has moved the child out of the menu
      expect(el.closest('.q-menu')).toBeNull()

      el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      await flushPromises()
      await vi.runAllTimersAsync()

      // ...yet it still belongs to the menu, so the click is not "outside"
      expect(getMenu()).not.toBeNull()

      document.body.dispatchEvent(new MouseEvent('mousedown'))
      await flushPromises()
      await vi.runAllTimersAsync()

      // ...while a click genuinely outside still closes it
      expect(getMenu()).toBeNull()
    })
  })

  describe('[Accessibility]', () => {
    test('claims no ARIA role by default, forwards a declared one', async () => {
      // the popup hosts arbitrary content, so it must not claim
      // role="menu" (WAI-ARIA allows only menuitem* children in it)
      const wrapper = mountMenu()
      await showMenu(wrapper)

      expect(getMenu().hasAttribute('role')).toBe(false)

      wrapper.unmount()

      const roleWrapper = mountMenu({ role: 'menu' })
      await showMenu(roleWrapper)

      expect(getMenu().getAttribute('role')).toBe('menu')
    })

    async function mountMenuInDialog(dialogProps) {
      activeWrapper = mount(
        defineComponent({
          setup() {
            return () =>
              h(QDialog, { modelValue: true, ...dialogProps }, () =>
                h('div', { class: 'my-anchor', tabindex: 0 }, [
                  h(QMenu, {}, () => 'Menu content')
                ])
              )
          }
        }),
        { attachTo: document.body }
      )

      await flushPromises()
      await vi.runAllTimersAsync()

      await showMenu(activeWrapper)

      return activeWrapper
    }

    test('renders inside the aria-modal dialog holding its anchor', async () => {
      await mountMenuInDialog()

      const dialogEl = document.querySelector('[role="dialog"]')

      // an aria-modal dialog makes assistive tech ignore everything
      // outside of the dialog's element, so the menu must be inside
      expect(dialogEl.getAttribute('aria-modal')).toBe('true')
      expect(dialogEl.contains(getMenu())).toBe(true)

      // the dialog's root element is no-pointer-events
      expect(getComputedStyle(getMenu()).pointerEvents).not.toBe('none')
    })

    test('renders outside of a seamless dialog', async () => {
      await mountMenuInDialog({ seamless: true })

      const dialogEl = document.querySelector('[role="dialog"]')

      expect(dialogEl.getAttribute('aria-modal')).toBe('false')
      expect(getMenu()).not.toBeNull()
      expect(dialogEl.contains(getMenu())).toBe(false)
    })

    // the popup renders through a portal, so letting TAB run its default
    // course would drop focus out of the page instead of continuing the
    // page's sequence -- WAI-ARIA expects the popup to close instead
    describe('TAB moving out of the popup', () => {
      function mountMenuWithButtons(props) {
        return mountMenu(props, {
          default: () => [
            h('button', { class: 'first-action' }, 'first'),
            h('button', { class: 'last-action' }, 'last')
          ]
        })
      }

      async function pressTabKey(el, shiftKey) {
        el.dispatchEvent(
          new KeyboardEvent('keydown', {
            keyCode: 9,
            shiftKey: shiftKey === true,
            bubbles: true
          })
        )
        await flushPromises()
        await vi.runAllTimersAsync()
      }

      test('closes it and hands focus back to the anchor', async () => {
        const wrapper = mountMenuWithButtons()
        const anchorEl = getAnchor(wrapper).element

        anchorEl.focus()
        await showMenu(wrapper)

        const lastEl = document.querySelector('.last-action')
        lastEl.focus()
        await pressTabKey(lastEl)

        expect(getMenu()).toBeNull()
        expect(document.activeElement).toBe(anchorEl)
      })

      test('closes it on Shift+TAB from the first tabbable', async () => {
        const wrapper = mountMenuWithButtons()
        const anchorEl = getAnchor(wrapper).element

        anchorEl.focus()
        await showMenu(wrapper)

        const firstEl = document.querySelector('.first-action')
        firstEl.focus()
        await pressTabKey(firstEl, true)

        expect(getMenu()).toBeNull()
        expect(document.activeElement).toBe(anchorEl)
      })

      test('keeps it open while focus stays inside', async () => {
        const wrapper = mountMenuWithButtons()

        getAnchor(wrapper).element.focus()
        await showMenu(wrapper)

        const firstEl = document.querySelector('.first-action')
        firstEl.focus()
        await pressTabKey(firstEl)

        expect(getMenu()).not.toBeNull()
      })

      test('closes a popup holding no tabbable element', async () => {
        const wrapper = mountMenu()
        const anchorEl = getAnchor(wrapper).element

        anchorEl.focus()
        await showMenu(wrapper)

        // the popup itself receives focus when it holds nothing focusable
        expect(document.activeElement).toBe(getMenu())
        await pressTabKey(getMenu())

        expect(getMenu()).toBeNull()
        expect(document.activeElement).toBe(anchorEl)
      })

      test('leaves a persistent popup alone', async () => {
        const wrapper = mountMenu({ persistent: true })

        getAnchor(wrapper).element.focus()
        await showMenu(wrapper)
        await pressTabKey(getMenu())

        expect(getMenu()).not.toBeNull()
      })
    })
  })
})
