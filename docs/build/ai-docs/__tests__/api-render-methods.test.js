import { expect, test } from 'vitest'
import { renderMethods } from '../api-render/members.js'

test('method with params and returns', () => {
  const output = renderMethods({
    validate: {
      desc: 'Trigger validation',
      params: {
        value: { type: 'Any', required: false, desc: 'Value to validate' }
      },
      returns: {
        type: ['Boolean', 'Promise'],
        desc: 'True if valid'
      }
    }
  })
  expect(output).toMatch(/`validate\(value\?: any\): boolean \| Promise`/)
  expect(output).toMatch(/Trigger validation/)
  expect(output).toMatch(/Params:/)
  expect(output).toMatch(/Returns: `boolean \| Promise` — True if valid/)
})

test('method with no params, void return', () => {
  const output = renderMethods({
    focus: { desc: 'Focus the input' }
  })
  expect(output).toMatch(/`focus\(\): void`/)
  expect(output).toMatch(/Focus the input/)
})

test('method with required param', () => {
  const output = renderMethods({
    setRow: {
      desc: 'Set a row',
      params: {
        key: { type: 'Any', required: true, desc: 'Row key' }
      },
      returns: { type: 'Boolean', desc: 'Was set' }
    }
  })
  expect(output).toMatch(/`setRow\(key: any\): boolean`/)
})
