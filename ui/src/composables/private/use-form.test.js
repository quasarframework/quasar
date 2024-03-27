import { describe, test, expect } from 'vitest'
import { computed } from 'vue'

import { useFormAttrs, useFormInject, useFormInputNameAttr } from './use-form.js'

describe('[useForm API]', () => {
  describe('useForm', () => {
    test('useForm(props)', () => {
      const { value: result } = useFormAttrs({
        name: 'MyName',
        modelValue: 'MyModelValue'
      })

      expect(result).toBeTruthy()
      expect(result.name).toBe('MyName')
      expect(result.value).toBe('MyModelValue')
    })
  })

  describe('useFormInputNameAttr', () => {
    test('useFormInputNameAttr()', () => {
      const fn = useFormInject()

      expect(typeof fn).toBe('function')

      const acc = []
      fn(acc, 'push')
      fn(acc, 'push', ' MyClassName')

      expect(acc.length).toBe(2)

      expect(acc[ 0 ].type).toBe('input')
      expect(Object.keys(acc[ 0 ].props).length).toBe(1)
      expect(acc[ 0 ].props.class).toBe('hidden')

      expect(acc[ 1 ].type).toBe('input')
      expect(Object.keys(acc[ 1 ].props).length).toBe(1)
      expect(acc[ 1 ].props.class).toBe('hidden MyClassName')
    })

    test('useFormInputNameAttr(formAttrs)', () => {
      const fn = useFormInject(
        computed(() => ({
          myAttr: 'MyAttrValue'
        }))
      )

      const acc = []

      fn(acc, 'push')
      fn(acc, 'push', ' MyClassName')

      expect(acc.length).toBe(2)

      expect(acc[ 0 ].type).toBe('input')
      expect(Object.keys(acc[ 0 ].props).length).toBe(2)
      expect(acc[ 0 ].props.class).toBe('hidden')
      expect(acc[ 0 ].props.myAttr).toBe('MyAttrValue')

      expect(acc[ 1 ].type).toBe('input')
      expect(Object.keys(acc[ 1 ].props).length).toBe(2)
      expect(acc[ 1 ].props.class).toBe('hidden MyClassName')
      expect(acc[ 1 ].props.myAttr).toBe('MyAttrValue')
    })
  })

  describe('useFormInputNameAttr', () => {
    test('useFormInputNameAttr({ name })', () => {
      const { value: result } = useFormInputNameAttr({
        name: 'MyName'
      })

      expect(result).toBe('MyName')
    })

    test('useFormInputNameAttr({ for })', () => {
      const { value: result } = useFormInputNameAttr({
        for: 'MyFor'
      })

      expect(result).toBe('MyFor')
    })

    test('useFormInputNameAttr({ name, for })', () => {
      const { value: result } = useFormInputNameAttr({
        name: 'MyName',
        for: 'MyFor'
      })

      expect(result).toBe('MyName')
    })
  })
})
