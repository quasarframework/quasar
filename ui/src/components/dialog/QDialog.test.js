import { flushPromises, mount } from '@vue/test-utils'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  onTestFinished,
  test,
  vi
} from 'vitest'

import { KeepAlive, defineComponent, h } from 'vue'
import { useRoute } from 'vue-router'

import QDialog from './QDialog.js'
import useFullscreen, {
  useFullscreenProps
} from '../../composables/private.use-fullscreen/use-fullscreen.js'
import { getRouter } from 'testing/runtime/router.js'
import { client } from '../../plugins/platform/Platform.js'
import DialogWrapper from './test/DialogWrapper.vue'

const FullscreenChild = defineComponent({
  name: 'FullscreenChild',
  props: useFullscreenProps,

  setup() {
    useFullscreen()

    return () =>
      h('section', null, [h('input', { 'data-test': 'fullscreen-input' })])
  }
})

let wrapper = null

beforeEach(() => {
  vi.useFakeTimers()

  if (wrapper !== null) {
    wrapper.unmount()
    wrapper = null
  }
})

afterEach(() => {
  vi.clearAllTimers()
  vi.restoreAllMocks()
})

async function triggerBackdropPress(localWrapper) {
  await localWrapper
    .findComponent({ name: 'QPortal' })
    .find('.q-dialog__backdrop')
    .trigger('mousedown')
}

async function triggerEscKey(localWrapper) {
  const portal = await localWrapper.findComponent({ name: 'QPortal' })
  await portal.trigger('keydown', { keyCode: 27 })
  await portal.trigger('keyup', { keyCode: 27 })
}

// iOS reports the soft keyboard only through the visual viewport: the
// layout viewport (innerHeight) keeps its size, the visual one shrinks
// and may scroll within it
function mockIosVisualViewport() {
  const originalIos = client.is.ios
  const mocked = []

  client.is.ios = true

  const restore = () => {
    client.is.ios = originalIos
    mocked.forEach(key => {
      delete window.visualViewport[key]
    })
  }

  const setViewport = async ({ offsetTop = 0, height, scale = 1 }) => {
    Object.entries({ offsetTop, height, scale }).forEach(([key, value]) => {
      Object.defineProperty(window.visualViewport, key, {
        configurable: true,
        value
      })
      mocked.push(key)
    })

    window.visualViewport.dispatchEvent(new Event('resize'))
    await flushPromises()
  }

  return { restore, setViewport }
}

async function getShownInner(props) {
  wrapper = mount(QDialog, {
    props: { modelValue: true, ...props },
    slots: { default: () => 'content' }
  })
  await flushPromises()

  return wrapper.findComponent({ name: 'QPortal' }).get('.q-dialog__inner')
}

function createFocusEl() {
  const el = document.createElement('div')
  el.setAttribute('tabindex', '0')
  document.body.append(el)

  onTestFinished(() => {
    el.remove()
  })

  return el
}

