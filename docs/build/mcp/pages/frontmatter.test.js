import { expect, test } from 'vitest'
import { processFrontmatter } from './frontmatter.js'

const menuByPath = new Map([
  ['vue-components/knob', { title: 'Knob' }],
  ['vue-components/circular-progress', { title: 'Circular Progress' }]
])

test('keeps title; drops desc/id/keys/examples/scope/nav/overline', () => {
  const rawFrontmatter = {
    title: 'Knob',
    desc: 'The QKnob...',
    overline: null,
    id: 'internal-id',
    keys: 'QKnob',
    examples: 'QKnob',
    scope: { foo: 1 },
    nav: [{ prev: 'x' }]
  }
  const { frontmatter: output } = processFrontmatter(rawFrontmatter, menuByPath)
  expect(Object.keys(output).sort()).toStrictEqual(['title'])
})

test('resolves related paths to {title, path}', () => {
  const rawFrontmatter = {
    title: 'Knob',
    desc: '...',
    related: ['/vue-components/circular-progress']
  }
  const { frontmatter: output } = processFrontmatter(rawFrontmatter, menuByPath)
  expect(output.related).toStrictEqual([
    { title: 'Circular Progress', path: 'vue-components/circular-progress.md' }
  ])
})

test('related entry with no resolvable title is dropped from output', () => {
  // An entry pointing at a page the AI-docs pipeline didn't generate has no
  // title. Emitting `{ title: null, path: ... }` would surface as a dangling
  // reference, so the resolver filters it output.
  const rawFrontmatter = {
    title: 'X',
    desc: '...',
    related: ['/vue-components/orphan']
  }
  const { frontmatter: output } = processFrontmatter(rawFrontmatter, menuByPath)
  expect(output.related).toStrictEqual([])
})

test('related entry with explicit object title is kept even when path is not in menu', () => {
  // Authors can provide an explicit `name`/`title`, in which case the entry
  // is renderable without a menu lookup. Only entries where the title is
  // null get dropped.
  const rawFrontmatter = {
    title: 'X',
    desc: '...',
    related: [{ name: 'External Reference', path: '/vue-components/orphan' }]
  }
  const { frontmatter: output } = processFrontmatter(rawFrontmatter, menuByPath)
  expect(output.related).toStrictEqual([
    { title: 'External Reference', path: 'vue-components/orphan.md' }
  ])
})

test('non-CLI source path leaves overline absent', () => {
  const { frontmatter: output } = processFrontmatter(
    { title: 'X' },
    menuByPath,
    'vue-components/knob.md'
  )
  expect(output.overline).toBe(void 0)
})

test('handles already-object related entries', () => {
  const rawFrontmatter = {
    title: 'X',
    desc: '...',
    related: [
      { name: 'Circular Progress', path: '/vue-components/circular-progress' }
    ]
  }
  const { frontmatter: output } = processFrontmatter(rawFrontmatter, menuByPath)
  expect(output.related).toStrictEqual([
    { title: 'Circular Progress', path: 'vue-components/circular-progress.md' }
  ])
})

test('object related entry with a title but empty path is dropped with a warning', () => {
  const { frontmatter: output } = processFrontmatter(
    { title: 'X', related: [{ name: 'Ghost', path: '' }] },
    menuByPath,
    'vue-components/knob.md'
  )
  expect(output.related).toStrictEqual([])
})

test('related entry outside a slice points at the live site, one inside stays relative', () => {
  const { frontmatter: output } = processFrontmatter(
    {
      title: 'Knob',
      related: ['/vue-components/circular-progress', '/vue-components/knob']
    },
    menuByPath,
    'vue-components/knob/knob.md',
    {
      pageKeys: new Set(['vue-components/knob']),
      siteUrl: 'https://quasar.dev'
    }
  )
  expect(output.related).toStrictEqual([
    {
      title: 'Circular Progress',
      path: 'https://quasar.dev/vue-components/circular-progress'
    },
    { title: 'Knob', path: 'knob.md' }
  ])
})

test('related entry outside the site run keeps the relative form', () => {
  const { frontmatter: output } = processFrontmatter(
    { title: 'Knob', related: ['/vue-components/circular-progress'] },
    menuByPath,
    'vue-components/knob/knob.md',
    { pageKeys: new Set(['vue-components/knob']) }
  )
  expect(output.related).toStrictEqual([
    { title: 'Circular Progress', path: 'circular-progress.md' }
  ])
})
