import { describe, expect, test } from 'vitest'

import BottomSheetComponent from './BottomSheetComponent.js'

describe('[BottomSheetComponent API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)default]', () => {
      test('is defined correctly', () => {
        expect(BottomSheetComponent).toBeTypeOf('object')
        expect(BottomSheetComponent.name).toBeTypeOf('string')
        expect(BottomSheetComponent.props).$props()
        expect(BottomSheetComponent.emits).$emits()
      })
    })
  })
})
