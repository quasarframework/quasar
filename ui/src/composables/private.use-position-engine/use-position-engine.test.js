import { afterEach, describe, expect, test, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { computed, defineComponent, h, nextTick, ref } from 'vue'

import useQuasar from '../use-quasar/use-quasar.js'
import useAnchor, {
  useAnchorStaticProps
} from '../private.use-anchor/use-anchor.js'
import { parsePosition } from './engine/core.js'
import usePositionEngine from './use-position-engine.js'

// the test browser is a Chromium, so the composable takes the CSS anchor
// positioning path by default; flipping this flag before mounting forces
// the JS positioning fallback of non-supporting browsers instead
const engineOverride = vi.hoisted(() => ({ forceJsFallback: false }))

vi.mock('./engine/core.js', async importOriginal => {
  const mod = await importOriginal()
  return {
    ...mod,
    supportsCssAnchor: () =>
      engineOverride.forceJsFallback ? false : mod.supportsCssAnchor()
  }
})

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
  engineOverride.forceJsFallback = false
  vi.useRealTimers()
})

const anchorBox = { top: 100, left: 100, width: 200, height: 100 }

/**
 * A minimal popup: the composable driving a fixed box rendered inside a
 * pinned anchor (100,100 / 200x100, so its center is at 200,150).
 */
function mountPopup({
  trackContent = false,
  popupProps = {},
  popupStyle = {}
} = {}) {
  let engine, anchorEl
  const showing = ref(false)
  const innerRef = ref(null)
  const content = ref('content')

  const Popup = defineComponent({
    props: {
      ...useAnchorStaticProps,
      anchor: { type: String, default: 'bottom middle' },
      self: { type: String, default: 'top middle' },
      offset: { type: Array, default: () => [0, 0] },
      maxHeight: { type: String, default: null },
      maxWidth: { type: String, default: null },
      transitionDuration: { type: Number, default: 0 }
    },

    setup(props) {
      const $q = useQuasar()
      ;({ anchorEl } = useAnchor({ showing }))

      engine = usePositionEngine({
        props,
        $q,
        anchorEl,
        innerRef,
        showing,
        anchorOrigin: computed(() => parsePosition(props.anchor, $q.lang.rtl)),
        selfOrigin: computed(() => parsePosition(props.self, $q.lang.rtl)),
        trackContent
      })

      return () =>
        showing.value
          ? h(
              'div',
              {
                ref: innerRef,
                class: engine.viaCssAnchor ? '' : 'q-position-engine',
                style: [
                  { position: 'fixed', width: 'max-content' },
                  popupStyle,
                  engine.positionStyle.value
                ]
              },
              content.value
            )
          : null
    }
  })

  wrapper = mount(
    defineComponent({
      props: { popupProps: Object },
      setup: props => () =>
        h(
          'div',
          {
            class: 'anchor',
            style: {
              position: 'fixed',
              top: anchorBox.top + 'px',
              left: anchorBox.left + 'px',
              width: anchorBox.width + 'px',
              height: anchorBox.height + 'px'
            }
          },
          [h(Popup, props.popupProps)]
        )
    }),
    { props: { popupProps } }
  )

  return {
    get engine() {
      return engine
    },
    get anchorEl() {
      return anchorEl
    },
    anchor: wrapper.get('.anchor').element,
    content,
    async show(pointEvt) {
      showing.value = true
      engine.handleShow(pointEvt)
      await nextTick()
      engine.handleTick()
      await flushPromises()
      return innerRef.value
    },
    async hide() {
      showing.value = false
      engine.releaseAnchor(true)
      await nextTick()
      engine.releaseAnchor(false)
    }
  }
}

function expectPlacedAt(el, { top, centerX }) {
  const rect = el.getBoundingClientRect()
  expect(rect.top).toBeCloseTo(top, 0)
  expect(rect.left + rect.width / 2).toBeCloseTo(centerX, 0)
}

