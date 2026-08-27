import { afterEach, describe, expect, test, vi } from 'vitest'

import { client } from '../../plugins/platform/Platform.js'
import { getScrollbarWidth } from '../scroll/scroll.js'
import {
  getAnchorProps,
  setPosition,
  trackAnchorMotion
} from './fallback-position-engine.js'

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
 * The viewport exactly as the position engine sees it.
 */
function viewportSize() {
  return {
    width: document.body.clientWidth,
    height: window.innerHeight - getScrollbarWidth()
  }
}

/**
 * Builds a config where the anchor is a real 100x30 box at (100, 100) and
 * the target a real 150x50 one, laid out in the actual viewport.
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

describe('[fallbackPositionEngine API]', () => {
  describe('[Functions]', () => {
    describe('[(function)getAnchorProps]', () => {
      test('derives the middle and center out of the bounding rect', () => {
        const el = createAnchor({
          top: 100,
          left: 200,
          width: 100,
          height: 40
        })

        expect(getAnchorProps(el)).toStrictEqual({
          top: 100,
          bottom: 140,
          height: 40,
          left: 200,
          right: 300,
          width: 100,
          middle: 250,
          center: 120
        })
      })

      test('inflates the anchor by the supplied offset', () => {
        const el = createAnchor({
          top: 100,
          left: 200,
          width: 100,
          height: 40
        })

        expect(getAnchorProps(el, [10, 5])).toStrictEqual({
          top: 95,
          bottom: 145,
          height: 45,
          left: 190,
          right: 310,
          width: 110,
          middle: 250,
          center: 120
        })
      })
    })

    describe('[(function)setPosition]', () => {
      test.each([
        ['the target is gone', { targetEl: null }],
        ['the anchor is gone', { anchorEl: null }]
      ])('does nothing when %s', (_, override) => {
        vi.useFakeTimers()
        const cfg = { ...createConfig(), ...override }

        expect(setPosition(cfg)).toBeUndefined()
        expect(vi.getTimerCount()).toBe(0)
      })

      test('places the target right under the anchor', () => {
        const cfg = createConfig()

        setPosition(cfg)

        expect(cfg.targetEl.style.top).toBe('130px')
        expect(cfg.targetEl.style.left).toBe('100px')
        expect(cfg.targetEl.style.visibility).toBe('visible')
      })

      test('honors the anchor and self origins', () => {
        const cfg = createConfig({
          anchorOrigin: { vertical: 'center', horizontal: 'middle' },
          selfOrigin: { vertical: 'center', horizontal: 'middle' }
        })

        // anchor center/middle is (115, 150), target center/middle is (25, 75)
        setPosition(cfg)

        expect(cfg.targetEl.style.top).toBe('90px')
        expect(cfg.targetEl.style.left).toBe('75px')
      })

      test('offsets the anchor when an offset is supplied', () => {
        const cfg = createConfig({ offset: [10, 5] })

        setPosition(cfg)

        expect(cfg.targetEl.style.top).toBe('135px')
        expect(cfg.targetEl.style.left).toBe('90px')
      })

      test('flips above the anchor when there is no room below', () => {
        const { height } = viewportSize()
        // the 30px tall anchor sits so close to the bottom edge that the
        // 50px tall target cannot fit below it anymore
        const anchorTop = height - 68
        const cfg = createConfig({
          anchorRect: { top: anchorTop, left: 100, width: 100, height: 30 }
        })

        setPosition(cfg)

        // it must not overflow the viewport anymore
        const top = Number.parseFloat(cfg.targetEl.style.top)
        const maxHeight = Number.parseFloat(cfg.targetEl.style.maxHeight)

        expect(top).toBe(anchorTop - 50)
        expect(top + maxHeight).toBeLessThanOrEqual(height)
      })

      test('shrinks the target when it cannot fit the viewport at all', () => {
        const { height } = viewportSize()
        const cfg = createConfig({
          anchorRect: { top: 300, left: 100, width: 100, height: 30 },
          targetSize: { width: 150, height: 2000 }
        })

        setPosition(cfg)

        expect(cfg.targetEl.style.top).toBe('330px')
        expect(cfg.targetEl.style.maxHeight).toBe(`${height - 330}px`)
      })

      test('keeps the target inside the viewport horizontally', () => {
        const { width } = viewportSize()
        // a 30px wide anchor near the right edge, so the 150px wide
        // target would overflow the viewport
        const cfg = createConfig({
          anchorRect: { top: 100, left: width - 44, width: 30, height: 30 }
        })

        setPosition(cfg)

        const left = Number.parseFloat(cfg.targetEl.style.left)
        const maxWidth = Number.parseFloat(cfg.targetEl.style.maxWidth)

        expect(left).toBeGreaterThanOrEqual(0)
        expect(left + maxWidth).toBeLessThanOrEqual(width)
      })

      test('matches the anchor width when fitting', () => {
        const cfg = createConfig({
          fit: true,
          anchorRect: { top: 100, left: 100, width: 300, height: 30 }
        })

        setPosition(cfg)

        expect(cfg.targetEl.style.minWidth).toBe('300px')
        expect(cfg.targetEl.style.minHeight).toBe('')
      })

      test('matches the anchor box when covering', () => {
        const cfg = createConfig({
          cover: true,
          offset: [10, 5],
          anchorRect: { top: 100, left: 100, width: 300, height: 30 }
        })

        setPosition(cfg)

        expect(cfg.targetEl.style.minWidth).toBe('300px')
        expect(cfg.targetEl.style.minHeight).toBe('30px')

        // covering ignores the offset
        expect(cfg.targetEl.style.top).toBe('130px')
        expect(cfg.targetEl.style.left).toBe('100px')
      })

      test('treats an absolute offset as a 1x1 anchor', () => {
        const cfg = createConfig({
          anchorRect: { top: 10, left: 20, width: 0, height: 0 },
          absoluteOffset: { top: 200, left: 300 },
          offset: [5, 7]
        })

        setPosition(cfg)

        // the 1x1 anchor sits at (10 + 200 + 7, 20 + 300 + 5)
        expect(cfg.targetEl.style.top).toBe('218px')
        expect(cfg.targetEl.style.left).toBe('325px')
      })

      test('re-anchors an absolutely offset target when it flips', () => {
        const { height } = viewportSize()
        // a "touch position" so close to the bottom edge that the 50px
        // tall target cannot fit below it
        const pointerTop = height - 28
        const cfg = createConfig({
          anchorRect: { top: 0, left: 0, width: 0, height: 0 },
          absoluteOffset: { top: pointerTop, left: 300 },
          offset: [5, 7]
        })

        setPosition(cfg)

        const top = Number.parseFloat(cfg.targetEl.style.top)
        const maxHeight = Number.parseFloat(cfg.targetEl.style.maxHeight)

        // it sits above the pointer, clear of the offset it was pushed by
        expect(top).toBeLessThan(pointerTop)
        expect(top + maxHeight).toBeLessThanOrEqual(height)
      })

      test('retries until the target reports its dimensions', () => {
        vi.useFakeTimers()
        const cfg = createConfig({ targetSize: { width: 0, height: 0 } })

        setPosition(cfg)

        vi.advanceTimersByTime(10)
        expect(cfg.targetEl.style.top).toBe('')

        cfg.targetEl.style.width = '150px'
        cfg.targetEl.style.height = '50px'
        vi.advanceTimersByTime(10)

        expect(cfg.targetEl.style.top).toBe('130px')
      })

      test('gives up retrying after a few attempts', () => {
        vi.useFakeTimers()
        const cfg = createConfig({ targetSize: { width: 0, height: 0 } })

        setPosition(cfg)
        vi.advanceTimersByTime(10 * 20)

        expect(vi.getTimerCount()).toBe(0)
        expect(cfg.targetEl.style.top).toBe('')
      })

      test('publishes the iOS visual viewport offsets as CSS variables', () => {
        const originalIos = client.is.ios
        client.is.ios = true
        restoreFns.push(() => {
          client.is.ios = originalIos
        })

        // the real visualViewport only reports non-zero offsets during a
        // pinch-zoom, which cannot be driven deterministically here
        mockProperty(window, 'visualViewport', {
          offsetLeft: 13,
          offsetTop: 27
        })

        setPosition(createConfig())

        expect(document.body.style.getPropertyValue('--q-pe-left')).toBe('13px')
        expect(document.body.style.getPropertyValue('--q-pe-top')).toBe('27px')
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
  })
})
