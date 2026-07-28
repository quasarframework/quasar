import { beforeEach, describe, expect, test, vi } from 'vitest'

import preventScroll from '../../utils/scroll/prevent-scroll.js'
import usePreventScroll from './use-prevent-scroll.js'

vi.mock('../../utils/scroll/prevent-scroll.js', () => ({
  default: vi.fn()
}))

describe('[usePreventScroll API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      beforeEach(() => {
        vi.clearAllMocks()
      })

      test('updates scroll prevention only when its state changes', () => {
        const { preventBodyScroll } = usePreventScroll()

        preventBodyScroll(false)
        expect(preventScroll).not.toHaveBeenCalled()

        preventBodyScroll(true)
        preventBodyScroll(true)
        preventBodyScroll(false)
        preventBodyScroll(false)

        expect(preventScroll.mock.calls).toStrictEqual([[true], [false]])
      })
    })
  })
})
