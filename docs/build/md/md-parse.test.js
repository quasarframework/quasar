import { expect, test } from 'vitest'

import mdParse from './md-parse.js'

const page = frontMatter =>
  mdParse(
    `---\ntitle: T\n${frontMatter}---\nbody\n`,
    '/x/src/pages/some/page.md'
  )

test('a page links its markdown sibling and its source unless it opts out', () => {
  const linked = page('')
  expect(linked).toMatch(/^\s+md-link$/m)
  expect(linked).toContain('edit-link="some/page"')

  const bare = page('mdLink: false\neditLink: false\n')
  expect(bare).not.toContain('md-link')
  expect(bare).not.toContain('edit-link')
})
