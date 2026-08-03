import { afterEach, describe, expect, test, vi } from 'vitest'

import { client } from '../../plugins/platform/Platform.js'
import {
  getAnchorProps,
  parsePosition,
  setPosition,
  validateOffset,
  validatePosition
} from './position-engine.js'

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
 * jsdom has no layout engine, so every measurement the engine relies on
 * must be stubbed; the undo is registered for the next test.
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

function createAnchor(rect) {
  const el = document.createElement('div')

  el.getBoundingClientRect = () => rect

  document.body.append(el)
  nodes.push(el)
  return el
}

function createTarget({ width = 150, height = 50 } = {}) {
  const el = document.createElement('div')

  mockProperty(el, 'offsetWidth', width)
  mockProperty(el, 'offsetHeight', height)

  document.body.append(el)
  nodes.push(el)
  return el
}

const viewport = { height: 768, width: 1024 }

/**
 * Builds a config where the anchor is a 100x30 box and the target a 150x50 one,
 * inside a 1024x768 viewport.
 */
function createConfig({
  anchorRect = {
    top: 100,
    left: 100,
    bottom: 130,
    right: 200,
    width: 100,
    height: 30
  },
  targetSize,
  ...cfg
} = {}) {
  mockProperty(window, 'innerHeight', viewport.height)
  mockProperty(document.body, 'clientWidth', viewport.width)

  return {
    anchorEl: createAnchor(anchorRect),
    targetEl: createTarget(targetSize),
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    selfOrigin: { vertical: 'top', horizontal: 'left' },
    ...cfg
  }
}

