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
import { defineComponent, h, nextTick } from 'vue'

import QDialog from '../../components/dialog/QDialog.js'
import QMenu from '../../components/menu/QMenu.js'
import usePortalRefocus from './use-portal-refocus.js'

let wrapper

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
  vi.clearAllTimers()
  vi.useRealTimers()
})

// portals animate through timers, so a show/hide settles only after
// the pending microtasks and timers have run
async function settle() {
  await flushPromises()
  await vi.runAllTimersAsync()
}

const dialogContent = () => [
  h('input', { class: 'dialog-input', autofocus: true }),
  h('button', { class: 'dialog-btn' }, 'Dialog button')
]

/**
 * The bare composable, on a component that is not a portal.
 */
function mountBare(props = {}) {
  let api

  wrapper = mount(
    defineComponent({
      setup() {
        api = usePortalRefocus(props, () => false)
        return () => h('div')
      }
    })
  )

  return api
}

/**
 * A focusable control wrapping a focus helper, the way a QBtn does.
 */
function createControl() {
  const control = document.createElement('button')
  control.setAttribute('tabindex', '0')

  const helper = document.createElement('span')
  helper.setAttribute('tabindex', '-1')
  control.append(helper)

  document.body.append(control)
  onTestFinished(() => {
    control.remove()
  })

  return { control, helper }
}

/**
 * A menu anchored on a focusable box, holding one focusable item, plus a
 * dialog with an autofocused input.
 */
function mountMenuAndDialog(dialogProps) {
  wrapper = mount(
    defineComponent({
      setup() {
        return () =>
          h('div', [
            h('div', { class: 'anchor', tabindex: 0 }, [
              h(QMenu, null, () =>
                h('div', { class: 'item', tabindex: 0 }, 'Item')
              )
            ]),
            h(QDialog, dialogProps, dialogContent)
          ])
      }
    })
  )

  return {
    anchor: wrapper.get('.anchor').element,
    menu: wrapper.findComponent(QMenu).vm,
    dialog: wrapper.findComponent(QDialog).vm
  }
}

/**
 * Two dialogs: the first holds a focusable button, the second an
 * autofocused input; a focusable opener sits outside both.
 */
function mountTwoDialogs() {
  wrapper = mount(
    defineComponent({
      setup() {
        return () =>
          h('div', [
            h('button', { class: 'opener' }, 'Open'),
            h(QDialog, { class: 'dialog-a' }, () =>
              h('button', { class: 'dialog-a-btn' }, 'Open next')
            ),
            h(QDialog, { class: 'dialog-b' }, dialogContent)
          ])
      }
    })
  )

  const [dialogA, dialogB] = wrapper.findAllComponents(QDialog)

  return {
    opener: wrapper.get('.opener').element,
    dialogA: dialogA.vm,
    dialogB: dialogB.vm
  }
}

/**
 * Opens the portal on top the way a v-close-popup click does it: the
 * opener's show has already queued its autofocus (a browser-dispatched
 * event runs its microtasks between listeners) by the time the portal
 * underneath gets to hide.
 */
async function showOverThenHide(opener, closer) {
  opener.show()
  await nextTick()
  closer.hide()
  await settle()
}

describe('[usePortalRefocus API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('restores the captured element, or nothing when asked to skip the capture', () => {
        const api = mountBare()
        const { helper } = createControl()

        helper.focus()
        api.captureRefocusTarget()
        helper.blur()

        api.restoreFocus({ type: 'click' })
        expect(document.activeElement).toBe(helper)

        api.captureRefocusTarget(true)
        helper.blur()

        api.restoreFocus()
        expect(document.activeElement).toBe(document.body)
      })

      test('captures nothing with no-refocus', () => {
        const api = mountBare({ noRefocus: true })
        const { helper } = createControl()

        helper.focus()
        api.captureRefocusTarget()
        helper.blur()

        api.restoreFocus()
        expect(document.activeElement).toBe(document.body)
      })

      test('lands a keyboard-initiated close on the tabbable control', () => {
        const api = mountBare()
        const { control, helper } = createControl()

        helper.focus()
        api.captureRefocusTarget()
        helper.blur()

        api.restoreFocus({ type: 'keydown' })
        expect(document.activeElement).toBe(control)

        helper.focus()
        api.captureRefocusTarget()
        helper.blur()

        api.restoreFocusSync({ type: 'keydown' })
        expect(document.activeElement).toBe(control)
      })

      test('hands focus back to the element focused before opening', async () => {
        const { anchor, menu } = mountMenuAndDialog()

        anchor.focus()
        menu.show()
        await settle()
        expect(document.activeElement).toBe(document.querySelector('.q-menu'))

        menu.hide()
        await settle()
        expect(document.activeElement).toBe(anchor)
      })

      test('lets a dialog opening over a closing menu take focus, then restore the menu anchor', async () => {
        const { anchor, menu, dialog } = mountMenuAndDialog()

        anchor.focus()
        menu.show()
        await settle()

        const item = document.querySelector('.item')
        item.focus()
        expect(document.activeElement).toBe(item)

        await showOverThenHide(dialog, menu)

        // the dialog's autofocus won over the menu's restore
        expect(document.activeElement).toBe(
          document.querySelector('.dialog-input')
        )
        expect(document.querySelector('.q-menu')).toBe(null)

        dialog.hide()
        await settle()

        // the item the dialog was opened from is gone with the menu, so
        // focus lands on the menu's anchor instead of being dropped
        expect(document.activeElement).toBe(anchor)
      })

      test('lets a dialog opening over a closing dialog take focus, then restore the first opener', async () => {
        const { opener, dialogA, dialogB } = mountTwoDialogs()

        opener.focus()
        dialogA.show()
        await settle()

        const button = document.querySelector('.dialog-a-btn')
        button.focus()
        expect(document.activeElement).toBe(button)

        await showOverThenHide(dialogB, dialogA)

        expect(document.activeElement).toBe(
          document.querySelector('.dialog-input')
        )
        expect(document.querySelector('.dialog-a')).toBe(null)

        dialogB.hide()
        await settle()

        expect(document.activeElement).toBe(opener)
      })

      test('restores focus itself when the portal opening on top takes none', async () => {
        const { anchor, menu, dialog } = mountMenuAndDialog({ noFocus: true })

        anchor.focus()
        menu.show()
        await settle()

        await showOverThenHide(dialog, menu)

        expect(document.querySelector('.dialog-input')).not.toBe(null)
        expect(document.activeElement).toBe(anchor)
      })

      test('restores focus itself when the portal on top is already open', async () => {
        // seamless: a modal dialog would trap the restored focus back
        const { anchor, menu, dialog } = mountMenuAndDialog({ seamless: true })

        anchor.focus()
        menu.show()
        await settle()

        dialog.show()
        await settle()

        menu.hide()
        await settle()

        expect(document.activeElement).toBe(anchor)
      })
    })
  })
})
