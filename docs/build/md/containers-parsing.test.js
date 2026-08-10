import { expect, test } from 'vitest'
import markdownIt from 'markdown-it'
import { registerContainers } from './md-plugin-containers.js'

test('registerContainers registers all 4 container types as parsing rules', () => {
  const md = markdownIt({ html: true })
  registerContainers(md)
  const src =
    '::: tip\nhello\n:::\n\n::: warning\nwarn\n:::\n\n::: danger\ndanger\n:::\n\n::: details Click me\ndetails\n:::'
  const tokens = md.parse(src, {})
  const types = tokens.map(({ type }) => type)
  expect(types).toContain('container_tip_open')
  expect(types).toContain('container_warning_open')
  expect(types).toContain('container_danger_open')
  expect(types).toContain('container_details_open')
})

test('registerContainers does NOT register render hooks (HTML render is opt-in)', () => {
  const md = markdownIt({ html: true })
  registerContainers(md)
  // The default render falls back to markdown-it-container's generic open/close
  // which renders <div></div> , not the custom doc-note classes.
  const html = md.render('::: tip\nhello\n:::\n')
  expect(
    html,
    'should not include doc-note class without HTML render hook'
  ).not.toContain('doc-note')
})
