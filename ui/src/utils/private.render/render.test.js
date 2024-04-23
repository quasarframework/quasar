import { describe, test, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'

import { hSlot, hUniqueSlot, hMergeSlot, hMergeSlotSafely, hDir } from './render.js'

describe('[render API]', () => {
  describe('[Functions]', () => {
    describe('[(function)hSlot]', () => {
      test('hSlot()', () => {
        expect(
          hSlot()
        ).toBeUndefined()
      })

      test('hSlot(void, x)', () => {
        expect(
          hSlot(void 0, 'x')
        ).toBe('x')
      })

      test('hSlot(() => void, x)', () => {
        expect(
          hSlot(() => {}, 'x')
        ).toBe('x')
      })

      test('hSlot(() => null, x)', () => {
        expect(
          hSlot(() => null, 'x')
        ).toBe('x')
      })

      test('hSlot(() => z)', () => {
        expect(
          hSlot(() => 'z')
        ).toBe('z')
      })

      test('hSlot(() => z, x)', () => {
        expect(
          hSlot(() => 'z', 'x')
        ).toBe('z')
      })
    })

    describe('[(function)hUniqueSlot]', () => {
      test('hUniqueSlot()', () => {
        expect(
          hUniqueSlot()
        ).toBeUndefined()
      })

      test('hUniqueSlot(void, x)', () => {
        expect(
          hUniqueSlot(void 0, 'x')
        ).toBe('x')
      })

      test('hUniqueSlot(() => [z])', () => {
        const value = [ 'z' ]
        const result = hUniqueSlot(() => value)
        expect(result).not.toBe(value)
        expect(result).toStrictEqual([ 'z' ])
      })

      test('hUniqueSlot(() => [z], x)', () => {
        const value = [ 'z' ]
        const result = hUniqueSlot(() => value, 'x')
        expect(result).not.toBe(value)
        expect(result).toStrictEqual([ 'z' ])
      })

      test('hUniqueSlot(() => void, x)', () => {
        expect(
          hUniqueSlot(() => {}, 'x')
        ).toBe('x')
      })

      test('hUniqueSlot(() => null, x)', () => {
        expect(
          hUniqueSlot(() => null, 'x')
        ).toBe('x')
      })
    })

    describe('[(function)hMergeSlot]', () => {
      test('hMergeSlot(void, [x])', () => {
        const source = [ 'x' ]
        const result = hMergeSlot(void 0, source)
        expect(result).toBe(source)
      })

      test('hMergeSlot(() => z, [x])', () => {
        const source = [ 'x' ]
        const result = hMergeSlot(() => 'z', source)
        expect(result).not.toBe(source)
        expect(result).toStrictEqual([ 'x', 'z' ])
      })

      test('hMergeSlot(() => [z], [x])', () => {
        const source = [ 'x' ]
        const result = hMergeSlot(() => [ 'z' ], source)
        expect(result).not.toBe(source)
        expect(result).toStrictEqual([ 'x', 'z' ])
      })
    })

    describe('[(function)hMergeSlotSafely]', () => {
      test('hMergeSlotSafely()', () => {
        expect(hMergeSlot()).toBeUndefined()
      })

      test('hMergeSlotSafely(void, [x])', () => {
        const source = [ 'x' ]
        const result = hMergeSlotSafely(void 0, source)
        expect(result).toBe(source)
      })

      test('hMergeSlotSafely(() => z, [x])', () => {
        const source = [ 'x' ]
        const result = hMergeSlotSafely(() => 'z', source)
        expect(result).not.toBe(source)
        expect(result).toStrictEqual([ 'x', 'z' ])
      })

      test('hMergeSlotSafely(() => [z], [x])', () => {
        const source = [ 'x' ]
        const z = [ 'z' ]
        const result = hMergeSlotSafely(() => z, source)
        expect(result).not.toBe(source)
        expect(result).not.toBe(z)
        expect(result).toStrictEqual([ 'x', 'z' ])
      })

      test('hMergeSlotSafely(() => [z])', () => {
        const z = [ 'z' ]
        const result = hMergeSlotSafely(() => z)
        expect(result).toBe(z)
      })
    })

    describe('[(function)hDir]', () => {
      test('correctly mounts/unmounts directive', async () => {
        let directiveIsMounted = false
        const condition = ref(true)

        const directive = {
          name: 'custom-directive',
          beforeMount () {
            directiveIsMounted = true
          },
          beforeUnmount () {
            directiveIsMounted = false
          }
        }

        const wrapper = mount({
          setup: () => {
            return () => hDir(
              'div',
              { class: 'div-class' },
              [ 'child' ],
              'key',
              condition.value,
              () => [ [ directive ] ]
            )
          }
        })

        expect(directiveIsMounted).toBe(true)
        expect(wrapper.html()).toBe('<div class="div-class">child</div>')

        condition.value = false
        await flushPromises()

        expect(directiveIsMounted).toBe(false)
        expect(wrapper.html()).toBe('<div class="div-class">child</div>')

        condition.value = true
        await flushPromises()
        expect(directiveIsMounted).toBe(true)
        expect(wrapper.html()).toBe('<div class="div-class">child</div>')
      })
    })
  })
})
