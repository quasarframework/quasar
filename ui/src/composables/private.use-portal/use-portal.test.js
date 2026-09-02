import { afterEach, describe, expect, onTestFinished, test } from 'vitest'
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

function mountPortal({ onGlobalDialog = false, type = 'menu', visible } = {}) {
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
      : visible !== void 0
        ? // unmounts the harness through Vue's own patching, unlike
          // wrapper.unmount() which detaches the root element first
          defineComponent({
            name: 'HarnessToggle',
            setup: () => () => (visible.value ? h(PortalHarness) : null)
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

  describe('[Generic]', () => {
    // a QField hosting a menu/dialog inside its control hears these on the
    // control (see use-field), so they must bubble from a node that sits in
    // the field's markup while the popup opens, closes or gets unmounted
    describe('field notification', () => {
      function listenOnBody() {
        const log = []
        const onEvt = evt => {
          log.push([evt.type, evt.bubbles, evt.target, evt.target.isConnected])
        }

        document.body.addEventListener('popup-show', onEvt)
        document.body.addEventListener('popup-hide', onEvt)

        onTestFinished(() => {
          document.body.removeEventListener('popup-show', onEvt)
          document.body.removeEventListener('popup-hide', onEvt)
        })

        return log
      }

      test.each(['menu', 'dialog'])(
        'a %s dispatches bubbling popup-show/popup-hide from its placeholder node',
        async type => {
          const log = listenOnBody()
          const { portal, portalProxy } = mountPortal({ type })
          const placeholder = portalProxy.$el

          portal.showPortal()
          // already active: no second notification
          portal.showPortal()
          await nextTick()

          expect(log).toEqual([['popup-show', true, placeholder, true]])

          portal.showPortal(true)
          expect(log).toHaveLength(1)

          portal.hidePortal(false)
          expect(log).toEqual([
            ['popup-show', true, placeholder, true],
            ['popup-hide', true, placeholder, true]
          ])

          // done hiding: no second notification
          portal.hidePortal(true)
          await nextTick()
          expect(log).toHaveLength(2)
        }
      )

      test('a silent show (hover-shown menu) never notifies, hide included', async () => {
        const log = listenOnBody()
        const { portal } = mountPortal()

        portal.showPortal(false, true)
        await nextTick()
        portal.showPortal(true)
        portal.hidePortal(false)
        portal.hidePortal(true)
        await nextTick()

        expect(log).toEqual([])
      })

      test('a tooltip never notifies (it does not take focus)', async () => {
        const log = listenOnBody()
        const { portal } = mountPortal({ type: 'tooltip' })

        portal.showPortal()
        await nextTick()
        portal.showPortal(true)
        portal.hidePortal(false)
        portal.hidePortal(true)
        await nextTick()

        expect(log).toEqual([])
      })

      test('a popup unmounted while open notifies from a still connected node', async () => {
        const log = listenOnBody()
        const visible = ref(true)
        const { portal, portalProxy } = mountPortal({ visible })
        const placeholder = portalProxy.$el

        portal.showPortal()
        await nextTick()

        visible.value = false
        await nextTick()

        expect(log).toEqual([
          ['popup-show', true, placeholder, true],
          ['popup-hide', true, placeholder, true]
        ])
        expect(portal.portalIsActive).$ref(false)
      })
    })
  })
})
