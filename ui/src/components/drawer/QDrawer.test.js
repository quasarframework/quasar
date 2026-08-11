import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import { getRouter } from 'testing/runtime/router.js'
import QLayout from '../layout/QLayout.js'
import QDrawer from './QDrawer.js'

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
 * QDrawer only works as a child of QLayout, so everything gets mounted
 * through one. The props of both are held by the host component, which
 * makes them settable through wrapper.setProps().
 */
function mountDrawer(drawerProps, slots, mountOptions) {
  drawerProps ||= {}
  mountOptions ||= {}

  activeWrapper = mount(
    defineComponent({
      props: { drawerProps: Object, layoutProps: Object },
      setup(componentProps, { slots: componentSlots }) {
        return () =>
          h(QLayout, componentProps.layoutProps, {
            default: () =>
              h(QDrawer, componentProps.drawerProps, componentSlots)
          })
      }
    }),
    {
      props: { drawerProps, layoutProps: {} },
      slots: slots || { default: () => 'Drawer content' },
      attachTo: document.body,
      ...mountOptions
    }
  )

  return activeWrapper
}

function getDrawer(wrapper) {
  return wrapper.get('aside.q-drawer')
}

function getDrawerComponent(wrapper) {
  return wrapper.findComponent(QDrawer)
}

function getContent(wrapper) {
  return wrapper.get('.q-drawer__content')
}

async function settle() {
  await flushPromises()
  await vi.runAllTimersAsync()
}

function setDrawerProps(wrapper, drawerProps) {
  return wrapper.setProps({ drawerProps })
}

/**
 * The layout learns about its width through a QResizeObserver, which is
 * what decides whether the drawer is below its breakpoint or not.
 */
async function setLayoutWidth(wrapper, width) {
  wrapper
    .getComponent({ name: 'QResizeObserver' })
    .vm.$emit('resize', { width, height: 600 })
  await settle()
}

async function mountReadyDrawer(drawerProps, slots, mountOptions) {
  const wrapper = mountDrawer(drawerProps, slots, mountOptions)
  await settle()
  return wrapper
}

async function pressEscapeKey() {
  window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27 }))
  window.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 27 }))
  await settle()
}

