/**
 * Ignored specs:
 * [(prop)backdrop-filter]
 */

import { mount, flushPromises } from '@vue/test-utils'
import {
  describe, test, expect, vi,
  beforeEach, afterEach, onTestFinished
} from 'vitest'

import QDialog from './QDialog.js'
import { getRouter } from 'testing/runtime/router.js'
import DialogWrapper from './test/DialogWrapper.vue'

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

async function triggerBackdropClick (wrapper) {
  await wrapper.findComponent({ name: 'QPortal' })
    .find('.q-dialog__backdrop')
    .trigger('click')
}

async function triggerEscKey (wrapper) {
  const portal = await wrapper.findComponent({ name: 'QPortal' })
  await portal.trigger('keydown', { keyCode: 27 })
  await portal.trigger('keyup', { keyCode: 27 })
}

function createFocusEl () {
  const el = document.createElement('div')
  el.setAttribute('tabindex', '0')
  document.body.appendChild(el)

  onTestFinished(() => { el.remove() })

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
          content.get('transition-stub[enterfromclass]')
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
          content.get('transition-stub[enterfromclass]')
            .attributes('enterfromclass')
        ).toBe('q-transition--scale-enter-from')

        wrapper.vm.hide()
        await flushPromises()

        content = wrapper.findComponent({ name: 'QPortal' })

        expect(
          content.get('transition-stub[leavefromclass]')
            .attributes('leavefromclass')
        ).toBe('q-transition--flip-leave-from')
      })
    })

    describe('[(prop)transition-duration]', () => {
      test.each([
        [ 'String', '1000' ],
        [ 'Number', 1000 ]
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

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .exists()
        ).toBe(false)

        await wrapper.setProps({ modelValue: true })
        await flushPromises()
        await vi.runAllTimers()

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .exists()
        ).toBe(true)
      })
    })

    describe('[(prop)persistent]', () => {
      test.each([
        [ 'Backdrop click', triggerBackdropClick ],
        [ 'ESC key', triggerEscKey ]
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

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .exists()
        ).toBe(false)

        await wrapper.setProps({ persistent: true })

        wrapper.vm.show()
        await flushPromises()
        await vi.runAllTimers()

        await trigger(wrapper)

        await flushPromises()
        await vi.runAllTimers()

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .exists()
        ).toBe(true)
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

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .exists()
        ).toBe(false)

        await wrapper.setProps({ noEscDismiss: true })

        wrapper.vm.show()
        await flushPromises()
        await vi.runAllTimers()

        await triggerEscKey(wrapper)

        await flushPromises()
        await vi.runAllTimers()

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .exists()
        ).toBe(true)
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

        await triggerBackdropClick(wrapper)

        await flushPromises()
        await vi.runAllTimers()

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .exists()
        ).toBe(false)

        await wrapper.setProps({ noBackdropDismiss: true })

        wrapper.vm.show()
        await flushPromises()
        await vi.runAllTimers()

        await triggerBackdropClick(wrapper)

        await flushPromises()
        await vi.runAllTimers()

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .exists()
        ).toBe(true)
      })
    })

    describe('[(prop)no-route-dismiss]', () => {
      test('type Boolean has effect', async () => {
        const router = await getRouter([ '/home', '/account' ])

        wrapper = mount(QDialog, {
          props: {
            noRouteDismiss: true
          },
          global: {
            plugins: [ router ]
          }
        })

        wrapper.vm.show()
        await flushPromises()
        await vi.runAllTimers()

        await router.push('/home')
        await flushPromises()
        await vi.runAllTimers()

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .exists()
        ).toBe(true)

        await wrapper.setProps({ noRouteDismiss: false })
        await flushPromises()

        await router.push('/account')
        await flushPromises()
        await vi.runAllTimers()

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .exists()
        ).toBe(false)
      })
    })

    describe('[(prop)auto-close]', () => {
      test('type Boolean has effect', async () => {
        wrapper = mount(DialogWrapper, {
          props: {
            autoClose: false
          }
        })

        wrapper.findComponent({ name: 'QDialog' })
          .vm.show()

        await flushPromises()

        await wrapper.findComponent({ name: 'QBtn' })
          .trigger('click')

        await flushPromises()
        await vi.runAllTimers()

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .exists()
        ).toBe(true)

        await wrapper.setProps({ autoClose: true })

        wrapper.findComponent({ name: 'QDialog' })
          .vm.show()

        await flushPromises()
        await vi.runAllTimers()

        await wrapper.findComponent({ name: 'QBtn' })
          .trigger('click')

        await flushPromises()
        await vi.runAllTimers()

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .exists()
        ).toBe(false)
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
          wrapper.findComponent({ name: 'QPortal' })
            .get('.q-dialog')
            .classes()
        ).toContain('q-dialog--seamless')

        await wrapper.setProps({ seamless: false })
        await flushPromises()

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .get('.q-dialog')
            .classes()
        ).not.toContain('q-dialog--seamless')
      })
    })

    /**
     * Commented because jsdom doesn't understand backdrop-filter
     *
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
              wrapper.findComponent({ name: 'QPortal' })
                .get('.q-dialog__backdrop')
                .$style('backdrop-filter')
            ).toBe(propVal)

            await wrapper.setProps({ backdropFilter: void 0 })
            await flushPromises()

            expect(
              wrapper.findComponent({ name: 'QPortal' })
                .get('.q-dialog__backdrop')
                .$style('backdrop-filter')
            ).toBeUndefined()
          })
        })
    */

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
          wrapper.findComponent({ name: 'QPortal' })
            .get('.q-dialog__inner')
            .classes()
        ).toContain('q-dialog__inner--maximized')

        await wrapper.setProps({ maximized: false })
        await flushPromises()

        expect(
          wrapper.findComponent({ name: 'QPortal' })
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
          wrapper.findComponent({ name: 'QPortal' })
            .get('.q-dialog__inner')
            .classes()
        ).toContain('q-dialog__inner--fullwidth')

        await wrapper.setProps({ fullWidth: false })
        await flushPromises()

        expect(
          wrapper.findComponent({ name: 'QPortal' })
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
          wrapper.findComponent({ name: 'QPortal' })
            .get('.q-dialog__inner')
            .classes()
        ).toContain('q-dialog__inner--fullheight')

        await wrapper.setProps({ fullHeight: false })
        await flushPromises()

        expect(
          wrapper.findComponent({ name: 'QPortal' })
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

        const positionList = [ 'top', 'right', 'bottom', 'left' ]
        const target = wrapper.findComponent({ name: 'QPortal' })
          .get('.q-dialog__inner')

        for (const position of positionList) {
          await wrapper.setProps({ position })
          await flushPromises()

          const cls = target.classes()
          expect(cls).toContain(`q-dialog__inner--${ position }`)
          expect(cls).toContain(`fixed-${ position }`)
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
        ).toBe('0')

        await wrapper.setProps({ square: false })
        await flushPromises()

        expect(
          wrapper
            .findComponent({ name: 'QCard' })
            .get('.q-card')
            .$computedStyle('border-radius')
        ).not.toBe('0')
      })
    })

    describe('[(prop)no-refocus]', () => {
      test('type Boolean has effect', async () => {
        const el = createFocusEl()

        el.focus()

        wrapper = mount(QDialog)

        wrapper.findComponent({ name: 'QDialog' })
          .vm.show()

        await flushPromises()
        await vi.runAllTimers()

        expect(
          document.activeElement
        ).not.toBe(
          el
        )

        wrapper.findComponent({ name: 'QDialog' })
          .vm.hide()

        await flushPromises()
        await vi.runAllTimers()

        expect(
          document.activeElement
        ).toBe(
          el
        )

        await wrapper.setProps({ noRefocus: true })

        wrapper.findComponent({ name: 'QDialog' })
          .vm.show()

        await flushPromises()
        await vi.runAllTimers()

        wrapper.findComponent({ name: 'QDialog' })
          .vm.hide()

        await flushPromises()
        await vi.runAllTimers()

        expect(
          document.activeElement
        ).not.toBe(
          el
        )
      })
    })

    describe('[(prop)no-focus]', () => {
      test('type Boolean has effect', async () => {
        const el = createFocusEl()

        el.focus()

        wrapper = mount(QDialog)

        wrapper.findComponent({ name: 'QDialog' })
          .vm.show()

        await flushPromises()
        await vi.runAllTimers()

        expect(
          document.activeElement
        ).not.toBe(
          el
        )

        wrapper.findComponent({ name: 'QDialog' })
          .vm.hide()

        await flushPromises()
        await vi.runAllTimers()

        expect(
          document.activeElement
        ).toBe(
          el
        )

        await wrapper.setProps({ noFocus: true })

        wrapper.findComponent({ name: 'QDialog' })
          .vm.show()

        await flushPromises()
        await vi.runAllTimers()

        expect(
          document.activeElement
        ).toBe(
          el
        )
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

        await triggerBackdropClick(wrapper)

        await flushPromises()

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .get('.q-dialog__inner')
            .classes()
        ).not.toContain('q-animate--scale')

        await wrapper.setProps({ noShake: false })
        await flushPromises()

        await triggerBackdropClick(wrapper)

        expect(
          wrapper.findComponent({ name: 'QPortal' })
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

        expect(
          document.activeElement
        ).not.toBe(
          el
        )

        await wrapper.setProps({ allowFocusOutside: true })
        await flushPromises()

        el.focus()

        await flushPromises()
        await vi.runAllTimers()

        expect(
          document.activeElement
        ).toBe(
          el
        )
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

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .html()
        ).toContain(slotContent)
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

        wrapper.findComponent({ name: 'QDialog' })
          .vm.show()

        await flushPromises()
        await vi.runAllTimers()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:modelValue')
        expect(eventList[ 'update:modelValue' ]).toHaveLength(1)

        const [ value ] = eventList[ 'update:modelValue' ][ 0 ]
        expect(value).toBeTypeOf('boolean')
      })
    })

    describe('[(event)show]', () => {
      test('is emitting', async () => {
        wrapper = mount(QDialog)
        const event = new MouseEvent('click')

        await flushPromises()
        await vi.runAllTimers()

        wrapper.findComponent({ name: 'QDialog' })
          .vm.show(event)

        await flushPromises()
        await vi.runAllTimers()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('show')
        expect(eventList.show).toHaveLength(1)

        const [ evt ] = eventList.show[ 0 ]
        expect(evt).toBe(evt)
      })
    })

    describe('[(event)before-show]', () => {
      test('is emitting', async () => {
        wrapper = mount(QDialog)
        const event = new MouseEvent('click')

        await flushPromises()
        await vi.runAllTimers()

        wrapper.findComponent({ name: 'QDialog' })
          .vm.show(event)

        await flushPromises()
        await vi.runAllTimers()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('beforeShow')
        expect(eventList.beforeShow).toHaveLength(1)

        const [ evt ] = eventList.beforeShow[ 0 ]
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

        wrapper.findComponent({ name: 'QDialog' })
          .vm.hide(event)

        await flushPromises()
        await vi.runAllTimers()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('hide')
        expect(eventList.hide).toHaveLength(1)

        const [ evt ] = eventList.hide[ 0 ]
        expect(evt).toBe(event)
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

        wrapper.findComponent({ name: 'QDialog' })
          .vm.hide(event)

        await flushPromises()
        await vi.runAllTimers()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('beforeHide')
        expect(eventList.beforeHide).toHaveLength(1)

        const [ evt ] = eventList.beforeHide[ 0 ]
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
          wrapper.findComponent({ name: 'QPortal' })
            .get('.q-dialog__inner')
            .classes()
        ).toContain('q-animate--scale')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('shake')
        expect(eventList.shake).toHaveLength(1)

        expect(eventList.shake[ 0 ]).toHaveLength(0)
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

        expect(eventList.escapeKey[ 0 ]).toHaveLength(0)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)show]', () => {
      test('should be callable', async () => {
        wrapper = mount(QDialog)

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .exists()
        ).toBe(false)

        expect(
          wrapper.vm.show()
        ).toBeUndefined()

        await flushPromises()
        await vi.runAllTimers()

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .exists()
        ).toBe(true)
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

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .exists()
        ).toBe(true)

        expect(
          wrapper.vm.hide()
        ).toBeUndefined()

        await flushPromises()
        await vi.runAllTimers()

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .exists()
        ).toBe(false)
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

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .exists()
        ).toBe(true)

        expect(
          wrapper.vm.toggle()
        ).toBeUndefined()

        await flushPromises()
        await vi.runAllTimers()

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .exists()
        ).toBe(false)

        expect(
          wrapper.vm.toggle()
        ).toBeUndefined()

        await flushPromises()
        await vi.runAllTimers()

        expect(
          wrapper.findComponent({ name: 'QPortal' })
            .exists()
        ).toBe(true)
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
          wrapper.findComponent({ name: 'QDialog' })
            .vm.focus('.q-btn')
        ).toBeUndefined()

        await flushPromises()

        expect(
          document.activeElement
        ).toBe(
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
          wrapper.findComponent({ name: 'QDialog' })
            .vm.focus()
        ).toBeUndefined()

        await flushPromises()

        expect(
          document.activeElement
        ).toBe(
          wrapper.findComponent({ name: 'QPortal' })
            .get('.q-dialog__inner').element
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

        wrapper.findComponent({ name: 'QDialog' })
          .vm.shake()

        expect(
          wrapper.findComponent({ name: 'QPortal' })
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

        expect(
          wrapper.vm.contentEl
        ).toBeInstanceOf(Element)
      })
    })
  })
})
