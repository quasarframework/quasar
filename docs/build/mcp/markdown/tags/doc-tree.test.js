import { expect, test } from 'vitest'
import { docTreeHandler } from './doc-tree.js'

test('renders a flat tree from frontmatter', () => {
  const handler = docTreeHandler()
  const token = { content: '<DocTree :def="scope.tree" />' }
  const ctx = {
    warnings: [],
    sourcePath: 't.md',
    frontMatter: {
      scope: {
        tree: {
          l: 'root',
          c: [{ l: 'child' }, { l: 'sib', e: 'sibling explanation' }]
        }
      }
    }
  }
  const output = handler.block(token, ctx)
  expect(output).toMatch(/- \*\*root\*\*/)
  expect(output).toMatch(/- \*\*child\*\*/)
  expect(output).toMatch(/- \*\*sib\*\*/)
  expect(output).toMatch(/sibling explanation/)
})

test('missing scope path logs warning', () => {
  const handler = docTreeHandler()
  const token = { content: '<DocTree :def="scope.missing" />' }
  const ctx = {
    warnings: [],
    sourcePath: 't.md',
    frontMatter: { scope: {} }
  }
  handler.block(token, ctx)
  expect(ctx.warnings.length).toBe(1)
  expect(ctx.warnings[0]).toMatch(/missing/)
})

test('node with kind=directory gets trailing slash', () => {
  const handler = docTreeHandler()
  const token = { content: '<DocTree :def="scope.tree" />' }
  const ctx = {
    warnings: [],
    sourcePath: 't.md',
    frontMatter: {
      scope: { tree: { l: 'src', k: 'directory', c: [] } }
    }
  }
  const output = handler.block(token, ctx)
  expect(output).toMatch(/- \*\*src\/\*\*/)
})

test('missing :def attribute emits nothing and warns', () => {
  const handler = docTreeHandler()
  const token = { content: '<DocTree />' }
  const ctx = { warnings: [], sourcePath: 't.md', frontMatter: {} }
  expect(handler.block(token, ctx)).toBe('')
  expect(ctx.warnings.length).toBe(1)
  expect(ctx.warnings[0]).toMatch(/missing :def=/)
})

test(':def resolving to null emits nothing and warns', () => {
  const handler = docTreeHandler()
  const token = { content: '<DocTree :def="scope.tree" />' }
  const ctx = {
    warnings: [],
    sourcePath: 't.md',
    frontMatter: { scope: { tree: null } }
  }
  expect(handler.block(token, ctx)).toBe('')
  expect(ctx.warnings.length).toBe(1)
  expect(ctx.warnings[0]).toMatch(/resolved to null/)
})
