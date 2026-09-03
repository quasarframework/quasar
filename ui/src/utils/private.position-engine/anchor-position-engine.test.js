import { afterEach, describe, expect, test, vi } from 'vitest'

import { parsePosition } from './position-engine.js'
import {
  getPositionStyle,
  removeAnchorName,
  setAnchorName
} from './anchor-position-engine.js'

const nodes = []

afterEach(() => {
  nodes.splice(0).forEach(node => node.remove())
  vi.restoreAllMocks()
})

/**
 * Creates a real fixed-positioned element so the styles under test go
 * through the actual layout engine.
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

/**
 * Creates a popup-like fixed element and applies an engine style object
 * to it (null members mean "not set", like the render path treats them).
 */
function createTarget(style, { width = 150, height = 50 } = {}) {
  const el = document.createElement('div')

  Object.assign(el.style, {
    position: 'fixed',
    width: `${width}px`,
    height: `${height}px`
  })

  if (style !== void 0) {
    applyStyle(el, style)
  }

  document.body.append(el)
  nodes.push(el)
  return el
}

function applyStyle(el, style) {
  for (const key in style) {
    if (style[key] !== null) {
      el.style[key] = style[key]
    }
  }
}

function nextFrame() {
  return new Promise(resolve => {
    requestAnimationFrame(resolve)
  })
}

const origin = pos => parsePosition(pos, false)

