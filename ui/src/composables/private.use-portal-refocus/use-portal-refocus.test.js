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
import { cdp } from 'vitest/browser'
import { defineComponent, h, shallowRef, withDirectives } from 'vue'

import QDialog from '../../components/dialog/QDialog.js'
import QMenu from '../../components/menu/QMenu.js'
import ClosePopup from '../../directives/close-popup/ClosePopup.js'
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

/**
 * A real click, dispatched by the browser rather than by script: the
 * browser runs a microtask checkpoint between the element's listeners,
 * which is what puts a dialog's show ahead of the v-close-popup listener
 * that follows it on the same element. The cursor is parked again
 * afterwards (see test/vitest.setup.js).
 */
async function realClick(el) {
  const { x, y, width, height } = el.getBoundingClientRect()
  const mouse = params =>
    cdp().send('Input.dispatchMouseEvent', {
      x: Math.round(x + width / 2),
      y: Math.round(y + height / 2),
      button: 'left',
      clickCount: 1,
      ...params
    })

  await mouse({ type: 'mouseMoved', button: 'none' })
  await mouse({ type: 'mousePressed' })
  await mouse({ type: 'mouseReleased' })
  await cdp().send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: 1275,
    y: 795
  })
}

// the fake timers settle a portal's transition bookkeeping instantly,
// but its CSS animation runs in real time; a real click on a still
// scaling element would miss it, so the harness portals barely animate
// (a zero duration would skip the opening phase altogether)
const noTransition = { transitionDuration: 1 }

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
 * A menu anchored on a focusable box, plus a dialog with an autofocused
 * input. Clicking the menu's item opens the dialog and, through
 * v-close-popup, closes the menu.
 */
function mountMenuAndDialog(dialogProps) {
  wrapper = mount(
    defineComponent({
      setup() {
        const dialogRef = shallowRef(null)

        return () =>
          h('div', [
            h('div', { class: 'anchor', tabindex: 0 }, [
              h(QMenu, noTransition, () =>
                withDirectives(
                  h(
                    'div',
                    {
                      class: 'item',
                      tabindex: 0,
                      onClick: () => {
                        dialogRef.value.show()
                      }
                    },
                    'Item'
                  ),
                  [[ClosePopup]]
                )
              )
            ]),
            h(
              QDialog,
              { ref: dialogRef, ...noTransition, ...dialogProps },
              dialogContent
            )
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
 * Two dialogs, with a focusable opener outside both. The first dialog's
 * button opens the second and, through v-close-popup, closes the first.
 */
function mountTwoDialogs() {
  wrapper = mount(
    defineComponent({
      setup() {
        const dialogBRef = shallowRef(null)

        return () =>
          h('div', [
            h('button', { class: 'opener' }, 'Open'),
            // only a div child of the dialog's inner element takes
            // pointer events; anything else lets clicks fall through to
            // the backdrop
            h(QDialog, { class: 'dialog-a', ...noTransition }, () =>
              h('div', [
                withDirectives(
                  h(
                    'button',
                    {
                      class: 'dialog-a-btn',
                      onClick: () => {
                        dialogBRef.value.show()
                      }
                    },
                    'Open next'
                  ),
                  [[ClosePopup]]
                )
              ])
            ),
            h(
              QDialog,
              { class: 'dialog-b', ref: dialogBRef, ...noTransition },
              dialogContent
            )
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

        await realClick(document.querySelector('.item'))
        await settle()

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

        await realClick(document.querySelector('.dialog-a-btn'))
        await settle()

        expect(document.activeElement).toBe(
          document.querySelector('.dialog-input')
        )
        expect(document.querySelector('.dialog-a')).toBe(null)

        dialogB.hide()
        await settle()

        expect(document.activeElement).toBe(opener)
      })

      test('restores focus itself when the portal opening on top takes none', async () => {
        const { anchor, menu } = mountMenuAndDialog({ noFocus: true })

        anchor.focus()
        menu.show()
        await settle()

        await realClick(document.querySelector('.item'))
        await settle()

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
