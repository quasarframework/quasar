import { expect, test } from 'vitest'
import { renderProps } from '../api-render/members.js'

test('simple prop with desc', () => {
  const output = renderProps({
    min: { type: 'Number', default: 0, desc: 'Minimum value' }
  })
  expect(output).toBe(
    '- `min` (number, optional), default `0`\n  Minimum value\n'
  )
})

test('prop with examples (inline, short list)', () => {
  const output = renderProps({
    color: {
      type: 'String',
      desc: 'Color name',
      examples: ["'primary'", "'teal'"]
    }
  })
  expect(output).toBe(
    "- `color` (string, optional)\n  Color name\n  Examples: `'primary'`, `'teal'`\n"
  )
})

test('prop with values (closed enum) emits Accepts', () => {
  const output = renderProps({
    type: {
      type: 'String',
      default: 'text',
      desc: 'Input type',
      values: ['text', 'password', 'email']
    }
  })
  expect(output).toBe(
    '- `type` (string, optional), default `text`\n  Input type\n  Accepts: `text`, `password`, `email`\n'
  )
})

test('prop with Object definition (one level nested)', () => {
  const output = renderProps({
    columns: {
      type: 'Array',
      desc: 'Column defs',
      definition: {
        name: { type: 'String', required: true, desc: 'Column id' },
        label: { type: 'String', required: true, desc: 'Header label' }
      }
    }
  })
  expect(output).toBe(
    '- `columns` (any[], optional)\n' +
      '  Column defs\n' +
      '  Object shape:\n' +
      '    - `name` (string, required)\n' +
      '      Column id\n' +
      '    - `label` (string, required)\n' +
      '      Header label\n'
  )
})

test('build marker prefix stripped from default', () => {
  const output = renderProps({
    value: { type: 'String', default: '# v-model="x"', desc: 'Model' }
  })
  expect(output).toContain('default `v-model="x"`')
})

test('dropped fields are ignored', () => {
  const output = renderProps({
    size: {
      type: 'String',
      desc: 'Size',
      category: 'style',
      tsType: 'NamedSize'
    }
  })
  expect(output).not.toContain('category')
  expect(output).not.toContain('NamedSize')
})

test('Function-typed prop with params/returns emits arrow-fn signature (spec D8)', () => {
  const output = renderProps({
    onClick: {
      type: 'Function',
      desc: 'Click handler',
      params: { e: { type: 'Event', required: true } },
      returns: { type: 'Boolean' }
    }
  })
  expect(output).toMatch(/Function signature: `\(e: Event\) => boolean`/)
})

test('Function-typed prop without params/returns does NOT emit signature', () => {
  const output = renderProps({
    handler: { type: 'Function', desc: 'A handler' }
  })
  expect(output).not.toContain('Function signature')
})

test('Function-union-typed prop ([Function, undefined]) still emits signature', () => {
  const output = renderProps({
    onClick: {
      type: ['Function', 'undefined'],
      desc: 'Click handler',
      params: { e: { type: 'Event', required: true } },
      returns: { type: 'Boolean' }
    }
  })
  // The undefined should be stripped from the head type. The signature still renders.
  expect(output).toMatch(/- `onClick` \(Function, optional\)/)
  expect(output).toMatch(/Function signature: `\(e: Event\) => boolean`/)
})

test('Array definition (authoring bug) does not render Object.entries garbage', () => {
  const output = renderProps({
    bad: {
      type: 'Object',
      desc: 'broken',
      definition: [{ type: 'String' }]
    }
  })
  expect(output).not.toContain('Object shape:')
})
