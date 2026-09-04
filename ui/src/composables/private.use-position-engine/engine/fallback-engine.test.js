import { afterEach, describe, expect, test, vi } from 'vitest'
import { computed, ref } from 'vue'

import { client } from '../../../plugins/platform/Platform.js'
import { parsePosition } from './core.js'
import {
  applyPosition,
  trackAnchorMotion,
  useFallbackEngine
} from './fallback-engine.js'

const nodes = []
const restoreFns = []

afterEach(() => {
  nodes.splice(0).forEach(node => node.remove())
  restoreFns.splice(0).forEach(fn => fn())
  vi.restoreAllMocks()
  vi.useRealTimers()

  document.body.style.removeProperty('--q-pe-left')
  document.body.style.removeProperty('--q-pe-top')
})

/**
 * Stubs a property that cannot be driven for real (e.g. the visual viewport
 * offsets, which only change on a pinch-zoom); the undo is registered for
 * the next test.
 */
function mockProperty(target, key, value) {
  const descriptor = Object.getOwnPropertyDescriptor(target, key)

  Object.defineProperty(target, key, {
    configurable: true,
    writable: true,
    value
  })

  restoreFns.push(() => {
    if (descriptor === void 0) delete target[key]
    else Object.defineProperty(target, key, descriptor)
  })
}

/**
 * Creates a real fixed-positioned element so the engine measures it through
 * the actual layout engine (bottom/right/middle/center all derive from it).
 */
