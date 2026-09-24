import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { KeepAlive, defineComponent, h, nextTick, ref, toValue } from 'vue'

import useSoftFullscreen from './use-soft-fullscreen.js'
import { focusIsInDetachedFullscreen } from '../../utils/private.focus/detached-fullscreen.js'
import { getRouter } from 'testing/runtime/router.js'

let wrapper, mountTarget

afterEach(() => {
  wrapper?.unmount()
  mountTarget?.remove()
  wrapper = mountTarget = void 0
  vi.restoreAllMocks()
})

function bodyHasFullscreenClass() {
  return document.body.classList.contains('q-body--fullscreen-mixin')
}

function createMountTarget() {
  mountTarget = document.createElement('div')
  document.body.append(mountTarget)
  return mountTarget
}

// mounts a component driving a child element through a template ref;
// `options` (object, ref or getter) is merged in through a getter
function mountRootAndTarget(options, mountOptions) {
  let result
  let target
  wrapper = mount(
    defineComponent({
      setup() {
        target = ref(null)
        result = useSoftFullscreen(() => ({ target, ...toValue(options) }))
        return () =>
          h('div', { 'data-test': 'root' }, [
            h('section', { ref: target, 'data-test': 'target' }, 'target')
          ])
      }
    }),
    { attachTo: createMountTarget(), ...mountOptions }
  )

  return {
    ...result,
    root: wrapper.element,
    // may already be in fullscreen (moved to body) at this point
    target: document.querySelector('[data-test="target"]')
  }
}

