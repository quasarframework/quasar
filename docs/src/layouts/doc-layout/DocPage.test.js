import { h, provide, ref } from 'vue'
import { expect, test } from 'vitest'

import { renderComponentWithHead } from '../../../test/render.js'

import DocPage from './DocPage.vue'
import { docStoreKey } from './store/index.js'

// the slice of the layout's store a page and its TOC read
function renderPage(props, path) {
  return renderComponentWithHead(
    {
      setup() {
        provide(docStoreKey, {
          state: ref({ toc: [], activeToc: null }),
          setToc() {}
        })
        return () => h(DocPage, props, () => 'body')
      }
    },
    void 0,
    void 0,
    { path }
  )
}

test('links the markdown sibling of the route, next to the title and in <head>', async () => {
  const { html, headTags } = await renderPage(
    { title: 'Button', heading: true, editLink: 'vue-components/button' },
    '/vue-components/button'
  )

  expect(html).toContain('href="/vue-components/button.md"')
  expect(html).toContain('aria-label="View this page as Markdown"')
  // agents read <head>, not buttons
  expect(headTags).toMatch(
    /<link[^>]*rel="alternate"[^>]*type="text\/markdown"[^>]*href="\/vue-components\/button\.md"/
  )
  expect(headTags).toContain('<title>Button</title>')

  // the edit link stays beside it, and only there: the page footer no
  // longer repeats it
  expect(html.match(/Edit this page in browser/g)).toHaveLength(1)
  expect(html).not.toContain('Caught a mistake?')
  expect(html).not.toContain('doc-page__content-footer')
})
