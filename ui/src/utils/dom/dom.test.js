import { describe, test, expect, vi, onTestFinished } from 'vitest'
import { ref } from 'vue'

import dom, { getElement, childHasFocus } from './dom.js'

function createEl ({ top, left } = {}) {
  const el = document.createElement('div')
  el.setAttribute('tabindex', '0')
  el.classList = 'fixed'

  if (top !== void 0) {
    el.style.top = top
  }
  if (left !== void 0) {
    el.style.left = left
  }

  document.body.appendChild(el)
  onTestFinished(() => { el.remove() })

  return el
}

describe('[dom API]', () => {
  describe('[Functions]', () => {
    describe('[(function)offset]', () => {
      test('has correct return value', () => {
        const el = createEl()

        expect(
          dom.offset(el)
        ).toStrictEqual({
          top: expect.any(Number),
          left: expect.any(Number)
        })
      })
    })

    describe('[(function)style]', () => {
      test('has correct return value', () => {
        const el = createEl({ top: '10px', left: '20px' })

        expect(
          dom.style(el, 'top')
        ).toBe('10px')

        expect(
          dom.style(el, 'left')
        ).toBe('20px')
      })
    })

    describe('[(function)height]', () => {
      test('height()', () => {
        window.innerHeight = 100
        expect(dom.height(window)).toBe(100)
      })

      test('height(el)', () => {
        const el = createEl()
        el.style.height = '100px'

        expect(
          dom.height(el)
        ).toBeTypeOf('number')
      })
    })

    describe('[(function)width]', () => {
      test('width()', () => {
        window.innerHeight = 100
        expect(dom.height(window)).toBe(100)
      })

      test('width(el)', () => {
        const el = createEl()
        el.style.width = '100px'

        expect(
          dom.width(el)
        ).toBeTypeOf('number')
      })
    })

    describe('[(function)css]', () => {
      test('has correct return value', () => {
        const el = createEl()

        const result = dom.css(el, {
          width: '54px',
          height: '154px'
        })

        expect(result).toBeUndefined()
        expect(el.style.width).toBe('54px')
        expect(el.style.height).toBe('154px')
      })
    })

    describe('[(function)cssBatch]', () => {
      test('has correct return value', () => {
        const el1 = createEl()
        const el2 = createEl()

        const result = dom.cssBatch([ el1, el2 ], {
          width: '54px',
          height: '154px'
        })

        expect(result).toBeUndefined()

        expect(el1.style.width).toBe('54px')
        expect(el1.style.height).toBe('154px')

        expect(el2.style.width).toBe('54px')
        expect(el2.style.height).toBe('154px')
      })
    })

    describe('[(function)ready]', () => {
      test('ready()', () => {
        expect(
          dom.ready()
        ).toBeUndefined()
      })

      test('ready(5)', () => {
        expect(
          dom.ready(5)
        ).toBeUndefined()
      })

      test('ready(fn)', () => {
        const fn = vi.fn(() => 5)

        expect(
          dom.ready(fn)
        ).toBe(5)
      })
    })

    describe('[(function)getElement]', () => {
      test('getElement()', () => {
        expect(getElement()).toBeUndefined()
      })

      test('getElement(null)', () => {
        expect(getElement(null)).toBeUndefined()
      })

      test('getElement(el)', () => {
        const el = createEl()
        el.setAttribute('id', 'test-el')

        expect(getElement('#test-el')).toBe(el)
        expect(getElement('#bogus')).toBeUndefined()
      })

      test('getElement(vnode)', () => {
        const el = createEl()
        const vnode = { $el: el }

        expect(getElement(vnode)).toBe(el)
      })

      test('getElement(ref)', () => {
        const el = createEl()
        const elRef = ref(el)

        expect(getElement(elRef)).toBe(el)
      })
    })

    describe('[(function)childHasFocus]', () => {
      test('childHasFocus()', () => {
        expect(childHasFocus()).toBe(true)
      })

      test('childHasFocus(null)', () => {
        expect(childHasFocus(null)).toBe(true)
      })

      test('childHasFocus(el, elChild)', () => {
        const el = createEl()
        const elChild = document.createElement('div')
        el.appendChild(elChild)

        expect(
          childHasFocus(el, elChild)
        ).toBe(true)
      })

      test('childHasFocus(el, parentEl)', () => {
        const parentEl = createEl()
        const el = document.createElement('div')

        expect(
          childHasFocus(el, parentEl)
        ).toBe(false)
      })

      test('childHasFocus(el, nextSiblingEl)', () => {
        const el = createEl()
        /* intermediateEl */ createEl()
        const nextSiblingEl = createEl()

        expect(
          childHasFocus(el, nextSiblingEl)
        ).toBe(true)
      })

      test('childHasFocus(el, prevSiblingEl)', () => {
        const prevSiblingEl = createEl()
        const el = createEl()

        expect(
          childHasFocus(el, prevSiblingEl)
        ).toBe(false)
      })
    })
  })
})
