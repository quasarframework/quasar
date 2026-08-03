import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import morph from './morph.js'

/**
 * jsdom has neither a layout engine nor the Web Animations API, so:
 *   - every measurement (bounding rects, computed styles) is stubbed;
 *   - morph() takes its CSS keyframes fallback, which is what gets asserted.
 */
const baseComputedStyle = {
  length: 0,
  cssText: '',

  marginLeft: '0px',
  marginRight: '0px',
  marginTop: '0px',
  marginBottom: '0px',

  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'rgb(0, 0, 0)',
  borderRadius: '4px',
  backgroundColor: 'rgb(255, 0, 0)',
  transform: 'none',
  position: 'static',
  zIndex: '0'
}

const nodes = []
let frameCallbacks = []

beforeEach(() => {
  frameCallbacks = []
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    frameCallbacks.push(callback)
    return frameCallbacks.length
  })
  mockComputedStyle()
})

afterEach(() => {
  nodes.splice(0).forEach(node => node.remove())
  getMorphStyleNodes().forEach(node => node.remove())
  vi.restoreAllMocks()
})

function mockComputedStyle(getOverrides = () => ({})) {
  vi.spyOn(window, 'getComputedStyle').mockImplementation(el => ({
    ...baseComputedStyle,
    ...getOverrides(el)
  }))
}

/** Runs the frame callbacks that morph() scheduled. */
function flushFrames() {
  frameCallbacks.splice(0).forEach(callback => callback(0))
}

function createElement({ className, rect }) {
  const el = document.createElement('div')

  el.className = className
  el.getBoundingClientRect = () => rect

  nodes.push(el)
  return el
}

const fromRect = {
  top: 100,
  left: 50,
  bottom: 140,
  right: 150,
  width: 100,
  height: 40
}
const toRect = {
  top: 300,
  left: 200,
  bottom: 380,
  right: 400,
  width: 200,
  height: 80
}

function createScene({ separateTo = false } = {}) {
  const parent = createElement({ className: 'parent', rect: fromRect })
  const from = createElement({ className: 'from-el bg-red', rect: fromRect })

  parent.append(from)

  const to =
    separateTo === true
      ? createElement({ className: 'to-el bg-blue', rect: toRect })
      : from

  if (separateTo === true) parent.append(to)

  document.body.append(parent)

  return { parent, from, to }
}

function getMorphStyleNodes() {
  return [...document.head.querySelectorAll('style')].filter(el =>
    el.innerHTML.includes('@keyframes q-morph-anim-')
  )
}

function getKeyframes() {
  return getMorphStyleNodes().at(-1)?.innerHTML
}

function endAnimation(el) {
  const evt = new Event('animationend')

  // the animation shorthand ends with the generated keyframes name
  evt.animationName = el.style.animation.split(' ').pop()
  el.dispatchEvent(evt)
}

