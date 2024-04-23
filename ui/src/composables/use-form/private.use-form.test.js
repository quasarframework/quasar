import { describe, test, expect } from 'vitest'
import { computed } from 'vue'

import {
  useFormProps,
  useFormAttrs, useFormInject, useFormInputNameAttr
} from './private.use-form.js'

describe('[useForm API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useFormProps]', () => {
      test('is defined correctly', () => {
        expect(useFormProps).toBeTypeOf('object')
        expect(Object.keys(useFormProps)).not.toHaveLength(0)
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)useFormAttrs]', () => {
      test('has correct return value', () => {
        const { value: result } = useFormAttrs({
          name: 'MyName',
          modelValue: 'MyModelValue'
        })

        expect(result).toBeTypeOf('object')
        expect(result.name).toBe('MyName')
        expect(result.value).toBe('MyModelValue')
      })
    })

    describe('[(function)useFormInject]', () => {
      test('useFormInject()', () => {
        const fn = useFormInject()

        expect(typeof fn).toBe('function')

        const acc = []
        fn(acc, 'push')
        fn(acc, 'push', ' MyClassName')

        expect(acc).toHaveLength(2)

        expect(acc[ 0 ].type).toBe('input')
        expect(Object.keys(acc[ 0 ].props)).toHaveLength(1)
        expect(acc[ 0 ].props.class).toBe('hidden')

        expect(acc[ 1 ].type).toBe('input')
        expect(Object.keys(acc[ 1 ].props)).toHaveLength(1)
        expect(acc[ 1 ].props.class).toBe('hidden MyClassName')
      })

      test('useFormInject(formAttrs)', () => {
        const fn = useFormInject(
          computed(() => ({
            myAttr: 'MyAttrValue'
          }))
        )

        const acc = []

        fn(acc, 'push')
        fn(acc, 'push', ' MyClassName')

        expect(acc).toHaveLength(2)

        expect(acc[ 0 ].type).toBe('input')
        expect(Object.keys(acc[ 0 ].props)).toHaveLength(2)
        expect(acc[ 0 ].props.class).toBe('hidden')
        expect(acc[ 0 ].props.myAttr).toBe('MyAttrValue')

        expect(acc[ 1 ].type).toBe('input')
        expect(Object.keys(acc[ 1 ].props)).toHaveLength(2)
        expect(acc[ 1 ].props.class).toBe('hidden MyClassName')
        expect(acc[ 1 ].props.myAttr).toBe('MyAttrValue')
      })
    })

    describe('[(function)useFormInputNameAttr]', () => {
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
})