describe('[usePositionEngine API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', async () => {
        const popup = mountPopup()

        expect(popup.engine).toStrictEqual({
          viaCssAnchor: expect.any(Boolean),
          positionStyle: expect.any(Object),
          updatePosition: expect.any(Function),
          handleTick: expect.any(Function),
          track: popup.engine.viaCssAnchor ? void 0 : expect.any(Function),
          handleShow: expect.any(Function),
          releaseAnchor: expect.any(Function)
        })

        // the anchor's bottom middle line, then visible
        const el = await popup.show()
        expectPlacedAt(el, { top: 200, centerX: 200 })
        expect(getComputedStyle(el).visibility).toBe('visible')
      })

      test('borrows the anchor for the native engine while shown', async () => {
        const popup = mountPopup()
        const { anchor } = popup

        await popup.show()
        expect(popup.engine.viaCssAnchor).toBe(true)
        expect(anchor.style.getPropertyValue('anchor-name')).toMatch(/^--q-/)

        // held through the leave transition, released once it is done
        popup.engine.releaseAnchor(true)
        expect(anchor.style.getPropertyValue('anchor-name')).toMatch(/^--q-/)

        popup.engine.releaseAnchor(false)
        expect(anchor.style.getPropertyValue('anchor-name')).toBe('')
      })

      test('opens at the coordinates of the given event', async () => {
        const popup = mountPopup()

        const el = await popup.show(
          new PointerEvent('click', { clientX: 250, clientY: 150 })
        )

        expectPlacedAt(el, { top: 150, centerX: 250 })

        // a coordinate-less event keeps the anchor-relative placement
        await popup.hide()
        const el2 = await popup.show(new KeyboardEvent('keydown'))

        expectPlacedAt(el2, { top: 200, centerX: 200 })
      })

      test('re-decides the placement on placement prop changes', async () => {
        const popup = mountPopup()

        const el = await popup.show()
        expectPlacedAt(el, { top: 200, centerX: 200 })

        await wrapper.setProps({
          popupProps: { anchor: 'top middle', self: 'bottom middle' }
        })
        await flushPromises()

        const rect = el.getBoundingClientRect()
        expect(rect.bottom).toBeCloseTo(100, 0)
      })

      test('re-expresses the placement on scroll on the JS fallback', async () => {
        engineOverride.forceJsFallback = true
        const popup = mountPopup()

        const el = await popup.show()
        expect(popup.engine.viaCssAnchor).toBe(false)
        expectPlacedAt(el, { top: 200, centerX: 200 })

        popup.anchor.style.top = '300px'
        document.dispatchEvent(new Event('scroll'))
        expectPlacedAt(el, { top: 400, centerX: 200 })

        // the leave transition still tracks; done hiding stops it
        popup.engine.releaseAnchor(true)
        popup.anchor.style.top = '100px'
        document.dispatchEvent(new Event('scroll'))
        expectPlacedAt(el, { top: 200, centerX: 200 })

        popup.engine.releaseAnchor(false)
        popup.anchor.style.top = '300px'
        document.dispatchEvent(new Event('scroll'))
        expectPlacedAt(el, { top: 200, centerX: 200 })
      })

      test('re-expresses the placement on content changes when asked to', async () => {
        engineOverride.forceJsFallback = true
        const popup = mountPopup({ trackContent: true })

        const el = await popup.show()
        expectPlacedAt(el, { top: 200, centerX: 200 })
        const { width } = el.getBoundingClientRect()

        popup.content.value = 'content that got quite a bit wider'
        await nextTick()

        await vi.waitFor(() => {
          const rect = el.getBoundingClientRect()
          expect(rect.width).toBeGreaterThan(width)
          expect(rect.left + rect.width / 2).toBeCloseTo(200, 0)
        })
      })
    })
  })

  describe('[Generic]', () => {
    function createAnchor(style) {
      const el = document.createElement('div')
      Object.assign(el.style, { position: 'fixed', ...style })
      document.body.append(el)
      return el
    }

    describe('anchor bookkeeping', () => {
      test('a re-show during the leave transition keeps the anchor name and releases it once', async () => {
        const popup = mountPopup()
        const { anchor, engine } = popup

        await popup.show()
        const name = anchor.style.getPropertyValue('anchor-name')
        expect(name).toMatch(/^--q-/)

        // hide, then show again before the leave transition ended
        engine.releaseAnchor(true)
        await popup.show()
        expect(anchor.style.getPropertyValue('anchor-name')).toBe(name)

        // the second hide runs the full teardown
        await popup.hide()
        expect(anchor.style.getPropertyValue('anchor-name')).toBe('')

        // nothing left to release
        engine.releaseAnchor(false)
        expect(anchor.style.getPropertyValue('anchor-name')).toBe('')
      })

      test('switching anchors between shows releases the previous one', async () => {
        const popup = mountPopup()
        const { anchor, engine } = popup
        // before the popup in tree order, like a portal's anchor always is
        // (an anchor that comes later is not one the browser accepts)
        const other = createAnchor({
          top: '300px',
          left: '300px',
          width: '100px',
          height: '50px'
        })
        document.body.prepend(other)

        try {
          await popup.show()
          expect(anchor.style.getPropertyValue('anchor-name')).toMatch(/^--q-/)

          engine.releaseAnchor(true)
          popup.anchorEl.value = other
          const el = await popup.show()

          expect(anchor.style.getPropertyValue('anchor-name')).toBe('')
          expect(other.style.getPropertyValue('anchor-name')).toMatch(/^--q-/)
          expectPlacedAt(el, { top: 350, centerX: 350 })

          await popup.hide()
          expect(other.style.getPropertyValue('anchor-name')).toBe('')
        } finally {
          other.remove()
        }
      })

      test('teardown and repositioning are no-ops before any show', () => {
        const popup = mountPopup()

        expect(() => {
          popup.engine.updatePosition()
          popup.engine.releaseAnchor(true)
          popup.engine.releaseAnchor(false)
        }).not.toThrow()
        expect(popup.anchor.style.getPropertyValue('anchor-name')).toBe('')
      })
    })

    describe('JS fallback', () => {
      test('retries a decision on content that has no size yet', async () => {
        vi.useFakeTimers()
        engineOverride.forceJsFallback = true
        const popup = mountPopup({ popupStyle: { display: 'none' } })

        const el = await popup.show()
        expect(el.style.top).toBe('')

        // measurable from the third attempt on
        await vi.advanceTimersByTimeAsync(20)
        el.style.display = 'block'
        await vi.advanceTimersByTimeAsync(10)

        expectPlacedAt(el, { top: 200, centerX: 200 })
      })

      test('gives up on content that never gets a size', async () => {
        vi.useFakeTimers()
        engineOverride.forceJsFallback = true
        const popup = mountPopup({ popupStyle: { display: 'none' } })

        const el = await popup.show()
        await vi.advanceTimersByTimeAsync(1000)

        expect(vi.getTimerCount()).toBe(0)
        expect(el.style.top).toBe('')

        // a later explicit pass starts over
        el.style.display = 'block'
        popup.engine.updatePosition()
        expectPlacedAt(el, { top: 200, centerX: 200 })
      })

      test('ignores scrolls that happen inside the popup itself', async () => {
        engineOverride.forceJsFallback = true
        const popup = mountPopup()

        const el = await popup.show()
        const inner = document.createElement('div')
        el.append(inner)

        popup.anchor.style.top = '300px'
        inner.dispatchEvent(new Event('scroll', { bubbles: true }))
        expectPlacedAt(el, { top: 200, centerX: 200 })

        document.dispatchEvent(new Event('scroll'))
        expectPlacedAt(el, { top: 400, centerX: 200 })
      })

      test('stops following content changes once hidden', async () => {
        engineOverride.forceJsFallback = true
        const popup = mountPopup({ trackContent: true })

        const el = await popup.show()
        popup.engine.releaseAnchor(true)
        popup.engine.releaseAnchor(false)

        const { left } = el.getBoundingClientRect()
        popup.content.value = 'content that got quite a bit wider'
        await nextTick()
        await new Promise(resolve => {
          setTimeout(resolve, 30)
        })

        expect(el.getBoundingClientRect().left).toBe(left)
      })
    })

    describe('point mode re-decision', () => {
      // the anchor sits at the viewport bottom; a popup opening below the
      // pointer overflows and mirrors above it
      async function showFlippedAtBottom() {
        const popup = mountPopup({ popupStyle: { height: '100px' } })
        popup.anchor.style.top = '700px'

        const el = await popup.show(
          new PointerEvent('click', { clientX: 250, clientY: 750 })
        )

        expect(el.getBoundingClientRect().bottom).toBeCloseTo(750, 0)
        return { popup, el }
      }

      // like box mode, the decision restarts from the intended placement:
      // once there is room below the pointer again, the popup opens there
      async function expectFlipBack({ popup, el }) {
        popup.anchor.style.top = '100px'
        popup.engine.updatePosition()
        await flushPromises()

        expectPlacedAt(el, { top: 150, centerX: 250 })
      }

      test('returns to the intended side once it fits (native)', async () => {
        await expectFlipBack(await showFlippedAtBottom())
      })

      test('returns to the intended side once it fits (JS fallback)', async () => {
        engineOverride.forceJsFallback = true
        await expectFlipBack(await showFlippedAtBottom())
      })

      // a centered axis shifts inside the viewport instead of mirroring;
      // the shift must not stick to the pointer coordinates
      async function showShiftedAtRightEdge() {
        const popup = mountPopup({
          popupProps: { self: 'center middle' },
          popupStyle: { width: '200px' }
        })
        popup.anchor.style.left = '1000px'

        const el = await popup.show(
          new PointerEvent('click', { clientX: 1190, clientY: 150 })
        )

        const rect = el.getBoundingClientRect()
        expect(rect.right).toBeCloseTo(document.documentElement.clientWidth, 0)
        return { popup, el }
      }

      async function expectRecentered({ popup, el }) {
        popup.anchor.style.left = '500px'
        popup.engine.updatePosition()
        await flushPromises()

        const rect = el.getBoundingClientRect()
        expect(rect.top + rect.height / 2).toBeCloseTo(150, 0)
        expect(rect.left + rect.width / 2).toBeCloseTo(690, 0)
      }

      test('re-centers on the pointer once there is room (native)', async () => {
        await expectRecentered(await showShiftedAtRightEdge())
      })

      test('re-centers on the pointer once there is room (JS fallback)', async () => {
        engineOverride.forceJsFallback = true
        await expectRecentered(await showShiftedAtRightEdge())
      })
    })
  })
})
