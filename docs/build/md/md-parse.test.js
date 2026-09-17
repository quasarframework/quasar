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

test("the alert markers are GitHub's five, each with its own look and label", () => {
  const alert = marker =>
    mdParse(
      `---\ntitle: T\n---\n> [!${marker}]\n> body\n`,
      '/x/src/pages/some/page.md'
    )

  for (const marker of ['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION']) {
    const output = alert(marker)
    expect(output).toContain(`doc-note doc-note--${marker.toLowerCase()}"`)
    expect(output).toContain(`<div class="doc-note__title">${marker}</div>`)
    expect(output).not.toContain('[!')
  }
  expect(() => alert('HINT')).toThrow('Unknown alert marker [!HINT]')
})
