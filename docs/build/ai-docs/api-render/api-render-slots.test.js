import { expect, test } from 'vitest'
import { partitionSlots, renderSlots } from './members.js'

test('simple slot with no scope', () => {
  const output = renderSlots({
    default: { desc: 'Default slot' }
  })
  expect(output).toBe('- `#default`\n  Default slot\n')
})

test('scoped slot with scope object', () => {
  const output = renderSlots({
    'selected-item': {
      desc: 'Override selection',
      scope: {
        opt: { type: 'Any', desc: 'Option value' },
        index: { type: 'Number', desc: 'Selection index' }
      }
    }
  })
  expect(output).toMatch(/`#selected-item`/)
  expect(output).toMatch(/Override selection/)
  expect(output).toMatch(/Scope:/)
  expect(output).toMatch(/`opt`/)
})

test('partitionSlots splits scoped from regular', () => {
  const { regular, scoped } = partitionSlots({
    a: { desc: 'reg' },
    b: { desc: 'scoped', scope: { x: { type: 'Number' } } },
    c: { desc: 'reg2' }
  })
  expect(Object.keys(regular)).toStrictEqual(['a', 'c'])
  expect(Object.keys(scoped)).toStrictEqual(['b'])
})
