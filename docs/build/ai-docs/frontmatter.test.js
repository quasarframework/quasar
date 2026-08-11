import { expect, test } from 'vitest'
import { processFrontmatter } from './frontmatter.js'

const menuByPath = new Map([
  ['vue-components/knob', { title: 'Knob' }],
  ['vue-components/circular-progress', { title: 'Circular Progress' }]
])

test('keeps title/desc/overline; drops id/keys/examples/scope/nav', () => {
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
  expect(Object.keys(output).sort()).toStrictEqual([
    'desc',
    'overline',
    'title'
  ])
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

test('CLI vite source path auto-injects overline when missing', () => {
  const { frontmatter: output } = processFrontmatter(
    { title: 'X' },
    menuByPath,
    'quasar-cli-vite/state.md'
  )
  expect(output.overline).toBe('Quasar CLI with Vite - @quasar/app-vite')
})

test('CLI webpack source path auto-injects overline when missing', () => {
  const { frontmatter: output } = processFrontmatter(
    { title: 'X' },
    menuByPath,
    'quasar-cli-webpack/state.md'
  )
  expect(output.overline).toBe('Quasar CLI with Webpack - @quasar/app-webpack')
})

test('explicit overline wins over CLI-path injection', () => {
  const { frontmatter: output } = processFrontmatter(
    { title: 'X', overline: 'Custom' },
    menuByPath,
    'quasar-cli-vite/state.md'
  )
  expect(output.overline).toBe('Custom')
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
