import { describe, expect, test, vi } from 'vitest'

import useKeyComposition from './use-key-composition.js'

describe('[useKeyComposition API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('tracks composition and forwards its terminal event', () => {
        const onInput = vi.fn()
        const onComposition = useKeyComposition(onInput)
        const target = {}

        onComposition({
          type: 'compositionupdate',
          data: '日',
          target
        })

        expect(target.qComposing).toBe(true)

        const compositionEndEvent = {
          type: 'compositionend',
          target
        }

        onComposition(compositionEndEvent)

        expect(target.qComposing).toBe(false)
        expect(onInput).toHaveBeenCalledExactlyOnceWith(compositionEndEvent)
      })

      test('ignores terminal events when composition is inactive', () => {
        const onInput = vi.fn()
        const onComposition = useKeyComposition(onInput)
        const target = {}

        onComposition({
          type: 'compositionupdate',
          data: 'a',
          target
        })
        onComposition({
          type: 'change',
          target
        })

        expect(target.qComposing).toBeUndefined()
        expect(onInput).not.toHaveBeenCalled()
      })

      test('forwards a change event that terminates composition', () => {
        const onInput = vi.fn()
        const onComposition = useKeyComposition(onInput)
        const target = { qComposing: true }
        const changeEvent = {
          type: 'change',
          target
        }

        onComposition(changeEvent)

        expect(target.qComposing).toBe(false)
        expect(onInput).toHaveBeenCalledExactlyOnceWith(changeEvent)
      })
    })
  })
})
