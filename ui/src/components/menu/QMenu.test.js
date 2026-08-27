import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { KeepAlive, defineComponent, h } from 'vue'
import { useRoute } from 'vue-router'

import { getRouter } from 'testing/runtime/router.js'
import { client } from '../../plugins/platform/Platform.js'
import { validatePosition } from '../../utils/private.position-engine/position-engine.js'
import useFullscreen, {
  useFullscreenProps
} from '../../composables/private.use-fullscreen/use-fullscreen.js'
import QDialog from '../dialog/QDialog.js'
import QMenu from './QMenu.js'

// the test browser is a Chromium, so QMenu takes the CSS anchor
// positioning path by default; flipping this flag before mounting
// forces the JS positioning fallback of non-supporting browsers instead
const engineOverride = vi.hoisted(() => ({ forceJsFallback: false }))

vi.mock(
  '../../utils/private.position-engine/position-engine.js',
  async importOriginal => {
    const mod = await importOriginal()
    return {
      ...mod,
      supportsCssAnchor: () =>
        engineOverride.forceJsFallback ? false : mod.supportsCssAnchor()
    }
  }
)

const FullscreenChild = defineComponent({
  name: 'FullscreenChild',
  props: useFullscreenProps,

  setup() {
    useFullscreen()

    return () =>
      h('section', null, [h('input', { 'data-test': 'fullscreen-input' })])
  }
})

const FullscreenAnchorHost = defineComponent({
  name: 'FullscreenAnchorHost',
  props: useFullscreenProps,

  setup(_, { slots }) {
    useFullscreen()

    return () => h('section', null, slots.default())
  }
})

// the detached-fullscreen relocation defers through nextTick + an animation
// frame; the frame is faked along with the timers in this suite
async function flushAnimationFrames() {
  await flushPromises()
  await vi.runAllTimersAsync()
  await flushPromises()
}

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
  engineOverride.forceJsFallback = false
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

/**
 * Where the menu really is: the position is expressed through anchor()
 * insets that only the layout engine resolves, so tests assert the
 * resulting geometry instead of style strings.
 */
