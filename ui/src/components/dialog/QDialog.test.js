import { mount } from '@vue/test-utils'
import { describe, test, expect, vi } from 'vitest'
import { nextTick } from 'vue'

import { timeToPass } from 'test/runtime.utils.js'
import QDialog from './QDialog.js'
import DialogWrapper from './test/DialogWrapper.vue'

function mountDialog (props = {}) {
  const wrapper = mount(DialogWrapper, {
    props: {
      modelValue: false,
      'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
      transitionDuration: 0,
      ...props
    }
  })

  const getDialog = () => wrapper.findComponent({ name: 'QDialog' })
  const getPortal = () => wrapper.findComponent({ name: 'QPortal' })

  return {
    wrapper,

    getDialog,
    getPortal,

    setProps: props => {
      wrapper.setProps(props)
      return nextTick()
    },

    isMounted: () => {
      const portal = getPortal()
      if (portal.exists() === false) return false
      return document.body.contains(portal.element)
    },

    show: () => {
      wrapper.setProps({ modelValue: true })
      return vi.waitUntil(
        () => getPortal().exists(),
        {
          timeout: 150, // default is 1000
          interval: 5 // default is 50
        }
      )
    },

    hide: () => {
      wrapper.setProps({ modelValue: false })
      return vi.waitUntil(
        () => getPortal().exists() === false,
        {
          timeout: 150, // default is 1000
          interval: 5 // default is 50
        }
      )
    },

    waitForEvent: eventName => {
      const dlg = getDialog()
      const evtLen = 1 + (
        dlg.emitted()[ eventName ]?.length
        || 0
      )

      return vi.waitUntil(
        () => (dlg.emitted()[ eventName ]?.length === evtLen),
        {
          timeout: 150, // default is 1000
          interval: 5 // default is 50
        }
      )
    },

    triggerEscape: () => {
      const portal = getPortal()
      portal.trigger('keydown', { keyCode: 27 })
      portal.trigger('keyup', { keyCode: 27 })
    },

    triggerBackdropClick: () => {
      getPortal()
        .find('.q-dialog__backdrop')
        .trigger('click')
    }
  }
}