describe('[positionEngine API]', () => {
  describe('[Functions]', () => {
    describe('[(function)validatePosition]', () => {
      test.each([
        'top left',
        'top middle',
        'top right',
        'top start',
        'top end',
        'center left',
        'center middle',
        'bottom right',
        'bottom start',
        'bottom end'
      ])('accepts "%s"', pos => {
        expect(validatePosition(pos)).toBe(true)
      })

      test.each(['top', 'top left right', ''])(
        'rejects "%s" without complaining',
        pos => {
          const errorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {})

          expect(validatePosition(pos)).toBe(false)
          expect(errorSpy).not.toHaveBeenCalled()
        }
      )

      test('rejects an unknown vertical part', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        expect(validatePosition('middle left')).toBe(false)
        expect(errorSpy).toHaveBeenCalledExactlyOnceWith(
          expect.stringContaining('top/center/bottom')
        )
      })

      test('rejects an unknown horizontal part', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        expect(validatePosition('top center')).toBe(false)
        expect(errorSpy).toHaveBeenCalledExactlyOnceWith(
          expect.stringContaining('left/middle/right/start/end')
        )
      })
    })

    describe('[(function)validateOffset]', () => {
      test.each([
        ['undefined', void 0],
        ['null', null],
        ['a pair of numbers', [10, 20]],
        ['a pair of negative numbers', [-10, -20]]
      ])('accepts %s', (_, val) => {
        expect(validateOffset(val)).toBe(true)
      })

      test.each([
        ['an empty array', []],
        ['a single value', [10]],
        ['more than two values', [10, 20, 30]],
        ['a non-number first value', ['10', 20]],
        ['a non-number second value', [10, '20']]
      ])('rejects %s', (_, val) => {
        expect(validateOffset(val)).toBe(false)
      })
    })

    describe('[(function)parsePosition]', () => {
      test.each([
        ['top left', false, { vertical: 'top', horizontal: 'left' }],
        ['center middle', false, { vertical: 'center', horizontal: 'middle' }],
        ['bottom right', false, { vertical: 'bottom', horizontal: 'right' }],
        ['top left', true, { vertical: 'top', horizontal: 'left' }],
        ['center middle', true, { vertical: 'center', horizontal: 'middle' }],
        ['bottom right', true, { vertical: 'bottom', horizontal: 'right' }]
      ])('splits "%s" (rtl: %s)', (pos, rtl, expected) => {
        expect(parsePosition(pos, rtl)).toStrictEqual(expected)
      })

      test.each([
        ['top start', false, 'left'],
        ['top start', true, 'right'],
        ['top end', false, 'right'],
        ['top end', true, 'left']
      ])('resolves "%s" (rtl: %s) to %s', (pos, rtl, horizontal) => {
        expect(parsePosition(pos, rtl).horizontal).toBe(horizontal)
      })
    })

    describe('[(function)getAnchorProps]', () => {
      test('derives the middle and center out of the bounding rect', () => {
        const el = createAnchor({
          top: 100,
          left: 200,
          bottom: 140,
          right: 300,
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
          bottom: 140,
          right: 300,
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
        const cfg = createConfig({
          anchorRect: {
            top: 700,
            left: 100,
            bottom: 730,
            right: 200,
            width: 100,
            height: 30
          }
        })

        setPosition(cfg)

        // it must not overflow the viewport anymore
        const top = Number.parseFloat(cfg.targetEl.style.top)
        const maxHeight = Number.parseFloat(cfg.targetEl.style.maxHeight)

        expect(top).toBe(650)
        expect(top + maxHeight).toBeLessThanOrEqual(viewport.height)
      })

      test('shrinks the target when it cannot fit the viewport at all', () => {
        const cfg = createConfig({
          anchorRect: {
            top: 300,
            left: 100,
            bottom: 330,
            right: 200,
            width: 100,
            height: 30
          },
          targetSize: { width: 150, height: 2000 }
        })

        setPosition(cfg)

        expect(cfg.targetEl.style.top).toBe('330px')
        expect(cfg.targetEl.style.maxHeight).toBe(`${viewport.height - 330}px`)
      })

      test('keeps the target inside the viewport horizontally', () => {
        const cfg = createConfig({
          anchorRect: {
            top: 100,
            left: 980,
            bottom: 130,
            right: 1010,
            width: 30,
            height: 30
          }
        })

        setPosition(cfg)

        const left = Number.parseFloat(cfg.targetEl.style.left)
        const maxWidth = Number.parseFloat(cfg.targetEl.style.maxWidth)

        expect(left).toBeGreaterThanOrEqual(0)
        expect(left + maxWidth).toBeLessThanOrEqual(viewport.width)
      })

      test('matches the anchor width when fitting', () => {
        const cfg = createConfig({
          fit: true,
          anchorRect: {
            top: 100,
            left: 100,
            bottom: 130,
            right: 400,
            width: 300,
            height: 30
          }
        })

        setPosition(cfg)

        expect(cfg.targetEl.style.minWidth).toBe('300px')
        expect(cfg.targetEl.style.minHeight).toBe('')
      })

      test('matches the anchor box when covering', () => {
        const cfg = createConfig({
          cover: true,
          offset: [10, 5],
          anchorRect: {
            top: 100,
            left: 100,
            bottom: 130,
            right: 400,
            width: 300,
            height: 30
          }
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
          anchorRect: {
            top: 10,
            left: 20,
            bottom: 10,
            right: 20,
            width: 0,
            height: 0
          },
          absoluteOffset: { top: 200, left: 300 },
          offset: [5, 7]
        })

        setPosition(cfg)

        // the 1x1 anchor sits at (10 + 200 + 7, 20 + 300 + 5)
        expect(cfg.targetEl.style.top).toBe('218px')
        expect(cfg.targetEl.style.left).toBe('325px')
      })

      test('re-anchors an absolutely offset target when it flips', () => {
        const cfg = createConfig({
          anchorRect: {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: 0,
            height: 0
          },
          absoluteOffset: { top: 740, left: 300 },
          offset: [5, 7]
        })

        setPosition(cfg)

        const top = Number.parseFloat(cfg.targetEl.style.top)
        const maxHeight = Number.parseFloat(cfg.targetEl.style.maxHeight)

        // it sits above the pointer, clear of the offset it was pushed by
        expect(top).toBeLessThan(740)
        expect(top + maxHeight).toBeLessThanOrEqual(viewport.height)
      })

      test('retries until the target reports its dimensions', () => {
        vi.useFakeTimers()
        const cfg = createConfig({ targetSize: { width: 0, height: 0 } })

        setPosition(cfg)

        vi.advanceTimersByTime(10)
        expect(cfg.targetEl.style.top).toBe('')

        mockProperty(cfg.targetEl, 'offsetWidth', 150)
        mockProperty(cfg.targetEl, 'offsetHeight', 50)
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

        mockProperty(window, 'visualViewport', {
          offsetLeft: 13,
          offsetTop: 27
        })

        setPosition(createConfig())

        expect(document.body.style.getPropertyValue('--q-pe-left')).toBe('13px')
        expect(document.body.style.getPropertyValue('--q-pe-top')).toBe('27px')
      })
    })
  })
})
