import { expect, test } from 'vitest'
import { renderEvents } from './members.js'

test('event with single param', () => {
  const output = renderEvents({
    'update:model-value': {
      desc: 'Emitted when model changes',
      params: {
        value: { type: 'Number', required: true, desc: 'New value' }
      }
    }
  })
  expect(output).toBe(
    '- `@update:model-value`\n' +
      '  Emitted when model changes\n' +
      '  Params:\n' +
      '    - `value` (number, required)\n' +
      '      New value\n'
  )
})

test('event with no params', () => {
  const output = renderEvents({
    click: { desc: 'Click event' }
  })
  expect(output).toBe('- `@click`\n  Click event\n')
})

test('event with Object payload (nested shape)', () => {
  const output = renderEvents({
    selection: {
      desc: 'Selection changed',
      params: {
        details: {
          type: 'Object',
          required: true,
          desc: 'Selection details',
          definition: {
            rows: { type: 'Array', required: true, desc: 'Selected rows' }
          }
        }
      }
    }
  })
  expect(output).toMatch(/Params:/)
  expect(output).toMatch(/Object shape:/)
  expect(output).toMatch(/`rows`/)
})