function createAnchor({ top, left, width, height }) {
  const el = document.createElement('div')

  Object.assign(el.style, {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`
  })

  document.body.append(el)
  nodes.push(el)
  return el
}

function createTarget({ width = 150, height = 50 } = {}) {
  const el = document.createElement('div')

  Object.assign(el.style, {
    position: 'fixed',
    width: `${width}px`,
    height: `${height}px`
  })

  document.body.append(el)
  nodes.push(el)
  return el
}

/**
 * Builds a config where the anchor is a real 100x30 box at (100, 100) and
 * the target a real 150x50 one, laid out in the actual viewport. The
 * origins arrive decision-resolved, exactly like the components pass them.
 */
function createConfig({
  anchorRect = { top: 100, left: 100, width: 100, height: 30 },
  targetSize,
  ...cfg
} = {}) {
  return {
    anchorEl: createAnchor(anchorRect),
    targetEl: createTarget(targetSize),
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    selfOrigin: { vertical: 'top', horizontal: 'left' },
    ...cfg
  }
}

describe('[fallbackEngine API]', () => {
  describe('[Functions]', () => {
    describe('[(function)applyPosition]', () => {
      test('places the target right under the anchor', () => {
        const cfg = createConfig()

        applyPosition(cfg)

        const rect = cfg.targetEl.getBoundingClientRect()
        expect(rect.top).toBe(130)
        expect(rect.left).toBe(100)
        expect(cfg.targetEl.style.top).toBe('130px')
        expect(cfg.targetEl.style.bottom).toBe('')
        expect(cfg.targetEl.style.right).toBe('')
        expect(cfg.targetEl.style.translate).toBe('')
        expect(cfg.targetEl.style.visibility).toBe('visible')
      })

      test('hangs a bottom/right self origin from bottom/right insets', () => {
        // like the native engine's anchor() insets, so content growing
        // between two passes grows away from the anchor line instead of
        // over it
        const { clientWidth: viewportWidth, clientHeight: viewportHeight } =
          document.documentElement
        const cfg = createConfig({
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          selfOrigin: { vertical: 'bottom', horizontal: 'right' }
        })

        applyPosition(cfg)

        const { style } = cfg.targetEl
        expect(style.bottom).toBe(`${viewportHeight - 130}px`)
        expect(style.right).toBe(`${viewportWidth - 200}px`)
        expect(style.top).toBe('')
        expect(style.left).toBe('')

        // content grows without another pass
        style.height = '120px'
        style.width = '300px'

        const rect = cfg.targetEl.getBoundingClientRect()
        expect(rect.bottom).toBe(130)
        expect(rect.right).toBe(200)
        expect(rect.top).toBe(10)
      })

      test('straddles the anchor line through a translate when centered', () => {
        // anchor-center / -50% translate natively: growth keeps the center
        const cfg = createConfig({
          anchorOrigin: { vertical: 'center', horizontal: 'middle' },
          selfOrigin: { vertical: 'center', horizontal: 'middle' }
        })

        applyPosition(cfg)

        const { style } = cfg.targetEl
        expect(style.translate).toBe('-50% -50%')
        // anchor center at (150, 115)
        expect(style.top).toBe('115px')
        expect(style.left).toBe('150px')

        style.height = '120px'
        style.width = '300px'

        const rect = cfg.targetEl.getBoundingClientRect()
        expect(rect.top + rect.height / 2).toBe(115)
        expect(rect.left + rect.width / 2).toBe(150)
      })

      test('clears the insets of a previous pass when the self origin changes', () => {
        const cfg = createConfig({
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          selfOrigin: { vertical: 'bottom', horizontal: 'right' }
        })

        applyPosition(cfg)
        applyPosition({
          ...cfg,
          anchorOrigin: { vertical: 'bottom', horizontal: 'middle' },
          selfOrigin: { vertical: 'top', horizontal: 'middle' }
        })

        const { style } = cfg.targetEl
        expect(style.bottom).toBe('')
        expect(style.right).toBe('')
        expect(style.top).toBe('130px')
        expect(style.left).toBe('150px')
        // '-50% 0', serialized
        expect(style.translate).toBe('-50%')
      })

      test('honors the resolved anchor and self origins', () => {
        const cfg = createConfig({
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          selfOrigin: { vertical: 'bottom', horizontal: 'right' }
        })

        applyPosition(cfg)

        const rect = cfg.targetEl.getBoundingClientRect()
        // target bottom at 130, right at 200
        expect(rect.top).toBe(80)
        expect(rect.left).toBe(50)
      })

      test('offsets the anchor when an offset is supplied', () => {
        const cfg = createConfig({ offset: [5, 10] })

        applyPosition(cfg)

        const rect = cfg.targetEl.getBoundingClientRect()
        expect(rect.top).toBe(140)
        expect(rect.left).toBe(95)
      })

      test('expresses the placement even off-screen, with no re-clamping', () => {
        const cfg = createConfig({
          anchorRect: { top: -200, left: 100, width: 100, height: 30 }
        })

        applyPosition(cfg)

        // the popup follows the anchor out instead of staying visible
        expect(cfg.targetEl.getBoundingClientRect().top).toBe(-170)
      })

      test('applies the decision caps on top of the prop max sizes', () => {
        const cfg = createConfig({
          anchorOrigin: { vertical: 'top', horizontal: 'left' },
          selfOrigin: { vertical: 'bottom', horizontal: 'left' },
          capHeight: '40px'
        })

        applyPosition(cfg)

        expect(cfg.targetEl.style.maxHeight).toBe('40px')

        // the capped (40px) box hangs from the anchor's top edge
        const rect = cfg.targetEl.getBoundingClientRect()
        expect(rect.height).toBe(40)
        expect(rect.top).toBe(60)
      })

      test('clamps a centered popup on a decision pass (anchor-center parity)', () => {
        const cfg = createConfig({
          anchorRect: { top: 100, left: 0, width: 40, height: 30 },
          anchorOrigin: { vertical: 'bottom', horizontal: 'middle' },
          selfOrigin: { vertical: 'top', horizontal: 'middle' }
        })

        const shift = applyPosition(cfg)

        // centered on x=20 the 150px target would start at -55; native
        // anchor-center clamps it to the edge at layout time
        expect(cfg.targetEl.getBoundingClientRect().left).toBe(0)
        expect(shift).toStrictEqual({ top: 0, left: 55 })
      })

      test('tracking re-applies the frozen center shift instead of re-clamping', () => {
        const cfg = createConfig({
          anchorOrigin: { vertical: 'center', horizontal: 'middle' },
          selfOrigin: { vertical: 'center', horizontal: 'middle' }
        })

        // decision pass over an on-screen anchor: nothing to shift
        const shift = applyPosition(cfg)
        expect(shift).toStrictEqual({ top: 0, left: 0 })

        // the anchor scrolls far off-screen; a tracking pass keeps the
        // frozen shift, so the popup follows instead of staying visible
        // (native anchor-center only translates with the scroll too)
        cfg.anchorEl.style.top = '-500px'
        applyPosition({ ...cfg, centerShift: shift })

        // anchor center at -485, target height 50
        expect(cfg.targetEl.getBoundingClientRect().top).toBe(-510)
      })

      test('does not clamp a centered self origin on an edge line', () => {
        const cfg = createConfig({
          anchorRect: { top: 100, left: 0, width: 40, height: 30 },
          anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
          selfOrigin: { vertical: 'top', horizontal: 'middle' }
        })

        applyPosition(cfg)

        // the native path uses a plain -50% translate here, unclamped
        expect(cfg.targetEl.getBoundingClientRect().left).toBe(-75)
      })

      test('matches the anchor width when fitting', () => {
        const cfg = createConfig({
          anchorRect: { top: 100, left: 100, width: 300, height: 30 },
          fit: true
        })

        applyPosition(cfg)

        expect(cfg.targetEl.style.minWidth).toBe('300px')
        expect(cfg.targetEl.getBoundingClientRect().width).toBe(300)
      })

      test('matches the anchor box and drops the offset when covering', () => {
        const cfg = createConfig({
          anchorRect: { top: 100, left: 100, width: 300, height: 80 },
          cover: true,
          offset: [10, 10]
        })

        applyPosition(cfg)

        const rect = cfg.targetEl.getBoundingClientRect()
        expect(rect.width).toBe(300)
        expect(rect.height).toBe(80)
        // the offset is ignored while covering
        expect(rect.top).toBe(180)
      })

      test('anchors a point popup to the coordinates inside the anchor', () => {
        const cfg = createConfig({
          point: { top: 20, left: 30 }
        })

        applyPosition(cfg)

        const rect = cfg.targetEl.getBoundingClientRect()
        expect(rect.top).toBe(120)
        expect(rect.left).toBe(130)
      })

      test('mirrors a point popup around the coordinates when the self origin says so', () => {
        const cfg = createConfig({
          point: { top: 20, left: 30 },
          selfOrigin: { vertical: 'bottom', horizontal: 'right' }
        })

        applyPosition(cfg)

        const rect = cfg.targetEl.getBoundingClientRect()
        expect(rect.bottom).toBe(120)
        expect(rect.right).toBe(130)
      })

      test('offsets a point popup the way it grows', () => {
        // growing up/left, so the offset has to clear the point in the
        // negative direction or the popup opens onto the pointer
        const cfg = createConfig({
          point: { top: 20, left: 30 },
          selfOrigin: { vertical: 'bottom', horizontal: 'right' },
          offset: [5, 10]
        })

        applyPosition(cfg)

        const rect = cfg.targetEl.getBoundingClientRect()
        expect(rect.bottom).toBe(110)
        expect(rect.right).toBe(125)
      })

      test('offsets a centered point popup in the positive direction', () => {
        const cfg = createConfig({
          point: { top: 20, left: 30 },
          selfOrigin: { vertical: 'center', horizontal: 'middle' },
          offset: [5, 10]
        })

        applyPosition(cfg)

        // the 150x50 target centered on (135, 130)
        const rect = cfg.targetEl.getBoundingClientRect()
        expect(rect.top).toBe(105)
        expect(rect.left).toBe(60)
      })

      test('publishes the iOS visual viewport offsets as CSS variables', () => {
        mockProperty(client.is, 'ios', true)
        mockProperty(window.visualViewport, 'offsetLeft', 5)
        mockProperty(window.visualViewport, 'offsetTop', 7)

        applyPosition(createConfig())

        expect(document.body.style.getPropertyValue('--q-pe-left')).toBe('5px')
        expect(document.body.style.getPropertyValue('--q-pe-top')).toBe('7px')
      })

      test('shifts an inset by the published offsets whichever edge it is written from', () => {
        // the q-position-engine class turns the offsets into margins; an
        // inset written from the end edge needs the mirrored margin
        document.body.style.setProperty('--q-pe-left', '5px')
        document.body.style.setProperty('--q-pe-top', '7px')

        const cfg = createConfig()
        cfg.targetEl.classList.add('q-position-engine')

        applyPosition(cfg)

        let rect = cfg.targetEl.getBoundingClientRect()
        expect(rect.top).toBe(137)
        expect(rect.left).toBe(105)

        applyPosition({
          ...cfg,
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          selfOrigin: { vertical: 'bottom', horizontal: 'right' }
        })

        rect = cfg.targetEl.getBoundingClientRect()
        expect(rect.bottom).toBe(137)
        expect(rect.right).toBe(205)
      })
    })
    describe('[(function)trackAnchorMotion]', () => {
      const sleep = ms =>
        new Promise(resolve => {
          setTimeout(resolve, ms)
        })

      test('has correct return value', () => {
        const el = createAnchor({ top: 100, left: 100, width: 100, height: 30 })
        const result = trackAnchorMotion(
          () => el,
          () => {},
          100
        )

        expect(result).toBeTypeOf('function')
        result()
      })

      test('invokes onMove when the anchor moves within the duration', async () => {
        const el = createAnchor({ top: 100, left: 100, width: 100, height: 30 })
        const onMove = vi.fn()

        trackAnchorMotion(() => el, onMove, 500)
        el.style.top = '110px'

        await vi.waitFor(() => expect(onMove).toHaveBeenCalled())
      })

      test('accepts a String duration (transition-duration prop contract)', async () => {
        const el = createAnchor({ top: 100, left: 100, width: 100, height: 30 })
        const onMove = vi.fn()

        trackAnchorMotion(() => el, onMove, '500')
        await sleep(50)
        el.style.left = '120px'

        await vi.waitFor(() => expect(onMove).toHaveBeenCalled())
      })

      test('does not invoke onMove for a static anchor', async () => {
        const el = createAnchor({ top: 100, left: 100, width: 100, height: 30 })
        const onMove = vi.fn()

        trackAnchorMotion(() => el, onMove, 100)
        await sleep(150)

        expect(onMove).not.toHaveBeenCalled()
      })

      test('stops watching once the duration window ends', async () => {
        const el = createAnchor({ top: 100, left: 100, width: 100, height: 30 })
        const onMove = vi.fn()

        trackAnchorMotion(() => el, onMove, 50)
        await sleep(120)
        el.style.top = '150px'
        await sleep(100)

        expect(onMove).not.toHaveBeenCalled()
      })

      test('the returned stop function ends the tracking', async () => {
        const el = createAnchor({ top: 100, left: 100, width: 100, height: 30 })
        const onMove = vi.fn()

        const stop = trackAnchorMotion(() => el, onMove, 500)
        stop()
        el.style.top = '150px'
        await sleep(100)

        expect(onMove).not.toHaveBeenCalled()
      })

      test('ends itself when the anchor leaves the DOM', async () => {
        const el = createAnchor({ top: 100, left: 100, width: 100, height: 30 })
        const onMove = vi.fn()

        trackAnchorMotion(() => el, onMove, 500)
        el.remove()
        await sleep(50)

        // even moving a re-attached anchor cannot revive the ended loop
        document.body.append(el)
        el.style.top = '150px'
        await sleep(100)

        expect(onMove).not.toHaveBeenCalled()
      })
    })

    describe('[(function)useFallbackEngine]', () => {
      const props = {
        offset: void 0,
        maxHeight: null,
        maxWidth: null,
        transitionDuration: 0
      }

      function createEngine({
        anchorEl = null,
        target = null,
        anchor = 'bottom left',
        self = 'top left',
        trackContent = false
      } = {}) {
        return useFallbackEngine(props, {
          anchorEl: ref(anchorEl),
          innerRef: ref(target),
          showing: ref(true),
          anchorOrigin: computed(() => parsePosition(anchor, false)),
          selfOrigin: computed(() => parsePosition(self, false)),
          trackContent
        })
      }

      test('has correct return value', () => {
        const engine = createEngine()

        expect(engine).toStrictEqual({
          positionStyle: { value: '' },
          track: expect.any(Function),
          updatePosition: expect.any(Function),
          setAnchorPoint: expect.any(Function),
          handleShow: expect.any(Function),
          handleTick: expect.any(Function),
          releaseAnchor: expect.any(Function)
        })
      })

      test('positions on the tick and re-expresses the placement on scroll', () => {
        const anchorEl = createAnchor({
          top: 100,
          left: 100,
          width: 100,
          height: 30
        })
        const target = createTarget()
        const engine = createEngine({ anchorEl, target })

        engine.handleShow()
        engine.handleTick()

        let rect = target.getBoundingClientRect()
        expect(rect.top).toBe(130)
        expect(rect.left).toBe(100)
        expect(target.style.visibility).toBe('visible')

        anchorEl.style.top = '200px'
        document.dispatchEvent(new Event('scroll'))
        rect = target.getBoundingClientRect()
        expect(rect.top).toBe(230)

        // the leave transition still tracks; done hiding stops it
        engine.releaseAnchor(true)
        anchorEl.style.top = '100px'
        document.dispatchEvent(new Event('scroll'))
        expect(target.getBoundingClientRect().top).toBe(130)

        engine.releaseAnchor(false)
        anchorEl.style.top = '200px'
        document.dispatchEvent(new Event('scroll'))
        expect(target.getBoundingClientRect().top).toBe(130)
      })

      test('re-expresses the placement on content changes when asked to', async () => {
        const anchorEl = createAnchor({
          top: 100,
          left: 100,
          width: 100,
          height: 30
        })
        const target = createTarget()
        target.style.width = 'max-content'
        target.textContent = 'content'

        const engine = createEngine({
          anchorEl,
          target,
          anchor: 'bottom middle',
          self: 'top middle',
          trackContent: true
        })

        engine.handleShow()
        engine.handleTick()

        // the content pass re-expresses the placement against the
        // anchor's CURRENT rect (the centering itself is CSS)
        anchorEl.style.left = '200px'
        const { width } = target.getBoundingClientRect()
        target.textContent = 'content that got quite a bit wider'

        await vi.waitFor(() => {
          const rect = target.getBoundingClientRect()
          expect(rect.width).toBeGreaterThan(width)
          expect(rect.left + rect.width / 2).toBeCloseTo(250, 0)
        })

        engine.releaseAnchor(false)
      })
    })
  })
})
