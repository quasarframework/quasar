import { expect, test } from 'vitest'

import getMeta from './get-meta.js'

test('spreads the title and description over every meta variant', () => {
  const meta = getMeta('The Title', 'The description.')

  const contents = Object.values(meta).map(entry => entry.content)
  expect(contents).toHaveLength(6)

  const titles = contents.filter(content => content === 'The Title')
  const descriptions = contents.filter(
    content => content === 'The description.'
  )
  expect(titles).toHaveLength(3)
  expect(descriptions).toHaveLength(3)

  // each variant addresses a distinct tag target
  const targets = Object.values(meta).map(entry => entry.name ?? entry.property)
  expect(new Set(targets).size).toBe(targets.length)
})