describe('[anchorPositionEngine API]', () => {
  describe('[Functions]', () => {
    describe('[(function)setAnchorName]', () => {
      test('names the element through an inline anchor-name', () => {
        const el = createAnchor({ top: 0, left: 0, width: 10, height: 10 })
        const name = setAnchorName(el)

        expect(name).toMatch(/^--q-pe-\d+$/)
        expect(el.style.getPropertyValue('anchor-name')).toBe(name)

        removeAnchorName(el)
      })

      test('hands the same name to every popup sharing the anchor', () => {
        const el = createAnchor({ top: 0, left: 0, width: 10, height: 10 })
        const name = setAnchorName(el)

        expect(setAnchorName(el)).toBe(name)

        removeAnchorName(el)
        // still referenced by the "second popup"
        expect(el.style.getPropertyValue('anchor-name')).toBe(name)

        removeAnchorName(el)
        expect(el.style.getPropertyValue('anchor-name')).toBe('')
      })

      test('names different elements differently', () => {
        const el1 = createAnchor({ top: 0, left: 0, width: 10, height: 10 })
        const el2 = createAnchor({ top: 20, left: 0, width: 10, height: 10 })
        const name1 = setAnchorName(el1)
        const name2 = setAnchorName(el2)

        expect(name2).not.toBe(name1)

        removeAnchorName(el1)
        removeAnchorName(el2)
      })
    })

    describe('[(function)removeAnchorName]', () => {
      test('restores a pre-existing inline anchor-name', () => {
        const el = createAnchor({ top: 0, left: 0, width: 10, height: 10 })
        el.style.setProperty('anchor-name', '--app-own')

        const name = setAnchorName(el)
        expect(el.style.getPropertyValue('anchor-name')).toBe(name)

        removeAnchorName(el)
        expect(el.style.getPropertyValue('anchor-name')).toBe('--app-own')
      })

      test('tolerates an element it never named', () => {
        const el = createAnchor({ top: 0, left: 0, width: 10, height: 10 })

        expect(removeAnchorName(el)).toBeUndefined()
        expect(el.style.getPropertyValue('anchor-name')).toBe('')
      })
    })

    describe('[(function)getPositionStyle]', () => {
      test('expresses the origins through anchor() insets', () => {
        const style = getPositionStyle({
          anchorName: '--q-pe-test',
          anchorOrigin: origin('bottom left'),
          selfOrigin: origin('top left')
        })

        expect(style).toMatchObject({
          positionAnchor: '--q-pe-test',
          top: 'anchor(bottom)',
          left: 'anchor(left)',
          bottom: null,
          right: null,
          translate: null
        })
      })

      test('uses end insets for a popup growing towards the axis start', () => {
        const style = getPositionStyle({
          anchorName: '--q-pe-test',
          anchorOrigin: origin('top right'),
          selfOrigin: origin('bottom right')
        })

        expect(style).toMatchObject({
          bottom: 'anchor(top)',
          right: 'anchor(right)',
          top: null,
          left: null
        })
      })

      test('pushes edge lines outwards by the offset, in both inset systems', () => {
        const style = getPositionStyle({
          anchorName: '--q-pe-test',
          anchorOrigin: origin('bottom left'),
          selfOrigin: origin('top left'),
          offset: [8, 4]
        })

        expect(style.top).toBe('calc(anchor(bottom) + 4px)')
        expect(style.left).toBe('calc(anchor(left) - 8px)')

        const flipped = getPositionStyle({
          anchorName: '--q-pe-test',
          anchorOrigin: origin('top right'),
          selfOrigin: origin('bottom right'),
          offset: [8, 4]
        })

        expect(flipped.bottom).toBe('calc(anchor(top) + 4px)')
        expect(flipped.right).toBe('calc(anchor(right) - 8px)')
      })

      test('centers on a centered anchor line through anchor-center', () => {
        const style = getPositionStyle({
          anchorName: '--q-pe-test',
          anchorOrigin: origin('bottom middle'),
          selfOrigin: origin('top middle'),
          offset: [14, 14]
        })

        expect(style).toMatchObject({
          top: 'calc(anchor(bottom) + 14px)',
          left: '0px',
          right: '0px',
          justifySelf: 'anchor-center',
          // the offset never moves a center line
          translate: null
        })
      })

      test('falls back to a translate for a center self on an edge line', () => {
        const style = getPositionStyle({
          anchorName: '--q-pe-test',
          anchorOrigin: origin('bottom left'),
          selfOrigin: origin('center left')
        })

        expect(style).toMatchObject({
          top: 'anchor(bottom)',
          left: 'anchor(left)',
          translate: '0px -50%',
          alignSelf: null
        })
      })

      test('sizes fit/cover popups off the anchor through anchor-size()', () => {
        expect(
          getPositionStyle({
            anchorName: '--q-pe-test',
            anchorOrigin: origin('bottom left'),
            selfOrigin: origin('top left'),
            fit: true
          })
        ).toMatchObject({
          minWidth: 'anchor-size(width)',
          minHeight: null
        })

        expect(
          getPositionStyle({
            anchorName: '--q-pe-test',
            anchorOrigin: origin('center middle'),
            selfOrigin: origin('center middle'),
            cover: true,
            maxWidth: '200px'
          })
        ).toMatchObject({
          minWidth: 'min(anchor-size(width), 200px)',
          minHeight: 'anchor-size(height)'
        })
      })

      test('anchors a point popup to the coordinates inside the anchor', () => {
        const style = getPositionStyle({
          anchorName: '--q-pe-test',
          anchorOrigin: origin('bottom left'),
          selfOrigin: origin('top left'),
          point: { top: 40, left: 60 }
        })

        expect(style).toMatchObject({
          top: 'calc(anchor(top) + 40px)',
          left: 'calc(anchor(left) + 60px)'
        })
      })

      test('mirrors a point popup around the coordinates when the self origin says so', () => {
        const style = getPositionStyle({
          anchorName: '--q-pe-test',
          anchorOrigin: origin('bottom left'),
          selfOrigin: { vertical: 'bottom', horizontal: 'right' },
          point: { top: 40, left: 60 }
        })

        expect(style).toMatchObject({
          bottom: 'calc(anchor(top) - 40px)',
          right: 'calc(anchor(left) - 60px)'
        })
      })

      test('offsets a point popup the way it grows', () => {
        const cfg = {
          anchorName: '--q-pe-test',
          anchorOrigin: origin('bottom left'),
          point: { top: 40, left: 60 },
          offset: [5, 10]
        }

        // growing down/right clears the point in the positive direction
        expect(
          getPositionStyle({ ...cfg, selfOrigin: origin('top left') })
        ).toMatchObject({
          top: 'calc(anchor(top) + 50px)',
          left: 'calc(anchor(left) + 65px)'
        })

        // ...and growing up/left in the negative one, or the popup
        // would open onto the pointer instead of clearing it
        expect(
          getPositionStyle({
            ...cfg,
            selfOrigin: { vertical: 'bottom', horizontal: 'right' }
          })
        ).toMatchObject({
          bottom: 'calc(anchor(top) - 30px)',
          right: 'calc(anchor(left) - 55px)'
        })

        // a centered axis has no growth direction and takes the
        // positive one
        expect(
          getPositionStyle({ ...cfg, selfOrigin: origin('center middle') })
        ).toMatchObject({
          top: 'calc(anchor(top) + 50px)',
          left: 'calc(anchor(left) + 65px)',
          translate: '-50% -50%'
        })
      })

      test('the browser keeps the popup glued to a moving anchor', async () => {
        const anchorEl = createAnchor({
          top: 100,
          left: 100,
          width: 100,
          height: 30
        })
        const name = setAnchorName(anchorEl)

        const target = createTarget(
          getPositionStyle({
            anchorName: name,
            anchorOrigin: origin('bottom left'),
            selfOrigin: origin('top left')
          })
        )

        await nextFrame()
        let rect = target.getBoundingClientRect()
        expect(rect.top).toBe(130)
        expect(rect.left).toBe(100)

        // no engine call after this: the browser tracks on its own
        anchorEl.style.top = '200px'
        anchorEl.style.left = '150px'

        await nextFrame()
        rect = target.getBoundingClientRect()
        expect(rect.top).toBe(230)
        expect(rect.left).toBe(150)

        removeAnchorName(anchorEl)
      })
    })
  })
})
