import { afterEach, describe, expect, test } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { KeepAlive, defineComponent, h, ref } from 'vue'

import useFullscreen, {
  useFullscreenEmits,
  useFullscreenProps
} from './use-fullscreen.js'
import { focusIsInDetachedFullscreen } from '../../utils/private.focus/detached-fullscreen.js'

let wrapper, mountTarget

afterEach(() => {
  wrapper?.unmount()
  mountTarget?.remove()
  wrapper = mountTarget = void 0
})

const FullscreenComponent = defineComponent({
  name: 'FullscreenComponent',
  props: useFullscreenProps,
  emits: useFullscreenEmits,

  setup() {
    const { inFullscreen } = useFullscreen()

    return () =>
      h(
        'section',
        {
          'data-test': 'fullscreen-component',
          'data-fullscreen': inFullscreen.value
        },
        'Fullscreen component'
      )
  }
})

const OtherComponent = defineComponent({
  name: 'OtherComponent',
  setup: () => () => h('section', { 'data-test': 'other-component' })
})

const NestedFullscreenComponent = defineComponent({
  name: 'NestedFullscreenComponent',
  props: useFullscreenProps,
  emits: useFullscreenEmits,

  setup() {
    useFullscreen()

    return () =>
      h('section', null, [h(FullscreenComponent, { fullscreen: true })])
  }
})

describe('[useFullscreen API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useFullscreenProps]', () => {
      test('is defined correctly', () => {
        expect(useFullscreenProps).$props()
      })
    })

    describe('[(variable)useFullscreenEmits]', () => {
      test('is defined correctly', () => {
        expect(useFullscreenEmits).$emits()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('registers the detached element for its original position', async () => {
        mountTarget = document.createElement('div')
        document.body.append(mountTarget)

        wrapper = mount(FullscreenComponent, {
          props: { fullscreen: true },
          attachTo: mountTarget
        })

        await flushPromises()

        const el = document.body.querySelector(
          '[data-test="fullscreen-component"]'
        )

        expect(el.parentElement).toBe(document.body)
        expect(focusIsInDetachedFullscreen(mountTarget, el)).toBe(true)
        expect(
          focusIsInDetachedFullscreen(document.createElement('div'), el)
        ).toBe(false)

        await wrapper.setProps({ fullscreen: false })
        await flushPromises()

        expect(focusIsInDetachedFullscreen(mountTarget, el)).toBe(false)
      })

      test('unregisters the detached element when unmounted while fullscreen', async () => {
        mountTarget = document.createElement('div')
        document.body.append(mountTarget)

        wrapper = mount(FullscreenComponent, {
          props: { fullscreen: true },
          attachTo: mountTarget
        })

        await flushPromises()

        const el = document.body.querySelector(
          '[data-test="fullscreen-component"]'
        )

        expect(focusIsInDetachedFullscreen(mountTarget, el)).toBe(true)

        wrapper.unmount()
        wrapper = void 0

        await flushPromises()

        expect(focusIsInDetachedFullscreen(mountTarget, el)).toBe(false)
      })

      test('registers a chain of nested fullscreen elements', async () => {
        mountTarget = document.createElement('div')
        document.body.append(mountTarget)

        wrapper = mount(NestedFullscreenComponent, {
          props: { fullscreen: true },
          attachTo: mountTarget
        })

        await flushPromises()

        const el = document.body.querySelector(
          '[data-test="fullscreen-component"]'
        )

        expect(mountTarget.contains(el)).toBe(false)
        expect(wrapper.vm.$el.contains(el)).toBe(false)
        expect(focusIsInDetachedFullscreen(mountTarget, el)).toBe(true)
      })

      test('does not move a deactivated root back into the live DOM', async () => {
        const showFullscreen = ref(true)

        mountTarget = document.createElement('div')
        document.body.append(mountTarget)

        wrapper = mount(
          defineComponent({
            setup: () => () =>
              h(KeepAlive, null, () =>
                showFullscreen.value === true
                  ? h(FullscreenComponent, { fullscreen: true })
                  : h(OtherComponent)
              )
          }),
          { attachTo: mountTarget }
        )

        await flushPromises()

        const getFullscreenElement = () =>
          document.body.querySelector('[data-test="fullscreen-component"]')

        expect(getFullscreenElement()).not.toBeNull()
        expect(getFullscreenElement().dataset.fullscreen).toBe('true')
        expect(
          document.body.classList.contains('q-body--fullscreen-mixin')
        ).toBe(true)

        showFullscreen.value = false
        await flushPromises()

        expect(getFullscreenElement()).toBeNull()
        expect(wrapper.find('[data-test="other-component"]').exists()).toBe(
          true
        )
        expect(
          document.body.classList.contains('q-body--fullscreen-mixin')
        ).toBe(false)

        showFullscreen.value = true
        await flushPromises()

        expect(getFullscreenElement()).not.toBeNull()
        expect(getFullscreenElement().dataset.fullscreen).toBe('true')
        expect(
          document.body.classList.contains('q-body--fullscreen-mixin')
        ).toBe(true)
      })

      test('restores a nested fullscreen component to cached content', async () => {
        const showFullscreen = ref(true)
        const CachedComponent = defineComponent({
          name: 'CachedComponent',
          setup: () => () =>
            h('main', null, [h(FullscreenComponent, { fullscreen: true })])
        })

        mountTarget = document.createElement('div')
        document.body.append(mountTarget)

        wrapper = mount(
          defineComponent({
            setup: () => () =>
              h(KeepAlive, null, () =>
                showFullscreen.value === true
                  ? h(CachedComponent)
                  : h(OtherComponent)
              )
          }),
          { attachTo: mountTarget }
        )

        await flushPromises()

        const getFullscreenElement = () =>
          document.body.querySelector('[data-test="fullscreen-component"]')

        expect(getFullscreenElement()).not.toBeNull()

        showFullscreen.value = false
        await flushPromises()

        expect(getFullscreenElement()).toBeNull()
        expect(wrapper.find('[data-test="other-component"]').exists()).toBe(
          true
        )

        showFullscreen.value = true
        await flushPromises()

        expect(getFullscreenElement()).not.toBeNull()
        expect(getFullscreenElement().dataset.fullscreen).toBe('true')
      })
    })
  })
})
