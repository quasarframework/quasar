import { expect, test } from 'vitest'

import { duplicateHeadings } from './headings.js'

test('names each heading text a page repeats, once, by its slug', () => {
  expect(
    duplicateHeadings(
      [
        '## Usage',
        '### Basic',
        'text',
        '#### Basic',
        '### `Basic`',
        '## Overlay mode',
        '### Overlay mode',
        '## Other'
      ].join('\n')
    )
  ).toEqual(['Basic', 'Overlay mode'])
  expect(duplicateHeadings('## A\n\n## B')).toEqual([])
})

test('a heading-like line inside a fence is code', () => {
  expect(
    duplicateHeadings('## Basic\n\n```md\n## Basic\n```\n\n## Basic')
  ).toEqual(['Basic'])
  expect(duplicateHeadings('## Basic\n\n```md\n## Basic\n```')).toEqual([])
})
