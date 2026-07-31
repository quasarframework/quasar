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
    emits: ['beforeShow', 'show', 'beforeHide', 'hide', 'update:modelValue'],
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