describe('[useSoftFullscreen API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        let result
        wrapper = mount(
          defineComponent({
            setup() {
              result = useSoftFullscreen()
              return () => h('div')
            }
          })
        )

        expect(result).toStrictEqual({
          inFullscreen: expect.$ref(false),
          setFullscreen: expect.any(Function),
          exitFullscreen: expect.any(Function),
          toggleFullscreen: expect.any(Function)
        })
      })

      test('moves the component root to body and back', () => {
        let result
        wrapper = mount(
          defineComponent({
            setup() {
              result = useSoftFullscreen()
              return () => h('div', { 'data-test': 'root' })
            }
          }),
          { attachTo: createMountTarget() }
        )

        const el = wrapper.element

        result.setFullscreen()

        expect(result.inFullscreen.value).toBe(true)
        expect(el.parentElement).toBe(document.body)
        expect(mountTarget.contains(el)).toBe(false)
        expect(bodyHasFullscreenClass()).toBe(true)
        expect(focusIsInDetachedFullscreen(mountTarget, el)).toBe(true)

        result.exitFullscreen()

        expect(result.inFullscreen.value).toBe(false)
        expect(mountTarget.contains(el)).toBe(true)
        expect(bodyHasFullscreenClass()).toBe(false)
        expect(focusIsInDetachedFullscreen(mountTarget, el)).toBe(false)
        // the filler node is gone
        expect(mountTarget.children).toHaveLength(1)
      })

      test('does nothing for a fragment root', () => {
        let result
        wrapper = mount(
          defineComponent({
            setup() {
              result = useSoftFullscreen()
              return () => [h('div'), h('div')]
            }
          }),
          { attachTo: createMountTarget() }
        )

        result.setFullscreen()

        expect(result.inFullscreen.value).toBe(false)
        expect(bodyHasFullscreenClass()).toBe(false)
      })

      test('moves the target instead of the root when given', () => {
        const { root, target, setFullscreen, exitFullscreen } =
          mountRootAndTarget()

        setFullscreen()

        expect(target.parentElement).toBe(document.body)
        expect(mountTarget.contains(root)).toBe(true)
        // a filler node holds the place
        expect(root.children).toHaveLength(1)
        expect(root.firstElementChild).not.toBe(target)

        exitFullscreen()

        expect(root.children).toHaveLength(1)
        expect(root.firstElementChild).toBe(target)
      })

      test('toggleFullscreen() flips the state', () => {
        const { target, inFullscreen, toggleFullscreen } = mountRootAndTarget()

        toggleFullscreen()
        expect(inFullscreen.value).toBe(true)
        expect(target.parentElement).toBe(document.body)

        toggleFullscreen()
        expect(inFullscreen.value).toBe(false)
        expect(target.parentElement).toBe(wrapper.element)
      })

      test('setFullscreen() and exitFullscreen() are idempotent', () => {
        const { setFullscreen, exitFullscreen } = mountRootAndTarget()

        setFullscreen()
        setFullscreen()
        expect(bodyHasFullscreenClass()).toBe(true)

        exitFullscreen()
        expect(bodyHasFullscreenClass()).toBe(false)

        exitFullscreen()
        expect(bodyHasFullscreenClass()).toBe(false)
      })

      test('follows the fullscreen option', () => {
        const fullscreen = ref(true)
        const { target, inFullscreen } = mountRootAndTarget(() => ({
          fullscreen: fullscreen.value
        }))

        // entered at mount
        expect(inFullscreen.value).toBe(true)
        expect(target.parentElement).toBe(document.body)

        fullscreen.value = false
        expect(inFullscreen.value).toBe(false)
        expect(target.parentElement).toBe(wrapper.element)

        fullscreen.value = true
        expect(inFullscreen.value).toBe(true)
        expect(target.parentElement).toBe(document.body)
      })

      test('an unrelated option change leaves an imperative state alone', () => {
        const noRouteExit = ref(false)
        const { inFullscreen, toggleFullscreen } = mountRootAndTarget(() => ({
          fullscreen: false,
          noRouteExit: noRouteExit.value
        }))

        toggleFullscreen()
        expect(inFullscreen.value).toBe(true)

        noRouteExit.value = true
        expect(inFullscreen.value).toBe(true)
      })

      test('accepts a plain options object', () => {
        const el = document.createElement('div')
        createMountTarget().append(el)

        let result
        wrapper = mount(
          defineComponent({
            setup() {
              result = useSoftFullscreen({ target: el, fullscreen: true })
              return () => h('div')
            }
          })
        )

        expect(el.parentElement).toBe(document.body)

        result.exitFullscreen()
        expect(el.parentElement).toBe(mountTarget)
      })

      test('works outside of a component instance', () => {
        const el = document.createElement('div')
        createMountTarget().append(el)

        const { inFullscreen, setFullscreen, exitFullscreen } =
          useSoftFullscreen({
            target: el
          })

        setFullscreen()
        expect(inFullscreen.value).toBe(true)
        expect(el.parentElement).toBe(document.body)
        expect(bodyHasFullscreenClass()).toBe(true)

        exitFullscreen()
        expect(inFullscreen.value).toBe(false)
        expect(el.parentElement).toBe(mountTarget)
        expect(bodyHasFullscreenClass()).toBe(false)
      })

      test('follows a target ref pointing to another element', () => {
        let target
        let result
        wrapper = mount(
          defineComponent({
            setup() {
              target = ref(null)
              result = useSoftFullscreen(() => ({ target, fullscreen: true }))
              return () =>
                h('div', [
                  h('section', { ref: target, 'data-test': 'first' }),
                  h('section', { 'data-test': 'second' })
                ])
            }
          }),
          { attachTo: createMountTarget() }
        )
        const root = wrapper.element
        const first = document.querySelector('[data-test="first"]')
        const second = document.querySelector('[data-test="second"]')

        expect(first.parentElement).toBe(document.body)

        target.value = second

        // the old element is back in place, the new one took over
        expect(first.parentElement).toBe(root)
        expect(second.parentElement).toBe(document.body)
        expect(result.inFullscreen.value).toBe(true)
        expect(root.children).toHaveLength(2)

        result.exitFullscreen()
        expect(root.children).toHaveLength(2)
        expect([...root.children]).toStrictEqual([first, second])
      })

      test('leaves fullscreen when the target goes away', async () => {
        const show = ref(true)
        let target
        let result
        wrapper = mount(
          defineComponent({
            setup() {
              target = ref(null)
              result = useSoftFullscreen({ target })
              return () =>
                h('div', [show.value ? h('section', { ref: target }) : null])
            }
          }),
          { attachTo: createMountTarget() }
        )
        const root = wrapper.element
        const el = root.firstElementChild

        result.setFullscreen()
        expect(el.parentElement).toBe(document.body)

        show.value = false
        await nextTick()

        // the removed element is not put back, and its filler is gone
        expect(result.inFullscreen.value).toBe(false)
        expect(el.isConnected).toBe(false)
        expect(root.children).toHaveLength(0)
        expect(bodyHasFullscreenClass()).toBe(false)
      })

      test('keeps the body class while another element is still fullscreen', () => {
        const first = mountRootAndTarget()
        const el = document.createElement('div')
        document.body.append(el)
        const second = useSoftFullscreen({ target: el })

        first.setFullscreen()
        second.setFullscreen()
        expect(bodyHasFullscreenClass()).toBe(true)

        first.exitFullscreen()
        expect(bodyHasFullscreenClass()).toBe(true)

        second.exitFullscreen()
        expect(bodyHasFullscreenClass()).toBe(false)

        el.remove()
      })

      test('restores the page scroll position after the last exit', async () => {
        const scrollTo = vi
          .spyOn(window, 'scrollTo')
          .mockImplementation(() => {})
        vi.spyOn(window, 'scrollY', 'get').mockReturnValue(120)
        vi.spyOn(window, 'scrollX', 'get').mockReturnValue(30)
        const { setFullscreen, exitFullscreen } = mountRootAndTarget()

        setFullscreen()
        exitFullscreen()

        await vi.waitFor(() => {
          expect(scrollTo).toHaveBeenCalledWith(30, 120)
        })
      })

      test('exits on a route change unless noRouteExit is set', async () => {
        const router = await getRouter(['/a', '/b'])
        const noRouteExit = ref(false)
        const { inFullscreen, setFullscreen } = mountRootAndTarget(
          () => ({ noRouteExit: noRouteExit.value }),
          { global: { plugins: [router] } }
        )

        setFullscreen()
        expect(inFullscreen.value).toBe(true)

        await router.push('/a')
        await flushPromises()
        expect(inFullscreen.value).toBe(false)

        noRouteExit.value = true
        setFullscreen()

        await router.push('/b')
        await flushPromises()
        expect(inFullscreen.value).toBe(true)
      })

      test('leaves fullscreen on unmount', () => {
        const { target, setFullscreen } = mountRootAndTarget()

        setFullscreen()
        expect(target.parentElement).toBe(document.body)

        wrapper.unmount()
        wrapper = void 0

        expect(target.isConnected).toBe(false)
        expect(document.body.contains(target)).toBe(false)
        expect(bodyHasFullscreenClass()).toBe(false)
        expect(focusIsInDetachedFullscreen(mountTarget, target)).toBe(false)
      })

      test('leaves fullscreen on deactivation and re-enters when requested', async () => {
        const show = ref(true)
        const fullscreen = ref(true)
        let result

        // the fullscreen element sits inside the cached root, which
        // KeepAlive moves in and out of its storage
        const Cached = defineComponent({
          name: 'Cached',
          setup() {
            const target = ref(null)
            result = useSoftFullscreen(() => ({
              target,
              fullscreen: fullscreen.value
            }))
            return () =>
              h('main', { 'data-test': 'main' }, [
                h('div', { ref: target, 'data-test': 'cached' })
              ])
          }
        })
        const Other = defineComponent({
          name: 'Other',
          setup: () => () => h('div', { 'data-test': 'other' })
        })

        wrapper = mount(
          defineComponent({
            setup: () => () =>
              h(KeepAlive, null, () => (show.value ? h(Cached) : h(Other)))
          }),
          { attachTo: createMountTarget() }
        )

        const getCached = () =>
          document.body.querySelector('[data-test="cached"]')
        const getMain = () => document.body.querySelector('[data-test="main"]')

        expect(getCached().parentElement).toBe(document.body)

        show.value = false
        await flushPromises()

        // the element followed its cached root out of the document
        expect(getCached()).toBeNull()
        expect(result.inFullscreen.value).toBe(false)
        expect(bodyHasFullscreenClass()).toBe(false)

        show.value = true
        await flushPromises()

        expect(getCached().parentElement).toBe(document.body)
        expect(result.inFullscreen.value).toBe(true)

        // an imperative state is not resumed
        fullscreen.value = false
        expect(getCached().parentElement).toBe(getMain())

        result.toggleFullscreen()
        expect(result.inFullscreen.value).toBe(true)

        show.value = false
        await flushPromises()
        show.value = true
        await flushPromises()

        expect(result.inFullscreen.value).toBe(false)
        expect(getCached().parentElement).toBe(getMain())
      })

      test('keeps focus on an input through enter and exit', () => {
        let result
        wrapper = mount(
          defineComponent({
            setup() {
              result = useSoftFullscreen()
              return () => h('div', [h('input', { 'data-test': 'input' })])
            }
          }),
          { attachTo: createMountTarget() }
        )

        const input = wrapper.element.firstElementChild
        input.value = 'abc'
        input.focus()
        input.setSelectionRange(1, 2)

        result.setFullscreen()

        expect(document.activeElement).toBe(input)
        expect(input.selectionStart).toBe(1)
        expect(input.selectionEnd).toBe(2)

        result.exitFullscreen()

        expect(document.activeElement).toBe(input)
        expect(input.selectionStart).toBe(1)
        expect(input.selectionEnd).toBe(2)
      })
    })
  })
})
