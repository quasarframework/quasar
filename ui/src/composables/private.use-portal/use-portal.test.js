import { afterEach, describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, getCurrentInstance, h, nextTick, ref } from 'vue'

import usePortal from './use-portal.js'
import { portalProxyList } from '../../utils/private.portal/portal.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
  portalProxyList.length = 0
})

function mountPortal({ onGlobalDialog = false, type = 'menu' } = {}) {
  let portal, portalProxy

  const PortalHarness = defineComponent({
    name: 'PortalHarness',
    inheritAttrs: false,

    setup() {
      const vm = getCurrentInstance()
      const innerRef = ref(null)

      portalProxy = vm.proxy
      portal = usePortal(
        vm,
        innerRef,
        () =>
          h(
            'div',
            {
              'data-test': 'portal-content'
            },
            'Portal content'
          ),
        type
      )

      return () =>
        h(
          'section',
          {
            ref: innerRef,
            'data-test': 'portal-host'
          },
          portal.renderPortal()
        )
    }
  })

  const RootComponent =
    onGlobalDialog === true
      ? defineComponent({
          name: 'QGlobalDialog',
          setup: () => () => h(PortalHarness)
        })
      : PortalHarness

  wrapper = mount(RootComponent)

  return { portal, portalProxy }
}

describe('[usePortal API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('registers, renders, and removes teleported content', async () => {
        const { portal, portalProxy } = mountPortal()

        expect(portal.portalIsActive).$ref(false)
        expect(portal.portalIsAccessible).$ref(false)
        expect(portalProxy.__qPortal).toBe(true)
        expect(portalProxy.contentEl).toBe(
          wrapper.get('[data-test="portal-host"]').element
        )
        expect(portalProxyList.includes(portalProxy)).toBe(false)

        portal.showPortal()
        portal.showPortal()
        await nextTick()

        const portalNode = document.querySelector('[id^="q-portal--menu--"]')

        expect(portal.portalIsActive).$ref(true)
        expect(portal.portalIsAccessible).$ref(false)
        expect(portalProxyList.length).toBe(1)
        expect(portalProxyList[0]).toBe(portalProxy)
        expect(portalNode).not.toBeNull()
        expect(
          portalNode.querySelector('[data-test="portal-content"]')
        ).not.toBeNull()

        portal.showPortal(true)

        expect(portal.portalIsAccessible).$ref(true)

        portal.hidePortal(false)

        expect(portal.portalIsActive).$ref(true)
        expect(portal.portalIsAccessible).$ref(false)
        expect(portalProxyList.includes(portalProxy)).toBe(true)

        portal.hidePortal(true)
        await nextTick()

        expect(portal.portalIsActive).$ref(false)
        expect(portal.portalIsAccessible).$ref(false)
        expect(portalProxyList.includes(portalProxy)).toBe(false)
        expect(portalNode.isConnected).toBe(false)
      })

      test('cleans up an active portal when unmounted', async () => {
        const { portal, portalProxy } = mountPortal({ type: 'dialog' })

        portal.showPortal()
        await nextTick()

        const portalNode = document.querySelector('[id^="q-portal--dialog--"]')

        expect(portalNode).not.toBeNull()
        expect(portalProxyList.includes(portalProxy)).toBe(true)

        wrapper.unmount()
        wrapper = void 0

        expect(portalProxyList.includes(portalProxy)).toBe(false)
        expect(portalNode.isConnected).toBe(false)
        expect(portal.portalIsActive).$ref(false)
      })

      test('renders dialog content in place under a global dialog', async () => {
        const { portal, portalProxy } = mountPortal({
          onGlobalDialog: true,
          type: 'dialog'
        })

        portal.showPortal()
        await nextTick()

        expect(document.querySelector('[id^="q-portal--dialog--"]')).toBeNull()
        expect(wrapper.find('[data-test="portal-content"]').exists()).toBe(true)
        expect(portalProxyList.length).toBe(1)
        expect(portalProxyList[0]).toBe(portalProxy)

        portal.hidePortal(true)
        await nextTick()

        expect(portal.portalIsActive).$ref(false)
        expect(portalProxyList.includes(portalProxy)).toBe(false)
        expect(wrapper.find('[data-test="portal-content"]').exists()).toBe(true)
      })
    })
  })
})
