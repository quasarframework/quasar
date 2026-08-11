import { describe, expect, test } from 'vitest'

import DialogPluginComponent from './DialogPluginComponent.js'

describe('[DialogPluginComponent API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)default]', () => {
      test('is defined correctly', () => {
        expect(DialogPluginComponent).toBeTypeOf('object')
        expect(DialogPluginComponent.name).toBeTypeOf('string')
        expect(DialogPluginComponent.props).$props()
        expect(DialogPluginComponent.emits).$emits()
      })
    })
  })
})
