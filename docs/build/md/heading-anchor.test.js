import { expect, test } from 'vitest'
import md from './md.js'

const headingRE =
  /<(?<tag>h[1-6]) id="(?<id>[^"]+)"[^>]*>(?<inner>[\s\S]*?)<\/\k<tag>>/g

function render(source) {
  md.$frontMatter = { toc: [], pageScripts: new Set() }
  const html = md.render(source)
  md.$frontMatter = null
  return html
}

test('every heading carries a link to its own anchor', () => {
  const html = render(
    '## Installation\n\n### Nested one\n\n#### Deeper still\n\nSome prose.'
  )

  const headings = [...html.matchAll(headingRE)]
  expect(headings).toHaveLength(3)

  for (const { groups } of headings) {
    expect(groups.inner).toMatch(
      new RegExp(`<a [^>]*href="#${groups.id}"[^>]*>`)
    )
  }
})

test('the anchor sits beside the heading content, never around it', () => {
  const html = render('## Config <q-badge label="v3+" />')

  expect(html).toMatch(/<q-badge[^>]*\/>\s*<a /)
})

test('the anchor is named after its heading', () => {
  expect(render('## Installation options')).toMatch(
    /aria-label="Copy anchor to Installation options"/
  )
})

test('a heading name is escaped before it reaches the anchor attribute', () => {
  expect(render('## Tips & tricks')).toMatch(
    /aria-label="Copy anchor to Tips &amp; tricks"/
  )
})

test('the heading stays clickable without the anchor firing it twice', () => {
  const html = render('## Installation')

  expect(html).toMatch(/<h2 [^>]*@click="copyHeading\(`installation`\)"/)
  expect(html).toMatch(
    /<a [^>]*@click\.prevent\.stop="copyHeading\(`installation`\)"/
  )
})