describe('[QDrawer API]', () => {
  describe('[Props]', () => {
    describe('[(prop)model-value]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = await mountReadyDrawer({ modelValue: false })

        // a hidden left drawer is parked outside of the viewport
        expect(getDrawer(wrapper).$style('transform')).toBe(
          'translateX(-300px)'
        )

        await setDrawerProps(wrapper, { modelValue: true })
        await settle()

        expect(getDrawer(wrapper).$style('transform')).toBe('translateX(0px)')
      })

      test('type null has effect', async () => {
        // a null model leaves the drawer in charge of its own state
        const wrapper = await mountReadyDrawer({ modelValue: null })

        expect(getDrawer(wrapper).$style('transform')).toBe(
          'translateX(-300px)'
        )

        getDrawerComponent(wrapper).vm.show()
        await settle()

        expect(getDrawer(wrapper).$style('transform')).toBe('translateX(0px)')
      })
    })

    describe('[(prop)side]', () => {
      async function testSide(propVal) {
        const wrapper = await mountReadyDrawer({
          side: propVal,
          modelValue: false
        })

        expect(getDrawer(wrapper).classes()).toContain(`q-drawer--${propVal}`)

        // it hides towards its own side of the screen
        expect(getDrawer(wrapper).$style('transform')).toBe(
          `translateX(${propVal === 'left' ? '-' : ''}300px)`
        )

        await setDrawerProps(wrapper, { side: propVal, modelValue: true })
        await settle()

        expect(getDrawer(wrapper).$style('transform')).toBe('translateX(0px)')
      }

      test('value "left" has effect', async () => {
        await testSide('left')
      })

      test('value "right" has effect', async () => {
        await testSide('right')
      })

      test('only accepts the documented values', () => {
        const { validator, default: defaultValue } = QDrawer.props.side

        expect(validator(defaultValue)).toBe(true)
        expect(validator('right')).toBe(true)
        expect(validator('nowhere')).toBe(false)
      })
    })

    describe('[(prop)overlay]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = await mountReadyDrawer({ modelValue: true })

        expect(getDrawer(wrapper).classes()).toContain('q-drawer--standard')
        expect(getDrawer(wrapper).classes()).not.toContain('q-drawer--on-top')
        expect(getDrawerComponent(wrapper).emitted('onLayout')).toStrictEqual([
          [true]
        ])

        await setDrawerProps(wrapper, { modelValue: true, overlay: true })
        await settle()

        // an overlay drawer does not take part in the layout anymore
        expect(getDrawer(wrapper).classes()).toEqual(
          expect.arrayContaining(['q-drawer--on-top', 'fixed'])
        )
        expect(getDrawerComponent(wrapper).emitted('onLayout')).toStrictEqual([
          [true],
          [false]
        ])
      })
    })

    describe('[(prop)width]', () => {
      test('type Number has effect', async () => {
        const propVal = 250
        const wrapper = await mountReadyDrawer({ modelValue: true })

        expect(getDrawer(wrapper).$style('width')).toBe('300px')

        await setDrawerProps(wrapper, { modelValue: true, width: propVal })
        await settle()

        expect(getDrawer(wrapper).$style('width')).toBe(`${propVal}px`)
      })
    })

    describe('[(prop)mini]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = await mountReadyDrawer({ modelValue: true })

        expect(getDrawer(wrapper).classes()).toContain('q-drawer--standard')

        await setDrawerProps(wrapper, { modelValue: true, mini: true })
        await settle()

        expect(getDrawer(wrapper).classes()).toContain('q-drawer--mini')
        expect(getDrawer(wrapper).classes()).not.toContain('q-drawer--standard')
        // the mini width takes over
        expect(getDrawer(wrapper).$style('width')).toBe('57px')
      })
    })

    describe('[(prop)mini-width]', () => {
      test('type Number has effect', async () => {
        const propVal = 100
        const wrapper = await mountReadyDrawer({ modelValue: true, mini: true })

        expect(getDrawer(wrapper).$style('width')).toBe('57px')

        await setDrawerProps(wrapper, {
          modelValue: true,
          mini: true,
          miniWidth: propVal
        })
        await settle()

        expect(getDrawer(wrapper).$style('width')).toBe(`${propVal}px`)
      })
    })

    describe('[(prop)mini-to-overlay]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = await mountReadyDrawer({ modelValue: true, mini: true })

        expect(getDrawer(wrapper).classes()).not.toContain('q-drawer--on-top')

        await setDrawerProps(wrapper, {
          modelValue: true,
          mini: true,
          miniToOverlay: true
        })
        await settle()

        // it floats above the page instead of pushing it
        expect(getDrawer(wrapper).classes()).toEqual(
          expect.arrayContaining(['q-drawer--on-top', 'fixed'])
        )
      })
    })

    describe('[(prop)no-mini-animation]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = await mountReadyDrawer({
          modelValue: true,
          noMiniAnimation: true
        })

        await setDrawerProps(wrapper, {
          modelValue: true,
          noMiniAnimation: true,
          mini: true
        })
        await flushPromises()

        expect(getDrawer(wrapper).classes()).not.toContain(
          'q-drawer--mini-animate'
        )
      })

      test('animates the mini state change without it', async () => {
        const wrapper = await mountReadyDrawer({ modelValue: true })

        await setDrawerProps(wrapper, { modelValue: true, mini: true })
        await flushPromises()

        expect(getDrawer(wrapper).classes()).toContain('q-drawer--mini-animate')

        await settle()

        expect(getDrawer(wrapper).classes()).not.toContain(
          'q-drawer--mini-animate'
        )
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = await mountReadyDrawer()

        expect(getDrawer(wrapper).classes()).not.toContain('q-drawer--dark')

        await setDrawerProps(wrapper, { dark: true })

        expect(getDrawer(wrapper).classes()).toEqual(
          expect.arrayContaining(['q-drawer--dark', 'q-dark'])
        )
      })

      test('type null has effect', async () => {
        const wrapper = await mountReadyDrawer({ dark: null })

        wrapper.vm.$q.dark.set(false)
        await flushPromises()

        expect(getDrawer(wrapper).classes()).not.toContain('q-drawer--dark')

        wrapper.vm.$q.dark.set(true)
        await flushPromises()

        expect(getDrawer(wrapper).classes()).toContain('q-drawer--dark')

        wrapper.vm.$q.dark.set(false)
      })
    })

    describe('[(prop)breakpoint]', () => {
      test('type Number has effect', async () => {
        const propVal = 1023
        const wrapper = await mountReadyDrawer({ breakpoint: propVal })

        await setLayoutWidth(wrapper, propVal + 1)

        expect(getDrawer(wrapper).classes()).not.toContain('q-drawer--mobile')

        await setLayoutWidth(wrapper, propVal)

        // at (or below) the breakpoint it turns into a mobile drawer
        expect(getDrawer(wrapper).classes()).toEqual(
          expect.arrayContaining(['q-drawer--mobile', 'q-drawer--on-top'])
        )
      })
    })

    describe('[(prop)behavior]', () => {
      async function testBehavior(propVal, { width, isMobile }) {
        const wrapper = await mountReadyDrawer({ behavior: propVal })

        await setLayoutWidth(wrapper, width)

        expect(getDrawer(wrapper).classes().includes('q-drawer--mobile')).toBe(
          isMobile
        )
      }

      test('value "default" has effect', async () => {
        // it follows the breakpoint
        await testBehavior('default', { width: 1500, isMobile: false })
        activeWrapper.unmount()
        await testBehavior('default', { width: 500, isMobile: true })
      })

      test('value "desktop" has effect', async () => {
        // it stays a desktop drawer, no matter how narrow the layout is
        await testBehavior('desktop', { width: 500, isMobile: false })
      })

      test('value "mobile" has effect', async () => {
        // it stays a mobile drawer, no matter how wide the layout is
        await testBehavior('mobile', { width: 1500, isMobile: true })
      })

      test('only accepts the documented values', () => {
        const { validator, default: defaultValue } = QDrawer.props.behavior

        expect(validator(defaultValue)).toBe(true)
        expect(validator('mobile')).toBe(true)
        expect(validator('nowhere')).toBe(false)
      })
    })

    describe('[(prop)bordered]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = await mountReadyDrawer()

        expect(getDrawer(wrapper).classes()).not.toContain('q-drawer--bordered')

        await setDrawerProps(wrapper, { bordered: true })

        expect(getDrawer(wrapper).classes()).toContain('q-drawer--bordered')
      })
    })

    describe('[(prop)elevated]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = await mountReadyDrawer({ modelValue: true })

        expect(wrapper.find('.q-layout__shadow').exists()).toBe(false)

        await setDrawerProps(wrapper, { modelValue: true, elevated: true })

        expect(wrapper.find('.q-layout__shadow').exists()).toBe(true)

        // the shadow is only there while the drawer is showing
        await setDrawerProps(wrapper, { modelValue: false, elevated: true })
        await settle()

        expect(wrapper.find('.q-layout__shadow').exists()).toBe(false)
      })
    })

    describe('[(prop)persistent]', () => {
      test('type Boolean has effect', async () => {
        const router = await getRouter('/other')
        const wrapper = await mountReadyDrawer(
          { modelValue: true, behavior: 'mobile', persistent: true },
          void 0,
          { global: { plugins: [router] } }
        )

        router.push('/other')
        await settle()

        // a route change does not close it
        expect(getDrawer(wrapper).$style('transform')).toBe('translateX(0px)')
      })

      test('hides on a route change without it', async () => {
        const router = await getRouter('/other')
        const wrapper = await mountReadyDrawer(
          { modelValue: true, behavior: 'mobile' },
          void 0,
          { global: { plugins: [router] } }
        )

        router.push('/other')
        await settle()

        expect(getDrawer(wrapper).$style('transform')).toBe(
          'translateX(-300px)'
        )
      })
    })

    describe('[(prop)show-if-above]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = await mountReadyDrawer({
          showIfAbove: true,
          'onUpdate:modelValue': () => {}
        })

        // it starts off visible while above the breakpoint
        expect(getDrawer(wrapper).$style('transform')).toBe('translateX(0px)')
        expect(
          getDrawerComponent(wrapper).emitted('update:modelValue')
        ).toStrictEqual([[true]])

        await setLayoutWidth(wrapper, 500)

        expect(getDrawer(wrapper).$style('transform')).toBe(
          'translateX(-300px)'
        )
      })
    })

    describe('[(prop)no-swipe-open]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = await mountReadyDrawer({ behavior: 'mobile' })

        expect(wrapper.find('.q-drawer__opener').exists()).toBe(true)

        await setDrawerProps(wrapper, {
          behavior: 'mobile',
          noSwipeOpen: true
        })

        expect(wrapper.find('.q-drawer__opener').exists()).toBe(false)
      })
    })

    describe('[(prop)no-swipe-close]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = await mountReadyDrawer({ behavior: 'mobile' })

        expect(getDrawer(wrapper).element.__qtouchpan).toBeDefined()

        await setDrawerProps(wrapper, {
          behavior: 'mobile',
          noSwipeClose: true
        })

        expect(getDrawer(wrapper).element.__qtouchpan).toBeUndefined()
      })
    })

    describe('[(prop)no-swipe-backdrop]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = await mountReadyDrawer({
          behavior: 'mobile',
          modelValue: true
        })

        const backdrop = wrapper.get('.q-drawer__backdrop')
        expect(backdrop.element.__qtouchpan).toBeDefined()

        await setDrawerProps(wrapper, {
          behavior: 'mobile',
          modelValue: true,
          noSwipeBackdrop: true
        })

        expect(
          wrapper.get('.q-drawer__backdrop').element.__qtouchpan
        ).toBeUndefined()
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', async () => {
        const slotContent = 'some-slot-content'
        const wrapper = await mountReadyDrawer(
          {},
          { default: () => slotContent }
        )

        expect(getContent(wrapper).text()).toBe(slotContent)
      })
    })

    describe('[(slot)mini]', () => {
      test('renders the content', async () => {
        const slotContent = 'some-slot-content'
        const wrapper = await mountReadyDrawer(
          { modelValue: true },
          {
            default: () => 'Default content',
            mini: () => slotContent
          }
        )

        expect(getContent(wrapper).text()).toBe('Default content')

        // it replaces the default slot while in mini mode
        await setDrawerProps(wrapper, { modelValue: true, mini: true })
        await settle()

        expect(getContent(wrapper).text()).toBe(slotContent)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = await mountReadyDrawer({
          modelValue: false,
          'onUpdate:modelValue': () => {}
        })

        getDrawerComponent(wrapper).vm.show()
        await settle()

        const eventList = getDrawerComponent(wrapper).emitted()
        expect(eventList).toHaveProperty('update:modelValue')
        expect(eventList['update:modelValue']).toHaveLength(1)

        const [value] = eventList['update:modelValue'][0]
        expect(value).toBe(true)
      })
    })

    describe('[(event)show]', () => {
      test('is emitting', async () => {
        const wrapper = await mountReadyDrawer()
        const evt = new Event('click')

        getDrawerComponent(wrapper).vm.show(evt)
        await settle()

        const eventList = getDrawerComponent(wrapper).emitted()
        expect(eventList).toHaveProperty('show')
        expect(eventList.show).toHaveLength(1)

        expect(eventList.show[0][0]).toBe(evt)
      })
    })

    describe('[(event)before-show]', () => {
      test('is emitting', async () => {
        const wrapper = await mountReadyDrawer()
        const evt = new Event('click')

        getDrawerComponent(wrapper).vm.show(evt)
        await flushPromises()

        const eventList = getDrawerComponent(wrapper).emitted()
        expect(eventList).toHaveProperty('beforeShow')
        expect(eventList.beforeShow).toHaveLength(1)

        // it fires before the drawer is done showing
        expect(eventList.show).toBeUndefined()
        expect(eventList.beforeShow[0][0]).toBe(evt)
      })
    })

    describe('[(event)hide]', () => {
      test('is emitting', async () => {
        const wrapper = await mountReadyDrawer({ modelValue: true })
        const evt = new Event('click')

        getDrawerComponent(wrapper).vm.hide(evt)
        await settle()

        const eventList = getDrawerComponent(wrapper).emitted()
        expect(eventList).toHaveProperty('hide')
        expect(eventList.hide).toHaveLength(1)

        expect(eventList.hide[0][0]).toBe(evt)
      })
    })

    describe('[(event)before-hide]', () => {
      test('is emitting', async () => {
        const wrapper = await mountReadyDrawer({ modelValue: true })
        const evt = new Event('click')

        getDrawerComponent(wrapper).vm.hide(evt)
        await flushPromises()

        const eventList = getDrawerComponent(wrapper).emitted()
        expect(eventList).toHaveProperty('beforeHide')
        expect(eventList.beforeHide).toHaveLength(1)

        expect(eventList.hide).toBeUndefined()
        expect(eventList.beforeHide[0][0]).toBe(evt)
      })
    })

    describe('[(event)on-layout]', () => {
      test('is emitting', async () => {
        const wrapper = await mountReadyDrawer({ modelValue: true })

        const eventList = getDrawerComponent(wrapper).emitted()
        expect(eventList).toHaveProperty('onLayout')
        expect(eventList.onLayout).toHaveLength(1)

        const [state] = eventList.onLayout[0]
        expect(state).toBe(true)
      })
    })

    describe('[(event)click]', () => {
      test('is emitting', async () => {
        const wrapper = await mountReadyDrawer()
        // the wrapper has to exist before the event, as that is when
        // the native listeners get attached
        const drawer = getDrawerComponent(wrapper)

        await getContent(wrapper).trigger('click')

        const eventList = drawer.emitted()
        expect(eventList).toHaveProperty('click')
        expect(eventList.click).toHaveLength(1)

        const [evt] = eventList.click[0]
        expect(evt).toBeInstanceOf(Event)
      })
    })

    describe('[(event)mouseover]', () => {
      test('is emitting', async () => {
        const wrapper = await mountReadyDrawer()
        // the wrapper has to exist before the event, as that is when
        // the native listeners get attached
        const drawer = getDrawerComponent(wrapper)

        await getContent(wrapper).trigger('mouseover')

        const eventList = drawer.emitted()
        expect(eventList).toHaveProperty('mouseover')
        expect(eventList.mouseover).toHaveLength(1)

        const [evt] = eventList.mouseover[0]
        expect(evt).toBeInstanceOf(Event)
      })
    })

    describe('[(event)mouseout]', () => {
      test('is emitting', async () => {
        const wrapper = await mountReadyDrawer()
        // the wrapper has to exist before the event, as that is when
        // the native listeners get attached
        const drawer = getDrawerComponent(wrapper)

        await getContent(wrapper).trigger('mouseout')

        const eventList = drawer.emitted()
        expect(eventList).toHaveProperty('mouseout')
        expect(eventList.mouseout).toHaveLength(1)

        const [evt] = eventList.mouseout[0]
        expect(evt).toBeInstanceOf(Event)
      })
    })

    describe('[(event)escape-key]', () => {
      test('is emitting', async () => {
        const wrapper = await mountReadyDrawer({ modelValue: true })

        // crossing below the breakpoint auto-hides the drawer,
        // so it gets shown again as a mobile (dismissible) drawer
        await setLayoutWidth(wrapper, 500)
        getDrawerComponent(wrapper).vm.show(false)
        await settle()

        expect(getDrawer(wrapper).$style('transform')).toBe('translateX(0px)')

        await pressEscapeKey()

        const eventList = getDrawerComponent(wrapper).emitted()
        expect(eventList).toHaveProperty('escapeKey')
        expect(eventList.escapeKey).toHaveLength(1)
        expect(getDrawer(wrapper).$style('transform')).toBe(
          'translateX(-300px)'
        )
      })
    })

    describe('[(event)mini-state]', () => {
      test('is emitting', async () => {
        const wrapper = await mountReadyDrawer({ modelValue: true })

        let eventList = getDrawerComponent(wrapper).emitted()
        expect(eventList).toHaveProperty('miniState')
        expect(eventList.miniState).toHaveLength(1)

        const [state] = eventList.miniState[0]
        expect(state).toBe(false)

        await setDrawerProps(wrapper, { modelValue: true, mini: true })
        await settle()

        eventList = getDrawerComponent(wrapper).emitted()
        expect(eventList.miniState).toHaveLength(2)
        expect(eventList.miniState[1]).toStrictEqual([true])
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)show]', () => {
      test('should be callable', async () => {
        const wrapper = await mountReadyDrawer()

        expect(
          getDrawerComponent(wrapper).vm.show(new Event('click'))
        ).toBeUndefined()
        await settle()

        expect(getDrawer(wrapper).$style('transform')).toBe('translateX(0px)')
      })
    })

    describe('[(method)hide]', () => {
      test('should be callable', async () => {
        const wrapper = await mountReadyDrawer({ modelValue: true })

        expect(
          getDrawerComponent(wrapper).vm.hide(new Event('click'))
        ).toBeUndefined()
        await settle()

        expect(getDrawer(wrapper).$style('transform')).toBe(
          'translateX(-300px)'
        )
      })
    })

    describe('[(method)toggle]', () => {
      test('should be callable', async () => {
        const wrapper = await mountReadyDrawer()

        expect(
          getDrawerComponent(wrapper).vm.toggle(new Event('click'))
        ).toBeUndefined()
        await settle()

        expect(getDrawer(wrapper).$style('transform')).toBe('translateX(0px)')

        getDrawerComponent(wrapper).vm.toggle(new Event('click'))
        await settle()

        expect(getDrawer(wrapper).$style('transform')).toBe(
          'translateX(-300px)'
        )
      })
    })
  })

  describe('[Accessibility]', () => {
    // the swipe and backdrop-click dismissals are pointer-only, so the
    // drawer's modal states need ESCAPE as their keyboard path
    test('ESCAPE closes a shown overlay drawer', async () => {
      const wrapper = await mountReadyDrawer({
        modelValue: true,
        overlay: true
      })
      await setLayoutWidth(wrapper, 1200)

      await pressEscapeKey()

      expect(getDrawer(wrapper).$style('transform')).toBe('translateX(-300px)')
    })

    test('ESCAPE leaves a persistent drawer open', async () => {
      const wrapper = await mountReadyDrawer({
        modelValue: true,
        persistent: true
      })
      await setLayoutWidth(wrapper, 500)
      getDrawerComponent(wrapper).vm.show(false)
      await settle()

      await pressEscapeKey()

      expect(getDrawerComponent(wrapper).emitted('escapeKey')).toBeUndefined()
      expect(getDrawer(wrapper).$style('transform')).toBe('translateX(0px)')
    })

    test('ESCAPE leaves an in-layout drawer alone', async () => {
      const wrapper = await mountReadyDrawer({ modelValue: true })
      await setLayoutWidth(wrapper, 1200)

      await pressEscapeKey()

      // above its breakpoint and not in overlay mode the drawer is part
      // of the page layout -- not a modal surface to be dismissed
      expect(getDrawer(wrapper).$style('transform')).toBe('translateX(0px)')
    })
  })
})