function getMenuRect() {
  return getMenu().getBoundingClientRect()
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
        expect(getMenuRect().width).toBe(100)
        expect(getMenuRect().height).toBe(20)

        await wrapper.setProps({ menuProps: {} })

        expect(getMenuRect().width).toBe(50)
      })
    })

    describe('[(prop)cover]', () => {
      test('type Boolean has effect', async () => {
        await mountPositionedMenu({ cover: true })

        // the menu covers the anchor, so it takes over both of its sizes
        // and gets centered on it
        const rect = getMenuRect()
        expect(rect.top).toBe(100)
        expect(rect.left).toBe(100)
        expect(rect.width).toBe(100)
        expect(rect.height).toBe(50)
      })
    })

    describe('[(prop)anchor]', () => {
      const anchorPositionList = [
        ['top left', 100, 100],
        ['top middle', 100, 150],
        ['top right', 100, 200],
        ['top start', 100, 100],
        ['top end', 100, 200],
        ['center left', 125, 100],
        ['center middle', 125, 150],
        ['center right', 125, 200],
        ['center start', 125, 100],
        ['center end', 125, 200],
        ['bottom left', 150, 100],
        ['bottom middle', 150, 150],
        ['bottom right', 150, 200],
        ['bottom start', 150, 100],
        ['bottom end', 150, 200]
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

        const rect = getMenuRect()
        expect(rect.top).toBe(top)
        expect(rect.left).toBe(left)
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
        ['top left', 150, 100],
        ['top middle', 150, 75],
        ['top right', 150, 50],
        ['top start', 150, 100],
        ['top end', 150, 50],
        ['center left', 140, 100],
        ['center middle', 140, 75],
        ['center right', 140, 50],
        ['center start', 140, 100],
        ['center end', 140, 50],
        ['bottom left', 130, 100],
        ['bottom middle', 130, 75],
        ['bottom right', 130, 50],
        ['bottom start', 130, 100],
        ['bottom end', 130, 50]
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

        const rect = getMenuRect()
        expect(rect.top).toBe(top)
        expect(rect.left).toBe(left)
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
        const rect = getMenuRect()
        expect(rect.top).toBe(180)
        expect(rect.left).toBe(80)
      })

      test('only accepts two numbers', () => {
        const { validator } = QMenu.props.offset

        expect(validator([10, 20])).toBe(true)
        expect(validator([10])).toBe(false)
        expect(validator(['a', 'b'])).toBe(false)
        expect(validator(void 0)).toBe(true)
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
        const rect = getMenuRect()
        expect(rect.top).toBe(300)
        expect(rect.left).toBe(200)
      })

      test('is ignored by hover-triggered shows', async () => {
        const wrapper = mountMenu({ touchPosition: true, hover: true })
        setAnchorRect(wrapper)

        // a pointerenter only carries the point where the pointer crossed
        // the target's edge, so the menu keeps anchoring onto the target;
        // the PointerEvent constructor is needed for the read-only coords
        getAnchor(wrapper).element.dispatchEvent(
          new PointerEvent('pointerenter', {
            pointerType: 'mouse',
            clientX: 130,
            clientY: 110
          })
        )
        await flushPromises()
        await vi.runAllTimersAsync()

        const rect = getMenuRect()
        expect(rect.top).toBe(150)
        expect(rect.left).toBe(100)
      })
    })

    describe('[(prop)hover]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountMenu({ hover: true })

        await getAnchor(wrapper).trigger('pointerenter', {
          pointerType: 'mouse'
        })
        await flushPromises()

        expect(getMenu()).not.toBeNull()

        await getAnchor(wrapper).trigger('pointerleave', {
          pointerType: 'mouse'
        })
        await vi.runAllTimersAsync()

        expect(getMenu()).toBeNull()
      })

      test('a touch pointer does not trigger it', async () => {
        const wrapper = mountMenu({ hover: true })

        await getAnchor(wrapper).trigger('pointerenter', {
          pointerType: 'touch'
        })
        await vi.runAllTimersAsync()

        expect(getMenu()).toBeNull()
      })

      test('moving the pointer into the menu keeps it open', async () => {
        const wrapper = mountMenu({ hover: true })

        await getAnchor(wrapper).trigger('pointerenter', {
          pointerType: 'mouse'
        })
        await flushPromises()

        // the relatedTarget of a real crossing is the element entered
        getAnchor(wrapper).element.dispatchEvent(
          new PointerEvent('pointerleave', {
            pointerType: 'mouse',
            relatedTarget: getMenu()
          })
        )
        await vi.runAllTimersAsync()

        expect(getMenu()).not.toBeNull()

        getMenu().dispatchEvent(
          new PointerEvent('pointerleave', { pointerType: 'mouse' })
        )
        await vi.runAllTimersAsync()

        expect(getMenu()).toBeNull()
      })

      test('does not steal focus when opening', async () => {
        const button = document.createElement('button')
        document.body.append(button)

        try {
          const wrapper = mountMenu({ hover: true })

          button.focus()
          expect(document.activeElement).toBe(button)

          await getAnchor(wrapper).trigger('pointerenter', {
            pointerType: 'mouse'
          })
          await vi.runAllTimersAsync()

          expect(getMenu()).not.toBeNull()
          expect(document.activeElement).toBe(button)
        } finally {
          button.remove()
        }
      })

      test('activating the anchor closes a hover-shown menu', async () => {
        const wrapper = mountMenu({ hover: true })

        await getAnchor(wrapper).trigger('pointerenter', {
          pointerType: 'mouse'
        })
        await vi.runAllTimersAsync()
        expect(getMenu()).not.toBeNull()

        await getAnchor(wrapper).trigger('click')
        await vi.runAllTimersAsync()

        expect(getMenu()).toBeNull()
      })

      test('clicking the anchor while hover showing a menu should keep it', async () => {
        const wrapper = mountMenu({ hover: true })

        await getAnchor(wrapper).trigger('pointerenter', {
          pointerType: 'mouse'
        })
        await getAnchor(wrapper).trigger('click')
        await vi.runAllTimersAsync()
        expect(getMenu()).not.toBeNull()

        await getAnchor(wrapper).trigger('click')
        await vi.runAllTimersAsync()

        expect(getMenu()).toBeNull()
      })

      test('closes the whole hover chain when the pointer leaves a submenu', async () => {
        activeWrapper = mount(
          defineComponent({
            setup() {
              return () =>
                h('div', { class: 'my-anchor' }, [
                  h(
                    QMenu,
                    { class: 'outer-menu', hover: true, modelValue: true },
                    () => [
                      h('div', { class: 'inner-anchor' }, [
                        h(
                          QMenu,
                          {
                            class: 'inner-menu',
                            hover: true,
                            modelValue: true
                          },
                          () => h('div', { class: 'my-item' }, 'Item')
                        )
                      ])
                    ]
                  )
                ])
            }
          }),
          { attachTo: document.body }
        )

        await flushPromises()
        await vi.runAllTimersAsync()

        expect(document.querySelector('.inner-menu')).not.toBeNull()

        // leaving the inner menu for a foreign target must close the
        // outer menu too, even though its own DOM saw no pointer event
        document
          .querySelector('.inner-menu')
          .dispatchEvent(
            new PointerEvent('pointerleave', { pointerType: 'mouse' })
          )
        await vi.runAllTimersAsync()

        expect(document.querySelector('.inner-menu')).toBeNull()
        expect(document.querySelector('.outer-menu')).toBeNull()
      })
    })

    describe('[(prop)hover-delay]', () => {
      test('type Number has effect', async () => {
        const wrapper = mountMenu({ hover: true, hoverDelay: 500 })

        await getAnchor(wrapper).trigger('pointerenter', {
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
        const wrapper = mountMenu({ hover: true, hoverHideDelay: 500 })

        await getAnchor(wrapper).trigger('pointerenter', {
          pointerType: 'mouse'
        })
        await vi.runAllTimersAsync()
        expect(getMenu()).not.toBeNull()

        await getAnchor(wrapper).trigger('pointerleave', {
          pointerType: 'mouse'
        })
        await vi.advanceTimersByTimeAsync(499)

        expect(getMenu()).not.toBeNull()

        await vi.runAllTimersAsync()

        expect(getMenu()).toBeNull()
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

        // an anchor move needs no call at all: the browser tracks it
        Object.assign(getAnchor(wrapper).element.style, {
          top: '200px',
          left: '300px'
        })

        let rect = getMenuRect()
        expect(rect.top).toBe(250)
        expect(rect.left).toBe(300)

        // the method stays callable (re-checks the placement decision)
        expect(getMenuComponent(wrapper).vm.updatePosition()).toBeUndefined()

        rect = getMenuRect()
        expect(rect.top).toBe(250)
        expect(rect.left).toBe(300)
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
    describe('JS positioning fallback', () => {
      // what browsers without CSS anchor positioning support get
      beforeEach(() => {
        engineOverride.forceJsFallback = true
      })

      test('positions the menu through the JS engine', async () => {
        const wrapper = await mountPositionedMenu()

        // same resulting geometry as the native path (bottom start /
        // top start), reached through measured pixel styles instead
        // of anchor() insets
        const rect = getMenuRect()
        expect(rect.top).toBe(150)
        expect(rect.left).toBe(100)

        expect(getMenu().classList.contains('q-position-engine')).toBe(true)
        expect(getMenu().style.top).toBe('150px')
        expect(
          getAnchor(wrapper).element.style.getPropertyValue('anchor-name')
        ).toBe('')
      })

      test('follows visual viewport moves while showing on iOS', async () => {
        // iOS scrolls only the visual viewport while the soft keyboard is
        // open (or while pinch-zoomed): no window scroll event fires, yet
        // position:fixed popups stay pinned to the pre-scroll viewport,
        // so the popup must re-anchor on visual viewport scroll/resize
        const originalIos = client.is.ios
        client.is.ios = true

        const addSpy = vi.spyOn(window.visualViewport, 'addEventListener')
        const removeSpy = vi.spyOn(window.visualViewport, 'removeEventListener')

        try {
          const wrapper = mountMenu()
          await showMenu(wrapper)

          for (const evt of ['scroll', 'resize']) {
            expect(addSpy).toHaveBeenCalledWith(
              evt,
              expect.any(Function),
              expect.anything()
            )
          }

          await hideMenu(wrapper)

          for (const evt of ['scroll', 'resize']) {
            expect(removeSpy).toHaveBeenCalledWith(
              evt,
              expect.any(Function),
              expect.anything()
            )
          }
        } finally {
          client.is.ios = originalIos
        }
      })

      test('follows an anchor still moving while the enter transition plays', async () => {
        const wrapper = mountMenu(void 0, {
          default: () => h('div', { style: { width: '50px', height: '20px' } })
        })
        setAnchorRect(wrapper)

        getMenuComponent(wrapper).vm.show()
        await flushPromises()
        // let the show tick take the initial measurement
        await vi.advanceTimersByTimeAsync(50)

        // positioned below the anchor (bottom start / top start)
        expect(getMenu().style.top).toBe('150px')

        // the anchor springs to a new spot mid-transition, the way a push
        // QBtn returns from its :active translate after the opening click
        getAnchor(wrapper).element.style.top = '120px'
        // ...and the menu follows while still inside the enter transition
        await vi.advanceTimersByTimeAsync(100)

        expect(getMenu().style.top).toBe('170px')

        await vi.runAllTimersAsync()
      })

      test('stays glued to its scrolled-away anchor instead of staying visible', async () => {
        // the anchor sits inside a small scrollable container
        const container = document.createElement('div')
        Object.assign(container.style, {
          position: 'fixed',
          top: '0px',
          left: '0px',
          width: '300px',
          height: '200px',
          overflow: 'auto'
        })
        document.body.append(container)

        const wrapper = mountMenu(
          void 0,
          {
            default: () =>
              h('div', { style: { width: '50px', height: '20px' } })
          },
          { attachTo: container }
        )
        Object.assign(getAnchor(wrapper).element.style, {
          marginTop: '100px',
          width: '100px',
          height: '50px'
        })
        const spacer = document.createElement('div')
        spacer.style.height = '1000px'
        container.append(spacer)

        try {
          await showMenu(wrapper)

          const before = getMenuRect()

          // any scrolling container is tracked, no helper class involved
          container.scrollTop = 60
          container.dispatchEvent(new Event('scroll'))
          expect(getMenuRect().top).toBe(before.top - 60)

          // scrolling the anchor out takes the menu out with it: the
          // frozen placement is re-expressed, never re-clamped on screen
          container.scrollTop = 500
          container.dispatchEvent(new Event('scroll'))
          expect(getMenuRect().top).toBe(before.top - 500)
        } finally {
          container.remove()
        }
      })

      test('a cover menu follows its scrolled-away anchor too', async () => {
        // cover means centered-on-centered axes (the anchor-center path),
        // whose viewport shift must stay frozen while scrolling
        const container = document.createElement('div')
        Object.assign(container.style, {
          position: 'fixed',
          top: '0px',
          left: '0px',
          width: '300px',
          height: '200px',
          overflow: 'auto'
        })
        document.body.append(container)

        const wrapper = mountMenu(
          { cover: true },
          {
            default: () =>
              h('div', { style: { width: '50px', height: '20px' } })
          },
          { attachTo: container }
        )
        Object.assign(getAnchor(wrapper).element.style, {
          marginTop: '100px',
          width: '100px',
          height: '50px'
        })
        const spacer = document.createElement('div')
        spacer.style.height = '1000px'
        container.append(spacer)

        try {
          await showMenu(wrapper)

          const before = getMenuRect()
          // covering the anchor's box
          expect(before.top).toBe(100)

          container.scrollTop = 500
          container.dispatchEvent(new Event('scroll'))

          // stays glued off-screen instead of pinning to the viewport
          expect(getMenuRect().top).toBe(before.top - 500)
        } finally {
          container.remove()
        }
      })

      test('ignores scrolls originating inside its own content', async () => {
        const wrapper = await mountPositionedMenu()
        expect(getMenu().style.top).toBe('150px')

        // the anchor moves, but nothing has announced it yet
        getAnchor(wrapper).element.style.top = '120px'

        // a scroll inside the menu's own scrollable content is no signal
        getMenu().dispatchEvent(new Event('scroll'))
        expect(getMenu().style.top).toBe('150px')

        // ...while a scroll anywhere else is
        document.dispatchEvent(new Event('scroll'))
        expect(getMenu().style.top).toBe('170px')
      })
    })

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

    test('dismissal swallows a tap but lets a mouse press through', async () => {
      const wrapper = mountMenu()
      await showMenu(wrapper)

      const touchstart = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({ identifier: 1, target: document.body })]
      })
      document.body.dispatchEvent(touchstart)
      await flushPromises()
      await vi.runAllTimersAsync()

      expect(getMenu()).toBeNull()
      // the tap must not click through to the element underneath
      expect(touchstart.defaultPrevented).toBe(true)

      await showMenu(wrapper)

      const mousedown = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true
      })
      document.body.dispatchEvent(mousedown)
      await flushPromises()
      await vi.runAllTimersAsync()

      expect(getMenu()).toBeNull()
      // desktop convention: the dismissing press reaches the page
      expect(mousedown.defaultPrevented).toBe(false)
    })

    test('a press on a dialog backdrop closes the menu, not the dialog', async () => {
      activeWrapper = mount(
        defineComponent({
          setup() {
            return () =>
              h(QDialog, { modelValue: true }, () =>
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

      const pressBackdrop = () =>
        document
          .querySelector('.q-dialog__backdrop')
          .dispatchEvent(
            new MouseEvent('mousedown', { bubbles: true, cancelable: true })
          )

      pressBackdrop()
      await flushPromises()
      await vi.runAllTimersAsync()

      expect(getMenu()).toBeNull()
      expect(document.querySelector('.q-dialog')).not.toBeNull()

      pressBackdrop()
      await flushPromises()
      await vi.runAllTimersAsync()

      expect(document.querySelector('.q-dialog')).toBeNull()
    })

    test.each([
      ['CSS anchor positioning', false],
      ['the JS positioning fallback', true]
    ])(
      'follows its anchor through a fullscreen detach and back on %s (issue #18513)',
      async (_, forceJsFallback) => {
        engineOverride.forceJsFallback = forceJsFallback
        activeWrapper = mount(
          defineComponent({
            setup() {
              return () =>
                h(
                  FullscreenAnchorHost,
                  // positioned, and pushed away from where the detached
                  // geometry will land so the reposition is observable
                  { style: 'position: relative; margin-top: 300px' },
                  () =>
                    h(
                      'div',
                      {
                        class: 'my-anchor',
                        style:
                          'position: absolute; top: 40px; left: 30px;' +
                          ' width: 100px; height: 50px'
                      },
                      [
                        h(QMenu, null, () =>
                          h('div', { style: 'width: 50px; height: 20px' })
                        )
                      ]
                    )
                )
            }
          }),
          { attachTo: document.body }
        )
        const wrapper = activeWrapper

        await showMenu(wrapper)

        const beforeTop = getMenuRect().top
        const host = wrapper.findComponent(FullscreenAnchorHost)

        host.vm.setFullscreen()
        // the suite loads no CSS, so emulate what the fullscreen class does
        // to the detached element
        Object.assign(host.vm.$el.style, {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '500px',
          height: '400px',
          margin: '0'
        })
        await flushAnimationFrames()

        // the menu is still open...
        const menuEl = getMenu()
        expect(menuEl).not.toBeNull()

        // ...repositioned onto the moved anchor (bottom start / top start)...
        const anchorRect = getAnchor(wrapper).element.getBoundingClientRect()
        expect(getMenuRect().top).toBe(anchorRect.bottom)
        expect(getMenuRect().left).toBe(anchorRect.left)
        expect(getMenuRect().top).not.toBe(beforeTop)

        // ...and its portal paints above the detached element
        // (same z-index: later in DOM order wins)
        let portalNode = menuEl
        while (portalNode.parentElement !== document.body) {
          portalNode = portalNode.parentElement
        }
        expect(
          host.vm.$el.compareDocumentPosition(portalNode) &
            Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy()

        host.vm.exitFullscreen()
        host.vm.$el.style.cssText = 'position: relative; margin-top: 300px'
        await flushAnimationFrames()

        // restored: still open, tracking the anchor at its original position
        const restoredRect = getAnchor(wrapper).element.getBoundingClientRect()
        expect(getMenu()).not.toBeNull()
        expect(getMenuRect().top).toBe(restoredRect.bottom)
      }
    )

    test('follows an anchor still moving while the enter transition plays', async () => {
      const wrapper = mountMenu(void 0, {
        default: () => h('div', { style: { width: '50px', height: '20px' } })
      })
      setAnchorRect(wrapper)

      getMenuComponent(wrapper).vm.show()
      await flushPromises()
      // let the show tick run the placement pass
      await vi.advanceTimersByTimeAsync(50)

      // positioned below the anchor (bottom start / top start)
      expect(getMenuRect().top).toBe(150)

      // the anchor springs to a new spot mid-transition, the way a push
      // QBtn returns from its :active translate after the opening click;
      // the browser re-anchors without any engine involvement
      getAnchor(wrapper).element.style.top = '120px'

      expect(getMenuRect().top).toBe(170)

      await vi.runAllTimersAsync()
    })

    test('finishes a pending hide when its keep-alive page deactivates', async () => {
      const router = await getRouter(['/home', '/account'])
      const onHide = vi.fn()
      const getPortalEl = () =>
        document.body.querySelector('[id^="q-portal--menu"]')

      const KeptAlivePage = defineComponent({
        name: 'KeptAlivePage',
        setup() {
          return () =>
            h('div', { class: 'my-anchor', tabindex: 0 }, [
              h(QMenu, { modelValue: true, onHide }, () => 'Menu content')
            ])
        }
      })

      const Host = defineComponent({
        name: 'Host',
        setup() {
          const route = useRoute()

          return () =>
            h(KeepAlive, null, {
              default: () => (route.path === '/home' ? h(KeptAlivePage) : null)
            })
        }
      })

      await router.push('/home')

      activeWrapper = mount(Host, {
        attachTo: document.body,
        global: {
          plugins: [router]
        }
      })
      await flushPromises()
      await vi.runAllTimersAsync()

      expect(getPortalEl()).not.toBe(null)

      // routing away hides the menu and deactivates the page holding it
      // within the same tick, which cancels the hide transition's timer
      await router.push('/account')
      await flushPromises()
      await vi.runAllTimersAsync()

      expect(onHide).toHaveBeenCalledTimes(1)
      expect(getPortalEl()).toBe(null)
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

    // the anchor is the control that opens the popup, but it is devland
    // markup, so QMenu maintains its disclosure ARIA from the outside
    describe('anchor ARIA', () => {
      function mountMenuOnButton(menuProps) {
        activeWrapper = mount(
          defineComponent({
            props: { menuProps: Object },
            setup(componentProps) {
              return () =>
                h('button', { class: 'my-anchor' }, [
                  h(QMenu, componentProps.menuProps, () => 'Menu content')
                ])
            }
          }),
          {
            props: { menuProps },
            attachTo: document.body
          }
        )

        return activeWrapper
      }

      test('tracks the popup state on the anchor', async () => {
        const wrapper = mountMenuOnButton()
        const anchorEl = getAnchor(wrapper).element

        expect(anchorEl.getAttribute('aria-expanded')).toBe('false')

        await showMenu(wrapper)

        expect(anchorEl.getAttribute('aria-expanded')).toBe('true')

        await hideMenu(wrapper)

        expect(anchorEl.getAttribute('aria-expanded')).toBe('false')
      })

      test('mirrors a declared popup role as aria-haspopup', () => {
        const wrapper = mountMenuOnButton({ role: 'menu' })

        expect(getAnchor(wrapper).element.getAttribute('aria-haspopup')).toBe(
          'menu'
        )
      })

      test('claims no aria-haspopup for a role-less popup', () => {
        const wrapper = mountMenuOnButton()

        expect(getAnchor(wrapper).element.hasAttribute('aria-haspopup')).toBe(
          false
        )
      })

      test('leaves an anchor that is not a control alone', async () => {
        // the default anchor of this suite is a plain <div>, which
        // computes to the "generic" role
        const wrapper = mountMenu({ role: 'menu' })
        const anchorEl = getAnchor(wrapper).element

        await showMenu(wrapper)

        expect(anchorEl.hasAttribute('aria-expanded')).toBe(false)
        expect(anchorEl.hasAttribute('aria-haspopup')).toBe(false)
      })
    })
  })
})
