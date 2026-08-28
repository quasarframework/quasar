import { defineComponent, h, nextTick, ref, watch } from 'vue'
import { shallowMount } from '@vue/test-utils'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  onTestFinished,
  test,
  vi
} from 'vitest'

import Screen from '../../plugins/screen/Screen.js'
import QPopupProxy from './QPopupProxy.js'

function createPopupStub(name) {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: {
      contextMenu: Boolean,
      modelValue: Boolean,
      noParentEvent: Boolean,
      target: {
        default: true
      }
    },
    emits: [
      'beforeShow',
      'show',
      'beforeHide',
      'hide',
      'update:modelValue',
      'escapeKey',
      'shake'
    ],
    setup(props, { emit, expose, slots }) {
      const showing = ref(props.modelValue)

      watch(
        () => props.modelValue,
        value => {
          showing.value = value
        }
      )

      function show(evt) {
        emit('beforeShow', evt)
        emit('update:modelValue', true)
        showing.value = true
        emit('show', evt)
      }

      function hide(evt) {
        emit('beforeHide', evt)
        emit('update:modelValue', false)
        showing.value = false
        emit('hide', evt)
      }

      function toggle(evt) {
        if (showing.value) {
          hide(evt)
        } else {
          show(evt)
        }
      }

      expose({ hide, show, showing, toggle })

      return () =>
        h(
          'div',
          { class: `${name.toLowerCase()}-stub` },
          showing.value === true ? slots.default?.() : []
        )
    }
  })
}

const QDialogStub = createPopupStub('QDialog')
const QMenuStub = createPopupStub('QMenu')

function mountPopup(props = {}, options = {}) {
  return shallowMount(QPopupProxy, {
    props,
    global: {
      stubs: {
        QDialog: QDialogStub,
        QMenu: QMenuStub
      }
    },
    ...options
  })
}

function getMenuAttr(props, attrName) {
  return mountPopup(props).getComponent(QMenuStub).vm.$attrs[attrName]
}

function getDialogAttr(props, attrName) {
  const { width, height } = Screen

  Screen.width = 400
  Screen.height = 400

  const value = mountPopup(props).getComponent(QDialogStub).vm.$attrs[attrName]

  Screen.width = width
  Screen.height = height

  return value
}

function createTarget(className) {
  const target = document.createElement('div')
  target.className = className
  document.body.append(target)

  onTestFinished(() => target.remove())

  return target
}