describe('[morph API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test.each([
        ['null', () => null],
        ['a detached element', () => document.createElement('div')],
        ['a selector without a match', () => '#there-is-no-such-element'],
        ['a getter returning nothing', () => () => null]
      ])('refuses to start on %s', (_, getFrom) => {
        const onToggle = vi.fn()
        const cancel = morph({ from: getFrom(), onToggle })

        expect(cancel).toBeTypeOf('function')
        expect(cancel()).toBe(false)
        expect(onToggle).not.toHaveBeenCalled()
        expect(window.requestAnimationFrame).not.toHaveBeenCalled()
      })

      test.each([
        ['an element', ({ from }) => from],
        ['a selector', () => '.from-el'],
        [
          'a getter',
          ({ from }) =>
            () =>
              from
        ]
      ])('accepts the source specified as %s', (_, getFrom) => {
        const scene = createScene()

        morph({ from: getFrom(scene) })
        flushFrames()

        expect(scene.from.parentNode).toBe(document.body)
      })

      test('toggles the state only after the placeholder is in place', () => {
        const { parent, from } = createScene()
        const onToggle = vi.fn(() => {
          expect(parent.children).toHaveLength(2)
        })

        morph({ from, onToggle })

        expect(onToggle).toHaveBeenCalledOnce()
        expect(window.requestAnimationFrame).toHaveBeenCalledExactlyOnceWith(
          expect.any(Function)
        )
      })

      test('leaves an inert placeholder behind the source element', () => {
        const { parent, from } = createScene()

        morph({ from })

        const clone = parent.children[1]

        expect(clone.className).toBe(from.className)
        expect(clone.getAttribute('aria-hidden')).toBe('true')
        expect(clone.style.transition).toBe('none')
        expect(clone.style.animation).toBe('none')
        expect(clone.style.pointerEvents).toBe('none')
        expect(clone.classList).not.toContain('q-morph--internal')
      })

      test('hides the placeholder when the source is not going away', () => {
        const { parent, from } = createScene()

        morph({ from, hideFromClone: true })

        expect(parent.children[1].classList).toContain('q-morph--internal')
      })

      test('drives the animation through generated keyframes', () => {
        const { from } = createScene()

        morph({
          from,
          duration: 500,
          easing: 'linear',
          delay: 20,
          fill: 'both'
        })
        flushFrames()

        const animationName = from.style.animation.split(' ').pop()

        expect(animationName).toMatch(/^q-morph-anim-\d+$/)
        expect(from.style.animation).toBe(
          `500ms linear 20ms normal both ${animationName}`
        )
        expect(getKeyframes()).toContain(`@keyframes ${animationName}`)

        // the morphed element is lifted out of the flow
        expect(from.parentNode).toBe(document.body)
        expect(from.style.position).toBe('absolute')
        expect(from.style.left).toBe('50px')
        expect(from.style.top).toBe('100px')
      })

      test('falls back to the default animation options', () => {
        const { from } = createScene()

        morph({ from })
        flushFrames()

        expect(from.style.animation).toMatch(
          /^300ms ease-in-out 0ms normal none q-morph-anim-\d+$/
        )
      })

      test('translates and scales the source onto the destination', () => {
        const { from, to } = createScene({ separateTo: true })

        morph({ from, to })
        flushFrames()

        // from (50, 100, 100x40) -> to (200, 300, 200x80)
        expect(getKeyframes()).toContain(
          'transform: translate(-150px, -200px) scale(0.5, 0.5);'
        )
        expect(to.style.left).toBe('200px')
        expect(to.style.top).toBe('300px')
      })

      test('animates the box instead of scaling it when resizing', () => {
        const { from, to } = createScene({ separateTo: true })

        morph({ from, to, resize: true })
        flushFrames()

        const keyframes = getKeyframes()

        expect(keyframes).toContain('transform: translate(-150px, -200px);')
        expect(keyframes).not.toContain('scale(')
        expect(keyframes).toContain('width: 100px;')
        expect(keyframes).toContain('width: 200px;')

        // resizing also frees the destination from its size constraints
        expect(to.style.overflow).toBe('hidden')
        expect(to.style.maxWidth).toBe('unset')
      })

      test('strips the background classes off the morphed element', () => {
        const { from } = createScene()

        morph({ from })
        flushFrames()

        expect(from.classList).not.toContain('bg-red')
        expect(from.classList).toContain('from-el')
      })

      test('applies the requested extra classes and styles', () => {
        const { from } = createScene()

        morph({
          from,
          classes: 'my-morph-class',
          style: { borderRadius: '20px' }
        })
        flushFrames()

        expect(from.classList).toContain('my-morph-class')
        expect(from.style.borderRadius).toBe('20px')
      })

      test('drops the logical CSS properties while copying the styles over', () => {
        const { from } = createScene()

        mockComputedStyle(() => ({
          cssText: 'color: red; margin-block: 5px; padding: 2px'
        }))

        morph({ from })
        flushFrames()

        expect(from.style.color).toBe('red')
        expect(from.style.padding).toBe('2px')
        expect(from.style.marginBlock).toBe('')
      })

      test('rides on top of the highest z-index around', () => {
        const { parent, from } = createScene()

        mockComputedStyle(el =>
          el === parent ? { position: 'relative', zIndex: '42' } : {}
        )

        morph({ from })
        flushFrames()

        expect(getKeyframes()).toContain('z-index: 42;')
      })

      test('positions a fixed destination against the document scroll', () => {
        const { from } = createScene()

        mockComputedStyle(el => (el === from ? { position: 'fixed' } : {}))
        Object.defineProperty(document.documentElement, 'scrollLeft', {
          configurable: true,
          value: 30
        })
        Object.defineProperty(document.documentElement, 'scrollTop', {
          configurable: true,
          value: 60
        })

        morph({ from })
        flushFrames()

        expect(from.style.position).toBe('fixed')
        expect(from.style.left).toBe('20px')
        expect(from.style.top).toBe('40px')

        delete document.documentElement.scrollLeft
        delete document.documentElement.scrollTop
      })

      test('restores everything once the animation ends', () => {
        const { parent, from } = createScene()
        const onEnd = vi.fn()
        const classSaved = from.className

        morph({ from, onEnd })
        flushFrames()
        endAnimation(from)

        expect(onEnd).toHaveBeenCalledExactlyOnceWith('to', false)
        expect(getMorphStyleNodes()).toHaveLength(0)
        expect(from.parentNode).toBe(parent)
        expect(from.className).toBe(classSaved)
        expect(from.style.cssText).toBe('')
        expect(parent.children).toHaveLength(1)
        expect(from.qMorphCancel).toBeUndefined()
      })

      test('ignores an unrelated animation end', () => {
        const { from } = createScene()
        const onEnd = vi.fn()

        morph({ from, onEnd })
        flushFrames()

        const evt = new Event('animationend')
        evt.animationName = 'some-other-animation'
        from.dispatchEvent(evt)

        expect(onEnd).not.toHaveBeenCalled()
        expect(from.parentNode).toBe(document.body)
      })

      test('aborts on demand and refuses to be cancelled twice', () => {
        const { parent, from } = createScene()
        const onEnd = vi.fn()

        const cancel = morph({ from, onEnd })
        flushFrames()

        expect(cancel(true)).toBe(true)
        expect(onEnd).toHaveBeenCalledOnce()
        expect(getMorphStyleNodes()).toHaveLength(0)
        expect(from.parentNode).toBe(parent)
        expect(parent.children).toHaveLength(1)

        expect(cancel(true)).toBe(false)
        expect(onEnd).toHaveBeenCalledOnce()
      })

      test.each([
        ['without a tween', {}],
        ['with a tween', { tween: true }]
      ])(
        'reverses the morph when cancelled without aborting %s',
        (_, options) => {
          const { parent, from } = createScene()
          const onEnd = vi.fn()

          const cancel = morph({ from, onEnd, ...options })
          flushFrames()

          expect(cancel()).toBe(true)
          expect(from.style.animationDirection).toBe('reverse')
          expect(onEnd).not.toHaveBeenCalled()

          // cancelling the reversal puts it back on its original course
          expect(cancel()).toBe(true)
          expect(from.style.animationDirection).toBe('normal')

          expect(cancel()).toBe(true)
          endAnimation(from)

          // it ended up back on the source element
          expect(onEnd).toHaveBeenCalledExactlyOnceWith('from', false)
          expect(from.parentNode).toBe(parent)
        }
      )

      test('tweens the source over the destination', () => {
        const { from } = createScene()

        morph({ from, tween: true, tweenFromOpacity: 0.8, tweenToOpacity: 0.3 })
        flushFrames()

        const keyframes = getKeyframes()

        expect(keyframes).toContain('opacity: 0.3;')
        expect(keyframes).toContain('opacity: 0.8;')
        expect(keyframes).toContain('-from-tween')
      })

      test('leaves the source spacer alone when it shares its size', () => {
        const { parent, from } = createScene()

        morph({ from })
        flushFrames()

        // the destination clone is inserted right before the source one
        const [toClone, fromClone] = parent.children
        const keyframes = getKeyframes()

        // the source is the destination here, so the destination spacer
        // carries the sizing on its own
        expect(keyframes).not.toContain('-from {')
        expect(fromClone.style.animation).toBe('none')

        expect(keyframes).toContain('-to {')
        expect(toClone.style.animation).toContain('-to')
      })

      test('animates the source spacer when it has a size of its own', () => {
        const { parent, from, to } = createScene({ separateTo: true })

        morph({ from, to })
        flushFrames()

        const [, fromClone] = parent.children

        expect(getKeyframes()).toContain('-from {')
        expect(fromClone.style.animation).toContain('-from')
      })

      test('leaves the destination spacer alone when the clone is kept', () => {
        const { parent, from } = createScene()

        morph({ from, keepToClone: true })
        flushFrames()

        const [toClone] = parent.children

        expect(getKeyframes()).not.toContain('-to {')
        expect(toClone.style.animation).toBe('none')
      })

      test('morphs towards a different destination element', () => {
        const { parent, from, to } = createScene({ separateTo: true })

        morph({ from, to })
        flushFrames()

        expect(to.parentNode).toBe(document.body)
        expect(to.classList).not.toContain('q-morph--internal')

        endAnimation(to)

        expect(to.parentNode).toBe(parent)
        expect(from.qMorphCancel).toBeUndefined()
        expect(to.qMorphCancel).toBeUndefined()
      })

      test('leaves the destination clone alone when requested', () => {
        const { from, to } = createScene({ separateTo: true })

        morph({ from, to, keepToClone: true })
        flushFrames()

        // the destination is never hidden and its clone is not animated
        expect(to.classList).not.toContain('q-morph--internal')
        expect(getKeyframes()).not.toContain('-to {')
      })

      test('animates the destination clone by default', () => {
        const { from, to } = createScene({ separateTo: true })

        morph({ from, to })
        flushFrames()

        expect(getKeyframes()).toContain('-to {')
      })

      test('gives up when the destination disappears', () => {
        const { parent, from } = createScene()
        const onEnd = vi.fn()

        morph({ from, to: () => null, onEnd })
        flushFrames()

        expect(parent.children).toHaveLength(1)
        expect(getMorphStyleNodes()).toHaveLength(0)
        expect(onEnd).not.toHaveBeenCalled()
        expect(from.qMorphCancel).toBeUndefined()
      })

      test('cancels a morph that is already running on the same element', () => {
        const { parent, from } = createScene()

        morph({ from })

        const firstClone = parent.children[1]

        morph({ from })

        // the first placeholder got cleaned up, only the new one is left
        expect(parent.children).toHaveLength(2)
        expect(parent.children[1]).not.toBe(firstClone)
        expect(firstClone.parentNode).toBeNull()
      })

      test('waits for a promise before animating', async () => {
        const { from } = createScene()
        let resolveWaitFor
        const waitFor = new Promise(resolve => {
          resolveWaitFor = resolve
        })

        morph({ from, waitFor })
        flushFrames()

        expect(getMorphStyleNodes()).toHaveLength(0)

        resolveWaitFor()
        await waitFor

        expect(getMorphStyleNodes()).toHaveLength(1)
      })

      test('waits for the given amount of time before animating', async () => {
        const { from } = createScene()

        morph({ from, waitFor: 10 })
        flushFrames()

        expect(getMorphStyleNodes()).toHaveLength(0)

        await vi.waitFor(() => {
          expect(getMorphStyleNodes()).toHaveLength(1)
        })
      })

      test('cleans up when the wait is rejected', async () => {
        const { parent, from } = createScene()
        const waitFor = Promise.reject(new Error('the state never settled'))

        morph({ from, waitFor })
        flushFrames()

        await waitFor.catch(() => {})
        await Promise.resolve()
        await Promise.resolve()

        expect(getMorphStyleNodes()).toHaveLength(0)
        expect(parent.children).toHaveLength(1)
        expect(from.qMorphCancel).toBeUndefined()
      })
    })
  })
})
