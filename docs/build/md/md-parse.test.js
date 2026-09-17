import { expect, test } from 'vitest'

import mdParse from './md-parse.js'

const page = (rel, frontMatter = '') =>
  mdParse(
    `---\ntitle: T\n${frontMatter}---\nbody\n`,
    `/x/docs/src/pages/${rel}`
  )

// no frontmatter key for it: a page cannot disagree with the navigation
// (build/md/nav-forms.js) about whether it has a .md sibling
test('a page links its markdown sibling exactly when the site form writes one', () => {
  expect(page('vue-components/button.md')).toMatch(/^\s+md-link$/m)
  // a folder-named page lives at the folder's route
  expect(page('layout/layout/layout.md')).toMatch(/^\s+md-link$/m)

  // held out by its navigation entry, in the sidebar or in the header
  expect(page('why-donate.md')).not.toContain('md-link')
  expect(page('video-tutorials/video-tutorials.md')).not.toContain('md-link')
  // on no navigation at all
  expect(page('guide.md')).not.toContain('md-link')
  expect(page('some/new-page.md')).not.toContain('md-link')
})

test('a page links its source unless it opts out', () => {
  expect(page('some/page.md')).toContain('edit-link="some/page"')
  expect(page('some/page.md', 'editLink: false\n')).not.toContain('edit-link')
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