beforeEach(() => {
  Screen.width = 1024
  Screen.height = 768
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('[QPopupProxy API]', () => {
  describe('[Props]', () => {
    describe('[(prop)target]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountPopup({ target: false })

        wrapper.vm.show()
        await nextTick()

        expect(wrapper.emitted('show')).toBeUndefined()
      })

      test('type String has effect', async () => {
        const target = createTarget('string-target')
        const wrapper = mountPopup({ target: '.string-target' })

        target.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        await nextTick()

        expect(wrapper.emitted('show')).toHaveLength(1)
      })

      test('type Element has effect', async () => {
        const target = createTarget('element-target')
        const wrapper = mountPopup({ target })

        target.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        await nextTick()

        expect(wrapper.emitted('show')).toHaveLength(1)
      })
    })

    describe('[(prop)no-parent-event]', () => {
      test('type Boolean has effect', async () => {
        const target = createTarget('no-parent-event-target')
        const wrapper = mountPopup({ noParentEvent: true, target })

        target.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        await nextTick()

        expect(wrapper.emitted('show')).toBeUndefined()
      })
    })

    describe('[(prop)context-menu]', () => {
      test('type Boolean has effect', async () => {
        const target = createTarget('context-menu-target')
        const wrapper = mountPopup({ contextMenu: true, target })
        const evt = new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true
        })

        target.dispatchEvent(evt)
        await nextTick()
        await nextTick()

        expect(evt.defaultPrevented).toBe(true)
        expect(wrapper.emitted('show')).toHaveLength(1)
        expect(wrapper.getComponent(QMenuStub).props('contextMenu')).toBe(true)
      })
    })

    describe('[(prop)model-value]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountPopup(
          { modelValue: true },
          { slots: { default: () => 'Popup content' } }
        )

        expect(wrapper.text()).toContain('Popup content')
      })
    })

    describe('[(prop)breakpoint]', () => {
      test('type Number has effect', () => {
        const wrapper = mountPopup({ breakpoint: 800 })

        expect(wrapper.findComponent(QDialogStub).exists()).toBe(true)
        expect(wrapper.vm.currentComponent.type).toBe('dialog')
      })

      test('type String has effect', () => {
        const wrapper = mountPopup({ breakpoint: '500' })

        expect(wrapper.findComponent(QMenuStub).exists()).toBe(true)
        expect(wrapper.vm.currentComponent.type).toBe('menu')
      })
    })

    describe('[(prop)persistent]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuAttr({}, 'persistent')).toBeUndefined()
        expect(getMenuAttr({ persistent: true }, 'persistent')).toBe(true)
        expect(getDialogAttr({ persistent: true }, 'persistent')).toBe(true)
      })
    })

    describe('[(prop)no-esc-dismiss]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuAttr({ noEscDismiss: true }, 'noEscDismiss')).toBe(true)
        expect(getDialogAttr({ noEscDismiss: true }, 'noEscDismiss')).toBe(true)
      })
    })

    describe('[(prop)no-route-dismiss]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuAttr({ noRouteDismiss: true }, 'noRouteDismiss')).toBe(
          true
        )
        expect(getDialogAttr({ noRouteDismiss: true }, 'noRouteDismiss')).toBe(
          true
        )
      })
    })

    describe('[(prop)auto-close]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuAttr({ autoClose: true }, 'autoClose')).toBe(true)
        expect(getDialogAttr({ autoClose: true }, 'autoClose')).toBe(true)
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuAttr({ square: true }, 'square')).toBe(true)
        expect(getDialogAttr({ square: true }, 'square')).toBe(true)
      })
    })

    describe('[(prop)no-refocus]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuAttr({ noRefocus: true }, 'noRefocus')).toBe(true)
        expect(getDialogAttr({ noRefocus: true }, 'noRefocus')).toBe(true)
      })
    })

    describe('[(prop)no-focus]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuAttr({ noFocus: true }, 'noFocus')).toBe(true)
        expect(getDialogAttr({ noFocus: true }, 'noFocus')).toBe(true)
      })
    })

    describe('[(prop)transition-show]', () => {
      test('type String has effect', () => {
        expect(getMenuAttr({ transitionShow: 'scale' }, 'transitionShow')).toBe(
          'scale'
        )
        expect(
          getDialogAttr({ transitionShow: 'scale' }, 'transitionShow')
        ).toBe('scale')
      })
    })

    describe('[(prop)transition-hide]', () => {
      test('type String has effect', () => {
        expect(getMenuAttr({ transitionHide: 'scale' }, 'transitionHide')).toBe(
          'scale'
        )
        expect(
          getDialogAttr({ transitionHide: 'scale' }, 'transitionHide')
        ).toBe('scale')
      })
    })

    describe('[(prop)transition-duration]', () => {
      test('type String has effect', () => {
        expect(
          getMenuAttr({ transitionDuration: '500' }, 'transitionDuration')
        ).toBe('500')
        expect(
          getDialogAttr({ transitionDuration: '500' }, 'transitionDuration')
        ).toBe('500')
      })

      test('type Number has effect', () => {
        expect(
          getMenuAttr({ transitionDuration: 500 }, 'transitionDuration')
        ).toBe(500)
        expect(
          getDialogAttr({ transitionDuration: 500 }, 'transitionDuration')
        ).toBe(500)
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuAttr({ dark: true }, 'dark')).toBe(true)
      })

      test('type null has effect', () => {
        expect(getMenuAttr({ dark: null }, 'dark')).toBeNull()
      })
    })

    describe('[(prop)fit]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuAttr({ fit: true }, 'fit')).toBe(true)
      })
    })

    describe('[(prop)cover]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuAttr({ cover: true }, 'cover')).toBe(true)
      })
    })

    describe('[(prop)anchor]', () => {
      function testAnchor(value) {
        expect(getMenuAttr({ anchor: value }, 'anchor')).toBe(value)
      }

      test('value "top left" has effect', () => {
        testAnchor('top left')
      })

      test('value "top middle" has effect', () => {
        testAnchor('top middle')
      })

      test('value "top right" has effect', () => {
        testAnchor('top right')
      })

      test('value "top start" has effect', () => {
        testAnchor('top start')
      })

      test('value "top end" has effect', () => {
        testAnchor('top end')
      })

      test('value "center left" has effect', () => {
        testAnchor('center left')
      })

      test('value "center middle" has effect', () => {
        testAnchor('center middle')
      })

      test('value "center right" has effect', () => {
        testAnchor('center right')
      })

      test('value "center start" has effect', () => {
        testAnchor('center start')
      })

      test('value "center end" has effect', () => {
        testAnchor('center end')
      })

      test('value "bottom left" has effect', () => {
        testAnchor('bottom left')
      })

      test('value "bottom middle" has effect', () => {
        testAnchor('bottom middle')
      })

      test('value "bottom right" has effect', () => {
        testAnchor('bottom right')
      })

      test('value "bottom start" has effect', () => {
        testAnchor('bottom start')
      })

      test('value "bottom end" has effect', () => {
        testAnchor('bottom end')
      })
    })

    describe('[(prop)self]', () => {
      function testSelf(value) {
        expect(getMenuAttr({ self: value }, 'self')).toBe(value)
      }

      test('value "top left" has effect', () => {
        testSelf('top left')
      })

      test('value "top middle" has effect', () => {
        testSelf('top middle')
      })

      test('value "top right" has effect', () => {
        testSelf('top right')
      })

      test('value "top start" has effect', () => {
        testSelf('top start')
      })

      test('value "top end" has effect', () => {
        testSelf('top end')
      })

      test('value "center left" has effect', () => {
        testSelf('center left')
      })

      test('value "center middle" has effect', () => {
        testSelf('center middle')
      })

      test('value "center right" has effect', () => {
        testSelf('center right')
      })

      test('value "center start" has effect', () => {
        testSelf('center start')
      })

      test('value "center end" has effect', () => {
        testSelf('center end')
      })

      test('value "bottom left" has effect', () => {
        testSelf('bottom left')
      })

      test('value "bottom middle" has effect', () => {
        testSelf('bottom middle')
      })

      test('value "bottom right" has effect', () => {
        testSelf('bottom right')
      })

      test('value "bottom start" has effect', () => {
        testSelf('bottom start')
      })

      test('value "bottom end" has effect', () => {
        testSelf('bottom end')
      })
    })

    describe('[(prop)offset]', () => {
      test('type Array has effect', () => {
        const offset = [8, 8]

        expect(getMenuAttr({ offset }, 'offset')).toStrictEqual(offset)
      })
    })

    describe('[(prop)touch-position]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuAttr({ touchPosition: true }, 'touchPosition')).toBe(true)
      })
    })

    describe('[(prop)hover]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuAttr({ hover: true }, 'hover')).toBe(true)
      })
    })

    describe('[(prop)hover-delay]', () => {
      test('type Number has effect', () => {
        expect(getMenuAttr({ hoverDelay: 300 }, 'hoverDelay')).toBe(300)
      })
    })

    describe('[(prop)hover-hide-delay]', () => {
      test('type Number has effect', () => {
        expect(getMenuAttr({ hoverHideDelay: 300 }, 'hoverHideDelay')).toBe(300)
      })
    })

    describe('[(prop)max-height]', () => {
      test('type String has effect', () => {
        // the Menu gets a default, the Dialog does not
        expect(getMenuAttr({}, 'maxHeight')).toBe('99vh')
        expect(getDialogAttr({}, 'maxHeight')).toBeUndefined()

        expect(getMenuAttr({ maxHeight: '200px' }, 'maxHeight')).toBe('200px')
      })
    })

    describe('[(prop)max-width]', () => {
      test('type String has effect', () => {
        expect(getMenuAttr({ maxWidth: '300px' }, 'maxWidth')).toBe('300px')
      })

      test('type null has effect', () => {
        expect(getMenuAttr({ maxWidth: null }, 'maxWidth')).toBeNull()
      })
    })

    describe('[(prop)no-backdrop-dismiss]', () => {
      test('type Boolean has effect', () => {
        expect(
          getDialogAttr({ noBackdropDismiss: true }, 'noBackdropDismiss')
        ).toBe(true)
      })
    })

    describe('[(prop)seamless]', () => {
      test('type Boolean has effect', () => {
        expect(getDialogAttr({ seamless: true }, 'seamless')).toBe(true)
      })
    })

    describe('[(prop)backdrop-filter]', () => {
      test('type String has effect', () => {
        expect(
          getDialogAttr({ backdropFilter: 'blur(4px)' }, 'backdropFilter')
        ).toBe('blur(4px)')
      })
    })

    describe('[(prop)maximized]', () => {
      test('type Boolean has effect', () => {
        expect(getDialogAttr({ maximized: true }, 'maximized')).toBe(true)
      })
    })

    describe('[(prop)full-width]', () => {
      test('type Boolean has effect', () => {
        expect(getDialogAttr({ fullWidth: true }, 'fullWidth')).toBe(true)
      })
    })

    describe('[(prop)full-height]', () => {
      test('type Boolean has effect', () => {
        expect(getDialogAttr({ fullHeight: true }, 'fullHeight')).toBe(true)
      })
    })

    describe('[(prop)position]', () => {
      function testPosition(value) {
        expect(getDialogAttr({ position: value }, 'position')).toBe(value)
      }

      test('value "standard" has effect', () => {
        testPosition('standard')
      })

      test('value "top" has effect', () => {
        testPosition('top')
      })

      test('value "right" has effect', () => {
        testPosition('right')
      })

      test('value "bottom" has effect', () => {
        testPosition('bottom')
      })

      test('value "left" has effect', () => {
        testPosition('left')
      })
    })

    describe('[(prop)no-shake]', () => {
      test('type Boolean has effect', () => {
        expect(getDialogAttr({ noShake: true }, 'noShake')).toBe(true)
      })
    })

    describe('[(prop)allow-focus-outside]', () => {
      test('type Boolean has effect', () => {
        expect(
          getDialogAttr({ allowFocusOutside: true }, 'allowFocusOutside')
        ).toBe(true)
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const wrapper = mountPopup(
          { modelValue: true },
          { slots: { default: () => 'Popup slot content' } }
        )

        expect(wrapper.text()).toContain('Popup slot content')
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', () => {
        const update = vi.fn()
        const wrapper = mountPopup({ 'onUpdate:modelValue': update })

        wrapper.vm.show()

        expect(update).toHaveBeenCalledWith(true)
      })
    })

    describe('[(event)before-show]', () => {
      test('is emitting', () => {
        const beforeShow = vi.fn()
        const wrapper = mountPopup({ onBeforeShow: beforeShow })
        const evt = new Event('click')

        wrapper.vm.show(evt)

        expect(beforeShow).toHaveBeenCalledWith(evt)
      })
    })

    describe('[(event)show]', () => {
      test('is emitting', () => {
        const wrapper = mountPopup()
        const evt = new Event('click')

        wrapper.vm.show(evt)

        expect(wrapper.emitted('show')).toStrictEqual([[evt]])
      })
    })

    describe('[(event)before-hide]', () => {
      test('is emitting', () => {
        const beforeHide = vi.fn()
        const wrapper = mountPopup({
          modelValue: true,
          onBeforeHide: beforeHide
        })
        const evt = new Event('click')

        wrapper.vm.hide(evt)

        expect(beforeHide).toHaveBeenCalledWith(evt)
      })
    })

    describe('[(event)hide]', () => {
      test('is emitting', () => {
        const wrapper = mountPopup({ modelValue: true })
        const evt = new Event('click')

        wrapper.vm.hide(evt)

        expect(wrapper.emitted('hide')).toStrictEqual([[evt]])
      })
    })

    describe('[(event)escape-key]', () => {
      test('is emitting', () => {
        const onEscapeKey = vi.fn()
        const wrapper = mountPopup({ onEscapeKey })

        wrapper.getComponent(QMenuStub).vm.$emit('escapeKey')

        expect(onEscapeKey).toHaveBeenCalledTimes(1)
      })
    })

    describe('[(event)shake]', () => {
      test('is emitting', () => {
        Screen.width = 400
        Screen.height = 400

        const onShake = vi.fn()
        const wrapper = mountPopup({ onShake })

        wrapper.getComponent(QDialogStub).vm.$emit('shake')

        expect(onShake).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)show]', () => {
      test('should be callable', async () => {
        const wrapper = mountPopup(
          {},
          { slots: { default: () => 'Popup content' } }
        )

        expect(wrapper.vm.show()).toBeUndefined()
        await nextTick()
        expect(wrapper.text()).toContain('Popup content')
      })
    })

    describe('[(method)hide]', () => {
      test('should be callable', async () => {
        const wrapper = mountPopup(
          { modelValue: true },
          { slots: { default: () => 'Popup content' } }
        )

        expect(wrapper.vm.hide()).toBeUndefined()
        await nextTick()
        expect(wrapper.text()).not.toContain('Popup content')
      })
    })

    describe('[(method)toggle]', () => {
      test('should be callable', async () => {
        const wrapper = mountPopup(
          {},
          { slots: { default: () => 'Popup content' } }
        )

        expect(wrapper.vm.toggle()).toBeUndefined()
        await nextTick()
        expect(wrapper.text()).toContain('Popup content')

        wrapper.vm.toggle()
        await nextTick()

        expect(wrapper.text()).not.toContain('Popup content')
      })
    })
  })

  describe('[Computed props]', () => {
    describe('[(computedProp)currentComponent]', () => {
      test('should be exposed', () => {
        const wrapper = mountPopup()

        expect(wrapper.vm.currentComponent).toEqual({
          type: 'menu',
          ref: expect.any(Object)
        })
      })
    })
  })
})