describe('[QDialog API]', () => {
  describe('[Props]', () => {
    describe('[(prop)transition-show]', () => {
      test('type String has effect', async () => {
        wrapper = mount(QDialog, {
          props: {
            modelValue: true,
            transitionShow: 'flip'
          }
        })

        await flushPromises()
        const content = wrapper.findComponent({ name: 'QPortal' })

        expect(
          content
            .get('transition-stub[enterfromclass]')
            .attributes('enterfromclass')
        ).toBe('q-transition--flip-enter-from')
      })
    })

    describe('[(prop)transition-hide]', () => {
      test('type String has effect', async () => {
        wrapper = mount(QDialog, {
          props: {
            modelValue: true,
            transitionHide: 'flip'
          }
        })

        await flushPromises()
        let content = wrapper.findComponent({ name: 'QPortal' })

        expect(
          content
            .get('transition-stub[enterfromclass]')
            .attributes('enterfromclass')
        ).toBe('q-transition--scale-enter-from')

        wrapper.vm.hide()
        await flushPromises()

        content = wrapper.findComponent({ name: 'QPortal' })

        expect(
          content
            .get('transition-stub[leavefromclass]')
            .attributes('leavefromclass')
        ).toBe('q-transition--flip-leave-from')
      })
    })

    describe('[(prop)transition-duration]', () => {
      test.each([
        ['String', '1000'],
        ['Number', 1000]
      ])('type %s has effect', async (_, propVal) => {
        const onShowFn = vi.fn()
        wrapper = mount(QDialog, {
          props: {
            modelValue: true,
            transitionDuration: propVal,
            onShow: onShowFn
          }
        })

        await flushPromises()
        expect(onShowFn).not.toHaveBeenCalled()

        vi.advanceTimersByTime(999)
        expect(onShowFn).not.toHaveBeenCalled()

        vi.advanceTimersByTime(1)
        expect(onShowFn).toHaveBeenCalledTimes(1)
      })
    })

    describe('[(prop)model-value]', () => {
      test('type Boolean has effect', async () => {
        wrapper = mount(QDialog, {
          props: {
            modelValue: false
          }
        })

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(false)

        await wrapper.setProps({ modelValue: true })
        await flushPromises()
        await vi.runAllTimers()

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(true)
      })
    })

    describe('[(prop)persistent]', () => {
      test.each([
        ['Backdrop press', triggerBackdropPress],
        ['ESC key', triggerEscKey]
      ])('handles %s correctly', async (_, trigger) => {
        wrapper = mount(QDialog, {
          props: {
            persistent: false
          }
        })

        wrapper.vm.show()
        await flushPromises()

        await trigger(wrapper)

        await flushPromises()
        await vi.runAllTimers()

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(false)

        await wrapper.setProps({ persistent: true })

        wrapper.vm.show()
        await flushPromises()
        await vi.runAllTimers()

        await trigger(wrapper)

        await flushPromises()
        await vi.runAllTimers()

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(true)
      })
    })

    describe('[(prop)no-esc-dismiss]', () => {
      test('type Boolean has effect', async () => {
        wrapper = mount(QDialog, {
          props: {
            noEscDismiss: false
          }
        })

        wrapper.vm.show()
        await flushPromises()

        await triggerEscKey(wrapper)

        await flushPromises()
        await vi.runAllTimers()

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(false)

        await wrapper.setProps({ noEscDismiss: true })

        wrapper.vm.show()
        await flushPromises()
        await vi.runAllTimers()

        await triggerEscKey(wrapper)

        await flushPromises()
        await vi.runAllTimers()

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(true)
      })
    })

    describe('[(prop)no-backdrop-dismiss]', () => {
      test('type Boolean has effect', async () => {
        wrapper = mount(QDialog, {
          props: {
            noBackdropDismiss: false
          }
        })

        wrapper.vm.show()
        await flushPromises()

        await triggerBackdropPress(wrapper)

        await flushPromises()
        await vi.runAllTimers()

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(false)

        await wrapper.setProps({ noBackdropDismiss: true })

        wrapper.vm.show()
        await flushPromises()
        await vi.runAllTimers()

        await triggerBackdropPress(wrapper)

        await flushPromises()
        await vi.runAllTimers()

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(true)
      })
    })

    describe('[(prop)no-route-dismiss]', () => {
      test('type Boolean has effect', async () => {
        const router = await getRouter(['/home', '/account'])

        wrapper = mount(QDialog, {
          props: {
            noRouteDismiss: true
          },
          global: {
            plugins: [router]
          }
        })

        wrapper.vm.show()
        await flushPromises()
        await vi.runAllTimers()

        await router.push('/home')
        await flushPromises()
        await vi.runAllTimers()

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(true)

        await wrapper.setProps({ noRouteDismiss: false })
        await flushPromises()

        await router.push('/account')
        await flushPromises()
        await vi.runAllTimers()

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(false)
      })
    })

    describe('[(prop)auto-close]', () => {
      test('type Boolean has effect', async () => {
        wrapper = mount(DialogWrapper, {
          props: {
            autoClose: false
          }
        })

        wrapper.findComponent({ name: 'QDialog' }).vm.show()

        await flushPromises()

        await wrapper.findComponent({ name: 'QBtn' }).trigger('click')

        await flushPromises()
        await vi.runAllTimers()

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(true)

        await wrapper.setProps({ autoClose: true })

        wrapper.findComponent({ name: 'QDialog' }).vm.show()

        await flushPromises()
        await vi.runAllTimers()

        await wrapper.findComponent({ name: 'QBtn' }).trigger('click')

        await flushPromises()
        await vi.runAllTimers()

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(false)
      })
    })

    describe('[(prop)seamless]', () => {
      test('type Boolean has effect', async () => {
        wrapper = mount(QDialog, {
          props: {
            modelValue: true,
            seamless: true
          }
        })

        await flushPromises()
        await vi.runAllTimers()

        expect(
          wrapper.findComponent({ name: 'QPortal' }).get('.q-dialog').classes()
        ).toContain('q-dialog--seamless')

        await wrapper.setProps({ seamless: false })
        await flushPromises()

        expect(
          wrapper.findComponent({ name: 'QPortal' }).get('.q-dialog').classes()
        ).not.toContain('q-dialog--seamless')
      })
    })

    describe('[(prop)backdrop-filter]', () => {
      test('type String has effect', async () => {
        const propVal = 'blur(4px)'
        wrapper = mount(QDialog, {
          props: {
            modelValue: true,
            backdropFilter: propVal
          }
        })

        await flushPromises()
        await vi.runAllTimers()

        expect(
          wrapper
            .findComponent({ name: 'QPortal' })
            .get('.q-dialog__backdrop')
            .$style('backdrop-filter')
        ).toBe(propVal)

        await wrapper.setProps({ backdropFilter: void 0 })
        await flushPromises()

        // the inline style entry is removed, so the browser reports an empty value
        expect(
          wrapper
            .findComponent({ name: 'QPortal' })
            .get('.q-dialog__backdrop')
            .$style('backdrop-filter')
        ).toBe('')
      })
    })

    describe('[(prop)maximized]', () => {
      test('type Boolean has effect', async () => {
        wrapper = mount(QDialog, {
          props: {
            modelValue: true,
            maximized: true
          }
        })

        await flushPromises()
        await vi.runAllTimers()

        expect(
          wrapper
            .findComponent({ name: 'QPortal' })
            .get('.q-dialog__inner')
            .classes()
        ).toContain('q-dialog__inner--maximized')

        await wrapper.setProps({ maximized: false })
        await flushPromises()

        expect(
          wrapper
            .findComponent({ name: 'QPortal' })
            .get('.q-dialog__inner')
            .classes()
        ).not.toContain('q-dialog__inner--maximized')
      })
    })

    describe('[(prop)full-width]', () => {
      test('type Boolean has effect', async () => {
        wrapper = mount(QDialog, {
          props: {
            modelValue: true,
            fullWidth: true
          }
        })

        await flushPromises()
        await vi.runAllTimers()

        expect(
          wrapper
            .findComponent({ name: 'QPortal' })
            .get('.q-dialog__inner')
            .classes()
        ).toContain('q-dialog__inner--fullwidth')

        await wrapper.setProps({ fullWidth: false })
        await flushPromises()

        expect(
          wrapper
            .findComponent({ name: 'QPortal' })
            .get('.q-dialog__inner')
            .classes()
        ).not.toContain('q-dialog__inner--fullwidth')
      })
    })

    describe('[(prop)full-height]', () => {
      test('type Boolean has effect', async () => {
        wrapper = mount(QDialog, {
          props: {
            modelValue: true,
            fullHeight: true
          }
        })

        await flushPromises()
        await vi.runAllTimers()

        expect(
          wrapper
            .findComponent({ name: 'QPortal' })
            .get('.q-dialog__inner')
            .classes()
        ).toContain('q-dialog__inner--fullheight')

        await wrapper.setProps({ fullHeight: false })
        await flushPromises()

        expect(
          wrapper
            .findComponent({ name: 'QPortal' })
            .get('.q-dialog__inner')
            .classes()
        ).not.toContain('q-dialog__inner--fullheight')
      })
    })

    describe('[(prop)position]', () => {
      test('type String has effect', async () => {
        wrapper = mount(QDialog, {
          props: {
            modelValue: true
          }
        })

        await flushPromises()
        await vi.runAllTimers()

        const positionList = ['top', 'right', 'bottom', 'left']
        const target = wrapper
          .findComponent({ name: 'QPortal' })
          .get('.q-dialog__inner')

        for (const position of positionList) {
          await wrapper.setProps({ position })
          await flushPromises()

          const cls = target.classes()
          expect(cls).toContain(`q-dialog__inner--${position}`)
          expect(cls).toContain(`fixed-${position}`)
        }
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', async () => {
        wrapper = mount(DialogWrapper, {
          props: {
            modelValue: true,
            square: true
          }
        })

        await flushPromises()
        await vi.runAllTimers()

        expect(
          wrapper
            .findComponent({ name: 'QCard' })
            .get('.q-card')
            .$computedStyle('border-radius')
        ).toBe('0px')

        await wrapper.setProps({ square: false })
        await flushPromises()

        expect(
          wrapper
            .findComponent({ name: 'QCard' })
            .get('.q-card')
            .$computedStyle('border-radius')
        ).not.toBe('0px')
      })
    })

    describe('[(prop)no-refocus]', () => {
      test('type Boolean has effect', async () => {
        const el = createFocusEl()

        el.focus()

        wrapper = mount(QDialog)

        wrapper.findComponent({ name: 'QDialog' }).vm.show()

        await flushPromises()
        await vi.runAllTimers()

        expect(document.activeElement).not.toBe(el)

        wrapper.findComponent({ name: 'QDialog' }).vm.hide()

        await flushPromises()
        await vi.runAllTimers()

        expect(document.activeElement).toBe(el)

        await wrapper.setProps({ noRefocus: true })

        wrapper.findComponent({ name: 'QDialog' }).vm.show()

        await flushPromises()
        await vi.runAllTimers()

        wrapper.findComponent({ name: 'QDialog' }).vm.hide()

        await flushPromises()
        await vi.runAllTimers()

        expect(document.activeElement).not.toBe(el)
      })

      test('refocuses without scrolling the target into view', async () => {
        const el = createFocusEl()

        el.focus()

        const focusSpy = vi.spyOn(el, 'focus')

        wrapper = mount(QDialog)

        wrapper.findComponent({ name: 'QDialog' }).vm.show()

        await flushPromises()
        await vi.runAllTimers()

        wrapper.findComponent({ name: 'QDialog' }).vm.hide()

        await flushPromises()
        await vi.runAllTimers()

        expect(document.activeElement).toBe(el)
        expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true })
      })
    })

    describe('[(prop)no-focus]', () => {
      test('type Boolean has effect', async () => {
        const el = createFocusEl()

        el.focus()

        wrapper = mount(QDialog)

        wrapper.findComponent({ name: 'QDialog' }).vm.show()

        await flushPromises()
        await vi.runAllTimers()

        expect(document.activeElement).not.toBe(el)

        wrapper.findComponent({ name: 'QDialog' }).vm.hide()

        await flushPromises()
        await vi.runAllTimers()

        expect(document.activeElement).toBe(el)

        await wrapper.setProps({ noFocus: true })

        wrapper.findComponent({ name: 'QDialog' }).vm.show()

        await flushPromises()
        await vi.runAllTimers()

        expect(document.activeElement).toBe(el)
      })
    })

    describe('[(prop)no-shake]', () => {
      test('type Boolean has effect', async () => {
        wrapper = mount(QDialog, {
          props: {
            modelValue: true,
            noShake: true,
            persistent: true
          }
        })

        await flushPromises()
        await vi.runAllTimers()

        await triggerBackdropPress(wrapper)

        await flushPromises()

        expect(
          wrapper
            .findComponent({ name: 'QPortal' })
            .get('.q-dialog__inner')
            .classes()
        ).not.toContain('q-animate--scale')

        await wrapper.setProps({ noShake: false })
        await flushPromises()

        await triggerBackdropPress(wrapper)

        expect(
          wrapper
            .findComponent({ name: 'QPortal' })
            .get('.q-dialog__inner')
            .classes()
        ).toContain('q-animate--scale')
      })
    })

    describe('[(prop)allow-focus-outside]', () => {
      test('type Boolean has effect', async () => {
        const el = createFocusEl()

        wrapper = mount(QDialog, {
          props: {
            modelValue: true,
            allowFocusOutside: false
          }
        })

        await flushPromises()
        await vi.runAllTimers()

        el.focus()

        await flushPromises()

        expect(document.activeElement).not.toBe(el)

        await wrapper.setProps({ allowFocusOutside: true })
        await flushPromises()

        el.focus()

        await flushPromises()
        await vi.runAllTimers()

        expect(document.activeElement).toBe(el)
      })

      test('keeps trapping while a fullscreen child is detached', async () => {
        const outsideEl = createFocusEl()

        wrapper = mount(QDialog, {
          props: {
            modelValue: true,
            allowFocusOutside: false
          },
          slots: { default: () => h(FullscreenChild, { fullscreen: true }) }
        })

        await flushPromises()
        await vi.runAllTimers()

        const el = document.body.querySelector('[data-test="fullscreen-input"]')

        // useFullscreen() has moved the child out of the dialog
        expect(el.closest('.q-dialog__inner')).toBeNull()

        el.focus()

        await flushPromises()
        await vi.runAllTimers()

        // ...yet it still belongs to the dialog, so it keeps the focus
        expect(document.activeElement).toBe(el)

        outsideEl.focus()

        await flushPromises()
        await vi.runAllTimers()

        // ...while focus that is genuinely outside is still pulled back
        expect(document.activeElement).not.toBe(outsideEl)
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', async () => {
        const slotContent = 'some-slot-content'
        wrapper = mount(QDialog, {
          props: {
            modelValue: true
          },
          slots: {
            default: () => slotContent
          }
        })

        await flushPromises()
        await vi.runAllTimers()

        expect(wrapper.findComponent({ name: 'QPortal' }).html()).toContain(
          slotContent
        )
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        wrapper = mount(QDialog, {
          props: {
            modelValue: false,
            'onUpdate:modelValue': val => {
              wrapper.setProps({ modelValue: val })
            }
          }
        })

        await flushPromises()
        await vi.runAllTimers()

        wrapper.findComponent({ name: 'QDialog' }).vm.show()

        await flushPromises()
        await vi.runAllTimers()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:modelValue')
        expect(eventList['update:modelValue']).toHaveLength(1)

        const [value] = eventList['update:modelValue'][0]
        expect(value).toBeTypeOf('boolean')
      })
    })

    describe('[(event)show]', () => {
      test('is emitting', async () => {
        wrapper = mount(QDialog)
        const event = new MouseEvent('click')

        await flushPromises()
        await vi.runAllTimers()

        wrapper.findComponent({ name: 'QDialog' }).vm.show(event)

        await flushPromises()
        await vi.runAllTimers()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('show')
        expect(eventList.show).toHaveLength(1)

        const [evt] = eventList.show[0]
        expect(evt).toBe(evt)
      })
    })

    describe('[(event)before-show]', () => {
      test('is emitting', async () => {
        wrapper = mount(QDialog)
        const event = new MouseEvent('click')

        await flushPromises()
        await vi.runAllTimers()

        wrapper.findComponent({ name: 'QDialog' }).vm.show(event)

        await flushPromises()
        await vi.runAllTimers()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('beforeShow')
        expect(eventList.beforeShow).toHaveLength(1)

        const [evt] = eventList.beforeShow[0]
        expect(evt).toBe(event)
      })
    })

    describe('[(event)hide]', () => {
      test('is emitting', async () => {
        wrapper = mount(QDialog, {
          props: {
            modelValue: true,
            'onUpdate:modelValue': val => {
              wrapper.setProps({ modelValue: val })
            }
          }
        })
        const event = new MouseEvent('click')

        await flushPromises()
        await vi.runAllTimers()

        wrapper.findComponent({ name: 'QDialog' }).vm.hide(event)

        await flushPromises()
        await vi.runAllTimers()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('hide')
        expect(eventList.hide).toHaveLength(1)

        const [evt] = eventList.hide[0]
        expect(evt).toBe(event)
      })

      test('receives the keyup event when dismissed through ESC key', async () => {
        wrapper = mount(QDialog, {
          props: {
            modelValue: true,
            'onUpdate:modelValue': val => {
              wrapper.setProps({ modelValue: val })
            }
          }
        })

        await flushPromises()
        await vi.runAllTimers()

        await triggerEscKey(wrapper)

        await flushPromises()
        await vi.runAllTimers()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('hide')
        expect(eventList.hide).toHaveLength(1)

        const [evt] = eventList.hide[0]
        expect(evt.type).toBe('keyup')
        expect(evt.keyCode).toBe(27)
      })
    })

    describe('[(event)before-hide]', () => {
      test('is emitting', async () => {
        wrapper = mount(QDialog, {
          props: {
            modelValue: true,
            'onUpdate:modelValue': val => {
              wrapper.setProps({ modelValue: val })
            }
          }
        })
        const event = new MouseEvent('click')

        await flushPromises()
        await vi.runAllTimers()

        wrapper.findComponent({ name: 'QDialog' }).vm.hide(event)

        await flushPromises()
        await vi.runAllTimers()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('beforeHide')
        expect(eventList.beforeHide).toHaveLength(1)

        const [evt] = eventList.beforeHide[0]
        expect(evt).toBe(event)
      })
    })

    describe('[(event)shake]', () => {
      test('is emitting', async () => {
        wrapper = mount(QDialog, {
          props: {
            modelValue: true,
            persistent: true
          }
        })

        await flushPromises()
        await vi.runAllTimers()

        await triggerEscKey(wrapper)

        expect(
          wrapper
            .findComponent({ name: 'QPortal' })
            .get('.q-dialog__inner')
            .classes()
        ).toContain('q-animate--scale')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('shake')
        expect(eventList.shake).toHaveLength(1)

        expect(eventList.shake[0]).toHaveLength(0)
      })
    })

    describe('[(event)escape-key]', () => {
      test('is emitting', async () => {
        wrapper = mount(QDialog, {
          props: {
            modelValue: true
          }
        })

        await flushPromises()
        await vi.runAllTimers()

        await triggerEscKey(wrapper)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('escapeKey')
        expect(eventList.escapeKey).toHaveLength(1)

        expect(eventList.escapeKey[0]).toHaveLength(0)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)show]', () => {
      test('should be callable', async () => {
        wrapper = mount(QDialog)

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(false)

        expect(wrapper.vm.show()).toBeUndefined()

        await flushPromises()
        await vi.runAllTimers()

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(true)
      })
    })

    describe('[(method)hide]', () => {
      test('should be callable', async () => {
        wrapper = mount(QDialog, {
          props: {
            modelValue: true
          }
        })

        await flushPromises()
        await vi.runAllTimers()

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(true)

        expect(wrapper.vm.hide()).toBeUndefined()

        await flushPromises()
        await vi.runAllTimers()

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(false)
      })
    })

    describe('[(method)toggle]', () => {
      test('should be callable', async () => {
        wrapper = mount(QDialog, {
          props: {
            modelValue: true
          }
        })

        await flushPromises()
        await vi.runAllTimers()

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(true)

        expect(wrapper.vm.toggle()).toBeUndefined()

        await flushPromises()
        await vi.runAllTimers()

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(false)

        expect(wrapper.vm.toggle()).toBeUndefined()

        await flushPromises()
        await vi.runAllTimers()

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(true)
      })
    })

    describe('[(method)focus]', () => {
      test('should focus with a selector', async () => {
        wrapper = mount(DialogWrapper, {
          props: {
            modelValue: true
          }
        })

        await flushPromises()
        await vi.runAllTimers()

        expect(
          wrapper.findComponent({ name: 'QDialog' }).vm.focus('.q-btn')
        ).toBeUndefined()

        await flushPromises()

        expect(document.activeElement).toBe(
          wrapper.findComponent({ name: 'QBtn' }).element
        )
      })

      test('should focus without a selector', async () => {
        wrapper = mount(DialogWrapper, {
          props: {
            modelValue: true
          }
        })

        await flushPromises()
        await vi.runAllTimers()

        expect(
          wrapper.findComponent({ name: 'QDialog' }).vm.focus()
        ).toBeUndefined()

        await flushPromises()

        expect(document.activeElement).toBe(
          wrapper.findComponent({ name: 'QPortal' }).get('.q-dialog__inner')
            .element
        )
      })
    })

    describe('[(method)shake]', () => {
      test('should be callable', async () => {
        wrapper = mount(QDialog, {
          props: {
            modelValue: true
          }
        })

        await flushPromises()
        await vi.runAllTimers()

        wrapper.findComponent({ name: 'QDialog' }).vm.shake()

        expect(
          wrapper
            .findComponent({ name: 'QPortal' })
            .get('.q-dialog__inner')
            .classes()
        ).toContain('q-animate--scale')
      })
    })
  })

  describe('[Computed props]', () => {
    describe('[(computedProp)contentEl]', () => {
      test('should be exposed', async () => {
        wrapper = mount(QDialog, {
          props: {
            modelValue: true
          }
        })

        await flushPromises()
        await vi.runAllTimers()

        expect(wrapper.vm.contentEl).toBeInstanceOf(Element)
      })
    })
  })

  describe('[Generic]', () => {
    test('applies dynamic class changes to the inner root element', async () => {
      wrapper = mount(QDialog, {
        props: { modelValue: true, class: 'my-class-a' },
        slots: { default: () => 'content' }
      })
      await flushPromises()

      const root = wrapper.findComponent({ name: 'QPortal' }).get('.q-dialog')

      expect(root.classes()).toContain('my-class-a')

      // attrs is not reactive, so the class must reach the element
      // through the render path - a computed would go stale here
      await wrapper.setProps({ class: 'my-class-b' })

      expect(root.classes()).toContain('my-class-b')
      expect(root.classes()).not.toContain('my-class-a')
    })

    test('ignores non-primary button presses on the backdrop', async () => {
      wrapper = mount(QDialog)

      wrapper.vm.show()
      await flushPromises()

      const portal = wrapper.findComponent({ name: 'QPortal' })

      // MouseEvent.button is read-only, so trigger() cannot set it
      const rightPress = () =>
        portal
          .get('.q-dialog__backdrop')
          .element.dispatchEvent(
            new MouseEvent('mousedown', { button: 2, bubbles: true })
          )

      rightPress()
      await flushPromises()
      await vi.runAllTimers()

      expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(true)

      await wrapper.setProps({ persistent: true })

      rightPress()
      await flushPromises()

      expect(portal.get('.q-dialog__inner').classes()).not.toContain(
        'q-animate--scale'
      )
      expect(wrapper.emitted()).not.toHaveProperty('shake')
    })

    describe('iOS soft keyboard', () => {
      const KEYBOARD_HEIGHT = 300
      const REVEAL_SCROLL = 40

      test.each([
        [
          'standard',
          { top: `${REVEAL_SCROLL}px`, bottom: `${KEYBOARD_HEIGHT}px` }
        ],
        ['left', { top: `${REVEAL_SCROLL}px`, bottom: `${KEYBOARD_HEIGHT}px` }],
        ['top', { top: `${REVEAL_SCROLL}px`, bottom: '' }],
        ['bottom', { top: '', bottom: `${KEYBOARD_HEIGHT}px` }]
      ])(
        'keeps a "%s" dialog inside the visual viewport while the keyboard is open',
        async (position, expected) => {
          const { restore, setViewport } = mockIosVisualViewport()

          try {
            const inner = await getShownInner({ position })
            const visibleHeight =
              window.innerHeight - KEYBOARD_HEIGHT - REVEAL_SCROLL

            expect(inner.classes()).not.toContain('q-dialog__inner--keyboard')

            // the keyboard opens and iOS scrolls the visual viewport a bit
            await setViewport({
              offsetTop: REVEAL_SCROLL,
              height: visibleHeight
            })

            expect(inner.classes()).toContain('q-dialog__inner--keyboard')
            expect(inner.element.style.top).toBe(expected.top)
            expect(inner.element.style.bottom).toBe(expected.bottom)
            expect(
              inner.element.style.getPropertyValue('--q-dialog-viewport-height')
            ).toBe(`${visibleHeight}px`)

            // the keyboard closes
            await setViewport({ height: window.innerHeight })

            expect(inner.classes()).not.toContain('q-dialog__inner--keyboard')
            expect(inner.element.style.top).toBe('')
            expect(inner.element.style.bottom).toBe('')
            expect(
              inner.element.style.getPropertyValue('--q-dialog-viewport-height')
            ).toBe('')
          } finally {
            restore()
          }
        }
      )

      test('leaves a pinch-zoomed dialog alone', async () => {
        const { restore, setViewport } = mockIosVisualViewport()

        try {
          const inner = await getShownInner()

          await setViewport({
            offsetTop: REVEAL_SCROLL,
            height: window.innerHeight / 2,
            scale: 2
          })

          expect(inner.classes()).not.toContain('q-dialog__inner--keyboard')
          expect(inner.element.style.top).toBe('')
          expect(inner.element.style.bottom).toBe('')
        } finally {
          restore()
        }
      })

      test('stops following the visual viewport once hidden and picks up an already open keyboard when shown', async () => {
        const { restore, setViewport } = mockIosVisualViewport()
        const removeSpy = vi.spyOn(window.visualViewport, 'removeEventListener')

        try {
          await getShownInner({ position: 'bottom' })

          await wrapper.setProps({ modelValue: false })
          await flushPromises()

          for (const evt of ['scroll', 'resize']) {
            expect(removeSpy).toHaveBeenCalledWith(
              evt,
              expect.any(Function),
              expect.anything()
            )
          }

          await setViewport({ height: window.innerHeight - KEYBOARD_HEIGHT })

          await wrapper.setProps({ modelValue: true })
          await flushPromises()

          const inner = wrapper
            .findComponent({ name: 'QPortal' })
            .get('.q-dialog__inner')

          expect(inner.classes()).toContain('q-dialog__inner--keyboard')
          expect(inner.element.style.bottom).toBe(`${KEYBOARD_HEIGHT}px`)
        } finally {
          restore()
        }
      })

      test('does not track the visual viewport off iOS', async () => {
        const { restore, setViewport } = mockIosVisualViewport()
        client.is.ios = false

        try {
          const inner = await getShownInner({ position: 'bottom' })

          await setViewport({ height: window.innerHeight - KEYBOARD_HEIGHT })

          expect(inner.classes()).not.toContain('q-dialog__inner--keyboard')
          expect(inner.element.style.bottom).toBe('')
        } finally {
          restore()
        }
      })
    })

    test('finishes a pending hide when its keep-alive page deactivates', async () => {
      const router = await getRouter(['/home', '/account'])
      const onHide = vi.fn()
      const getPortalEl = () =>
        document.body.querySelector('[id^="q-portal--dialog"]')

      const KeptAlivePage = defineComponent({
        name: 'KeptAlivePage',
        setup() {
          return () => h(QDialog, { modelValue: true, onHide }, () => 'content')
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

      wrapper = mount(Host, {
        global: {
          plugins: [router]
        }
      })
      await flushPromises()
      await vi.runAllTimers()

      expect(getPortalEl()).not.toBe(null)

      // routing away hides the dialog and deactivates the page holding it
      // within the same tick, which cancels the hide transition's timer
      await router.push('/account')
      await flushPromises()
      await vi.runAllTimers()

      expect(onHide).toHaveBeenCalledTimes(1)
      expect(getPortalEl()).toBe(null)
    })
  })
})
