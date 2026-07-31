import { afterEach, describe, expect, test, vi } from 'vitest'

import {
  closePortalMenus,
  closePortals,
  getPortalProxy,
  portalProxyList
} from './portal.js'

// A stand-in for a portal component proxy: getParentProxy() reads $parent,
// so a plain object chain is enough to exercise the tree walking.
function createProxy({ name, portal = true, parent, props = {} } = {}) {
  return {
    $options: { name },
    $props: props,
    $parent: parent || null,
    // fallback branch of getParentProxy() when there is no $parent
    $: { parent: null },
    __qPortal: portal,
    hide: vi.fn()
  }
}

function chain(...proxies) {
  proxies.forEach((proxy, index) => {
    proxy.$parent = proxies[index + 1] || null
  })
  return proxies[0]
}

afterEach(() => {
  portalProxyList.length = 0
  vi.restoreAllMocks()
})

describe('[portal API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)portalProxyList]', () => {
      test('is a mutable registry of the currently rendered portals', () => {
        expect(Array.isArray(portalProxyList)).toBe(true)

        const proxy = { contentEl: document.createElement('div') }
        portalProxyList.push(proxy)

        expect(portalProxyList).toContain(proxy)
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)getPortalProxy]', () => {
      test('finds the portal whose content contains the element', () => {
        const contentEl = document.createElement('div')
        const child = document.createElement('span')
        contentEl.append(child)

        const proxy = { contentEl }
        portalProxyList.push(
          { contentEl: document.createElement('div') },
          proxy
        )

        expect(getPortalProxy(child)).toBe(proxy)
      })

      test('matches the content element itself', () => {
        const contentEl = document.createElement('div')
        const proxy = { contentEl }
        portalProxyList.push(proxy)

        expect(getPortalProxy(contentEl)).toBe(proxy)
      })

      test('skips portals which are not rendered', () => {
        const el = document.createElement('div')
        portalProxyList.push({ contentEl: null })

        expect(getPortalProxy(el)).toBeUndefined()
      })

      test('returns undefined when no portal contains the element', () => {
        portalProxyList.push({ contentEl: document.createElement('div') })

        expect(getPortalProxy(document.createElement('span'))).toBeUndefined()
      })
    })

    describe('[(function)closePortalMenus]', () => {
      test('hides the chain of menus up to the first non-menu portal', () => {
        const evt = { type: 'click' }
        const menu = createProxy({ name: 'QMenu' })
        const parentMenu = createProxy({ name: 'QMenu' })
        const dialog = createProxy({ name: 'QDialog' })

        chain(menu, parentMenu, dialog)

        expect(closePortalMenus(menu, evt)).toBe(dialog)

        expect(menu.hide).toHaveBeenCalledWith(evt)
        expect(parentMenu.hide).toHaveBeenCalledWith(evt)
        expect(dialog.hide).not.toHaveBeenCalled()
      })

      test('stops at a menu marked with separateClosePopup', () => {
        const menu = createProxy({
          name: 'QMenu',
          props: { separateClosePopup: true }
        })
        const outer = createProxy({ name: 'QMenu' })

        chain(menu, outer)

        expect(closePortalMenus(menu)).toBe(outer)

        expect(menu.hide).toHaveBeenCalledTimes(1)
        expect(outer.hide).not.toHaveBeenCalled()
      })

      test('hides a portal nested in a QPopupProxy and returns the popup proxy', () => {
        const evt = { type: 'click' }
        const menu = createProxy({ name: 'QMenu' })
        const inner = createProxy({ name: 'QDialog' })
        const popupProxy = createProxy({ name: 'QPopupProxy' })

        chain(menu, inner, popupProxy)

        expect(closePortalMenus(menu, evt)).toBe(popupProxy)

        expect(inner.hide).toHaveBeenCalledWith(evt)
        expect(popupProxy.hide).not.toHaveBeenCalled()
      })

      test('walks past non-portal ancestors', () => {
        const menu = createProxy({ name: 'QMenu' })
        const plain = createProxy({ name: 'QCard', portal: false })
        const outer = createProxy({ name: 'QMenu' })

        chain(menu, plain, outer)

        closePortalMenus(menu)

        expect(plain.hide).not.toHaveBeenCalled()
        expect(outer.hide).toHaveBeenCalledTimes(1)
      })

      test('returns undefined when it reaches the top of the tree', () => {
        const menu = createProxy({ name: 'QMenu' })

        expect(closePortalMenus(menu)).toBeUndefined()
        expect(menu.hide).toHaveBeenCalledTimes(1)
      })
    })

    describe('[(function)closePortals]', () => {
      test('hides at most the requested number of portals', () => {
        const evt = { type: 'click' }
        const first = createProxy({ name: 'QDialog' })
        const second = createProxy({ name: 'QDialog' })
        const third = createProxy({ name: 'QDialog' })

        chain(first, second, third)

        expect(closePortals(first, evt, 2)).toBeUndefined()

        expect(first.hide).toHaveBeenCalledWith(evt)
        expect(second.hide).toHaveBeenCalledWith(evt)
        expect(third.hide).not.toHaveBeenCalled()
      })

      test('does nothing for a depth of zero', () => {
        const dialog = createProxy({ name: 'QDialog' })

        closePortals(dialog, void 0, 0)

        expect(dialog.hide).not.toHaveBeenCalled()
      })

      test('only counts portals towards the depth', () => {
        const plain = createProxy({ name: 'QCard', portal: false })
        const dialog = createProxy({ name: 'QDialog' })

        chain(plain, dialog)

        closePortals(plain, void 0, 1)

        expect(dialog.hide).toHaveBeenCalledTimes(1)
      })

      test('delegates to the menu chain closing for menus', () => {
        const menu = createProxy({ name: 'QMenu' })
        const parentMenu = createProxy({ name: 'QMenu' })
        const dialog = createProxy({ name: 'QDialog' })

        chain(menu, parentMenu, dialog)

        closePortals(menu, void 0, 1)

        // the whole menu chain goes down, but the dialog beyond it stays
        expect(menu.hide).toHaveBeenCalledTimes(1)
        expect(parentMenu.hide).toHaveBeenCalledTimes(1)
        expect(dialog.hide).not.toHaveBeenCalled()
      })

      test('stops when it reaches the top of the tree', () => {
        const dialog = createProxy({ name: 'QDialog' })

        expect(() => closePortals(dialog, void 0, 10)).not.toThrow()
        expect(dialog.hide).toHaveBeenCalledTimes(1)
      })
    })
  })
})
