import { describe, test, expect } from 'vitest'

import useId from './use-id.js'

describe('[useId API]', () => {
  test('useId()', () => {
    const { value: result } = useId()

    expect(result).toBeTruthy()
    expect(result.startsWith('f_')).toBe(true)
  })

  test('useId({})', () => {
    const { value: result } = useId({})

    expect(result).toBeTruthy()
    expect(result.startsWith('f_')).toBe(true)
  })

  test('useId({ getValue })', () => {
    const { value: result } = useId({
      getValue: () => 'MyValue'
    })

    expect(result).toBe('MyValue')
  })

  test('useId({ getValue: () => null })', () => {
    const { value: result } = useId({
      getValue: () => null
    })

    expect(result).toBeTruthy()
    expect(result.startsWith('f_')).toBe(true)
  })

  test('useId({ getValue: () => null, required: true })', () => {
    const { value: result } = useId({
      getValue: () => null,
      required: true
    })

    expect(result).toBeTruthy()
    expect(result.startsWith('f_')).toBe(true)
  })

  test('useId({ getValue: () => null, required: false })', () => {
    const { value: result } = useId({
      getValue: () => null,
      required: false
    })

    expect(result).toBe(null)
  })
})
