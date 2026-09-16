import { expect, test } from 'vitest'
import { renderMethods } from './members.js'

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
  expect(output).toContain(
    '  Returns: `boolean | Promise`\n    True if valid\n'
  )
})

test('method returning a documented object shape renders it', () => {
  const output = renderMethods({
    create: {
      desc: 'Create it',
      params: { opts: { type: 'Object', required: true, desc: 'Options' } },
      returns: {
        type: 'Object',
        desc: 'Chainable Object',
        definition: {
          onOk: {
            type: 'Function',
            required: true,
            desc: 'Runs on OK',
            params: {
              callbackFn: { type: 'Function', required: true, desc: 'Callback' }
            },
            returns: { type: 'Object', desc: 'Chainable Object' }
          }
        }
      }
    }
  })
  expect(output).toBe(
    '- `create(opts: object): object`\n' +
      '  Create it\n' +
      '  Params:\n' +
      '    - `opts` (object, required)\n' +
      '      Options\n' +
      '  Returns: `object`\n' +
      '    Chainable Object\n' +
      '    Object shape:\n' +
      '      - `onOk` (Function, required)\n' +
      '        Runs on OK\n' +
      '        Function signature: `(callbackFn: Function) => object`\n' +
      '        Params:\n' +
      '          - `callbackFn` (Function, required)\n' +
      '            Callback\n' +
      '        Returns: `object`\n' +
      '          Chainable Object\n'
  )
})

test('null params and returns mean a void, argument-less method', () => {
  const output = renderMethods({
    reset: { desc: 'Reset', params: null, returns: null }
  })
  expect(output).toBe('- `reset(): void`\n  Reset\n')
})

test('a rest param carries no optional mark', () => {
  const output = renderMethods({
    log: {
      desc: 'Log',
      params: { '...args': { type: 'Any', desc: 'Anything' } },
      returns: null
    }
  })
  expect(output).toMatch(/`log\(\.\.\.args: any\): void`/)
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
