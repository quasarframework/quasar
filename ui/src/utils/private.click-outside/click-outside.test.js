import { afterEach, describe, expect, test, vi } from 'vitest'

import { addClickOutside, removeClickOutside } from './click-outside.js'
import { portalProxyList } from '../private.portal/portal.js'

// Elements and clickOutside states created during a test, cleaned up after.
const createdEls = []
const registeredStates = []

function createEl() {
  const el = document.createElement('div')
  document.body.append(el)
  createdEls.push(el)
  return el
}

// Register a fake portal (QMenu / QDialog / QTooltip) in the shared
// portalProxyList, mimicking what usePortal.showPortal() does.
function pushPortal(name, { seamless = false } = {}) {
  const contentEl = createEl()
  portalProxyList.push({
    contentEl,
    $: { type: { name }, props: { seamless } }
  })
  return contentEl
}

// Register a closable popup (QMenu-like) both as a portal and as a
// clickOutside listener, returning its content element and the spy.
function pushMenu() {
  const contentEl = pushPortal('QMenu')
  const onClickOutside = vi.fn()
  const state = {
    anchorEl: { value: null },
    innerRef: { value: contentEl },
    onClickOutside
  }
  addClickOutside(state)
  registeredStates.push(state)
  return { contentEl, onClickOutside }
}

function mousedownOn(el) {
  el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
}

afterEach(() => {
  registeredStates.forEach(removeClickOutside)
  registeredStates.length = 0
  portalProxyList.length = 0
  createdEls.forEach(el => el.remove())
  createdEls.length = 0
  vi.restoreAllMocks()
})

describe('[clickOutside API]', () => {
  describe('[Functions]', () => {
    describe('[(function)addClickOutside]', () => {
      test('closes nested menus that have no dialog between them', () => {
        // stack (open order): outer QMenu -> inner QMenu
        const outer = pushMenu()
        const inner = pushMenu()

        // click somewhere outside both menus
        mousedownOn(createEl())

        expect(inner.onClickOutside).toHaveBeenCalledTimes(1)
        expect(outer.onClickOutside).toHaveBeenCalledTimes(1)
      })

      test('does not close a menu shielded by a modal dialog (issue #18091)', () => {
        // stack (open order): outer QMenu -> modal QDialog -> inner QMenu
        const outer = pushMenu()
        const dialogEl = pushPortal('QDialog', { seamless: false })
        const inner = pushMenu()

        // click inside the dialog, but outside the inner menu popup
        mousedownOn(dialogEl)

        // only the inner Select popup should close
        expect(inner.onClickOutside).toHaveBeenCalledTimes(1)
        // the outer Select popup stays open (shielded by the dialog backdrop)
        expect(outer.onClickOutside).not.toHaveBeenCalled()
      })

      test('a seamless dialog is not a boundary (has no backdrop)', () => {
        // stack (open order): outer QMenu -> seamless QDialog -> inner QMenu
        const outer = pushMenu()
        const dialogEl = pushPortal('QDialog', { seamless: true })
        const inner = pushMenu()

        // click inside the seamless dialog, outside the inner menu popup
        mousedownOn(dialogEl)

        // without a backdrop, both menus close as before
        expect(inner.onClickOutside).toHaveBeenCalledTimes(1)
        expect(outer.onClickOutside).toHaveBeenCalledTimes(1)
      })

      test('a modal dialog on top closes nothing beneath it', () => {
        // stack (open order): outer QMenu -> modal QDialog (top-most)
        const outer = pushMenu()
        const dialogEl = pushPortal('QDialog', { seamless: false })

        mousedownOn(dialogEl)

        expect(outer.onClickOutside).not.toHaveBeenCalled()
      })

      test('a QTooltip above a modal dialog does not unshield an earlier menu', () => {
        // stack (open order): outer QMenu -> modal QDialog -> QTooltip
        // the QTooltip is skipped while scanning for the dialog boundary; that
        // skip must not let the click reach the menu opened before the dialog
        const outer = pushMenu()
        const dialogEl = pushPortal('QDialog', { seamless: false })
        pushPortal('QTooltip')

        // click inside the dialog, outside every popup
        mousedownOn(dialogEl)

        expect(outer.onClickOutside).not.toHaveBeenCalled()
      })
    })

    describe('[(function)removeClickOutside]', () => {
      test('has correct return value', () => {
        const result = removeClickOutside({})
        expect(result).toBeUndefined()
      })
    })
  })
})