describe('[QDialog API]', () => {
  describe('[Props]', () => {
    describe('[(prop)transition-show]', () => {
      test('is defined', () => {
        expect(QDialog.props.transitionShow).toBeDefined()
      })

      test.todo('has effect', () => {
        const propVal = 'fade'
        const wrapper = mount(QDialog, {
          props: {
            transitionShow: propVal
          }
        })

        // TODO: test the effect of the prop
      })
    })

    describe('[(prop)persistent]', () => {
      test('should display a persistent dialog', async () => {
        const dlg = mountDialog({ persistent: true })

        await dlg.show()
        expect(dlg.isMounted()).toBe(true)

        dlg.triggerBackdropClick()
        await timeToPass(30)
        expect(dlg.isMounted()).toBe(true)

        dlg.triggerEscape()
        await timeToPass(30)
        expect(dlg.isMounted()).toBe(true)

        await dlg.setProps({ persistent: false })
        dlg.triggerBackdropClick()

        await dlg.waitForEvent('hide')
        expect(dlg.isMounted()).toBe(false)
      })
    })

    describe('[(prop)no-esc-dismiss]', () => {
      test('should not allow closing the dialog with the escape key', async () => {
        const dlg = mountDialog({ noEscDismiss: true })

        await dlg.show()
        dlg.triggerEscape()

        await timeToPass(30)
        expect(dlg.isMounted()).toBe(true)

        await dlg.setProps({ noEscDismiss: false })
        dlg.triggerEscape()

        await dlg.waitForEvent('hide')
        expect(dlg.isMounted()).toBe(false)
      })
    })

    describe('[(prop)no-backdrop-dismiss]', () => {
      test('should not close dialog with backdrop', async () => {
        const dlg = mountDialog({ noBackdropDismiss: true })

        await dlg.show()
        dlg.triggerBackdropClick()
        await timeToPass(30)

        expect(dlg.isMounted()).toBe(true)

        await dlg.setProps({ noBackdropDismiss: false })
        dlg.triggerBackdropClick()

        await dlg.waitForEvent('hide')
        expect(dlg.isMounted()).toBe(false)
      })
    })

    describe.todo('[(prop)no-route-dismiss]', () => {
      test.todo(' ', () => {
        //
      })
    })

    describe('[(prop)auto-close]', () => {
      test('should auto-close the dialog', async () => {
        const dlg = mountDialog({ autoClose: false })

        await dlg.show()
        dlg.wrapper.findComponent({ name: 'QBtn' })
          .trigger('click')

        await timeToPass(30)

        expect(dlg.isMounted()).toBe(true)

        await dlg.setProps({ autoClose: true })

        dlg.wrapper.findComponent({ name: 'QBtn' })
          .trigger('click')

        await dlg.waitForEvent('hide')
        expect(dlg.isMounted()).toBe(false)
      })
    })

    describe('[(prop)seamless]', () => {
      test('should put the dialog in a seamless state', async () => {
        const dlg = mountDialog({ seamless: true })

        await dlg.show()
        const target = dlg.getPortal().get('.q-dialog')

        expect(
          target.classes()
        ).toContain('q-dialog--seamless')

        await dlg.setProps({ seamless: false })

        expect(
          target.classes()
        ).not.toContain('q-dialog--seamless')
      })
    })

    describe('[(prop)maximized]', () => {
      test('should maximize the dialog', async () => {
        const dlg = mountDialog({ maximized: true })

        await dlg.show()
        const target = dlg.getPortal().get('.q-dialog__inner')

        expect(
          target.classes()
        ).toContain('q-dialog__inner--maximized')

        await dlg.setProps({ maximized: false })

        expect(
          target.classes()
        ).not.toContain('q-dialog__inner--maximized')
      })
    })

    describe('[(prop)full-width]', () => {
      test('should use a full-width for the dialog', async () => {
        const dlg = mountDialog({ fullWidth: true })

        await dlg.show()
        const target = dlg.getPortal().get('.q-dialog__inner')

        expect(
          target.classes()
        ).toContain('q-dialog__inner--fullwidth')

        await dlg.setProps({ fullWidth: false })

        expect(
          target.classes()
        ).not.toContain('q-dialog__inner--fullwidth')
      })
    })

    describe('[(prop)full-height]', () => {
      test('should set the dialog to full-height', async () => {
        const dlg = mountDialog({ fullHeight: true })

        await dlg.show()
        const target = dlg.getPortal().get('.q-dialog__inner')

        expect(
          target.classes()
        ).toContain('q-dialog__inner--fullheight')

        await dlg.setProps({ fullHeight: false })

        expect(
          target.classes()
        ).not.toContain('q-dialog__inner--fullheight')
      })
    })

    describe('[(prop)position]', () => {
      test('should display the dialog at a specific position', async () => {
        const dlg = mountDialog()

        await dlg.show()

        const target = dlg.getPortal().get('.q-dialog__inner')
        const positions = [ 'top', 'right', 'bottom', 'left' ]

        for (const position of positions) {
          await dlg.setProps({ position })

          const cls = target.classes()
          expect(cls).toContain(`q-dialog__inner--${ position }`)
          expect(cls).toContain(`fixed-${ position }`)
        }
      })
    })

    describe('[(prop)square]', () => {
      test('should use a square style for dialog', async () => {
        const dlg = mountDialog({ square: true })
        await dlg.show()

        const target = dlg.getPortal().get('.q-dialog__inner')

        expect(target.classes()).toContain('q-dialog__inner--square')
        await dlg.setProps({ square: false })
        expect(target.classes()).not.toContain('q-dialog__inner--square')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('should display a default slot', async () => {
        const dlg = mountDialog({ persistent: true })
        await dlg.show()

        expect(
          dlg.wrapper.findComponent({ name: 'QBtn' })
            .exists()
        ).toBe(true)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)shake]', () => {
      test('should emit shake event', async () => {
        const fn = vi.fn()
        const dlg = mountDialog({
          noEscDismiss: true,
          onShake: fn
        })

        await dlg.show()

        dlg.triggerEscape()
        await nextTick()

        expect(fn).toHaveBeenCalledTimes(1)

        dlg.getDialog().vm.shake()
        await nextTick()

        expect(fn).toHaveBeenCalledTimes(2)
      })
    })

    describe('[(event)escape-key]', () => {
      test('should emit escape-key event', async () => {
        const fn = vi.fn()
        const dlg = mountDialog({
          onEscapeKey: fn
        })

        await dlg.show()

        dlg.triggerEscape()
        await nextTick()

        expect(fn).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)shake]', () => {
      test('should use the shake method to shake dialog', async () => {
        const dlg = mountDialog({ noEscDismiss: true })

        await dlg.show()

        const target = dlg.getPortal().get('.q-dialog__inner')
        expect(target.classes()).not.toContain('q-animate--scale')

        dlg.triggerEscape()
        await nextTick()

        expect(target.classes()).toContain('q-animate--scale')

        await vi.waitUntil(
          () => target.classes().includes('q-animate--scale') === false,
          {
            timeout: 400, // default is 1000
            interval: 50 // default is 50
          }
        )

        dlg.getDialog().vm.shake()
        await nextTick()

        expect(target.classes()).toContain('q-animate--scale')
      })
    })
  })
})
