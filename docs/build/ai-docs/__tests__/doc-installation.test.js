import { expect, test } from 'vitest'
import { docInstallationHandler } from '../emit/doc-installation.js'

test('plugins attr (single) emits Installation heading + framework snippet', () => {
  const handler = docInstallationHandler()
  const token = { content: '<DocInstall plugins="LocalStorage" />' }
  const ctx = { warnings: [], sourcePath: 'plugins/web-storage.md' }
  const output = handler.block(token, ctx)
  expect(output).toMatch(/^## Installation/)
  expect(output).toMatch(/framework: \{/)
  expect(output).toMatch(/plugins: \[\s*'LocalStorage'\s*\]/)
})

test('plugins array', () => {
  const handler = docInstallationHandler()
  const token = {
    content: `<DocInstall :plugins="['LocalStorage','SessionStorage']" />`
  }
  const ctx = { warnings: [], sourcePath: 't.md' }
  const output = handler.block(token, ctx)
  expect(output).toMatch(/'LocalStorage'/)
  expect(output).toMatch(/'SessionStorage'/)
})

test('custom title is used as heading', () => {
  const handler = docInstallationHandler()
  const token = {
    content: '<DocInstall title="Custom Setup" components="QInput" />'
  }
  const ctx = { warnings: [], sourcePath: 't.md' }
  const output = handler.block(token, ctx)
  expect(output).toMatch(/## Custom Setup/)
})

test('components emits components: [] block', () => {
  const handler = docInstallationHandler()
  const token = { content: '<DocInstall components="QInput" />' }
  const ctx = { warnings: [], sourcePath: 't.md' }
  const output = handler.block(token, ctx)
  expect(output).toMatch(/components: \[\s*'QInput'\s*\]/)
})

test('directives emits directives: [] block', () => {
  const handler = docInstallationHandler()
  const token = { content: '<DocInstall directives="Ripple" />' }
  const ctx = { warnings: [], sourcePath: 't.md' }
  const output = handler.block(token, ctx)
  expect(output).toMatch(/directives: \[\s*'Ripple'\s*\]/)
})

test('empty attrs emits nothing and warns', () => {
  const handler = docInstallationHandler()
  const token = { content: '<DocInstall />' }
  const ctx = { warnings: [], sourcePath: 't.md' }
  const output = handler.block(token, ctx)
  expect(output).toBe('')
  expect(ctx.warnings.length).toBe(1)
  expect(ctx.warnings[0]).toMatch(/no components\/directives\/plugins\/config/)
})

test('config renders as an object keyed by feature name', () => {
  const handler = docInstallationHandler()
  const token = {
    content: '<DocInstall title="Configuration" config="notify" />'
  }
  const ctx = { warnings: [], sourcePath: 't.md' }
  const output = handler.block(token, ctx)
  expect(output).toMatch(/config: \{/)
  expect(output).toMatch(
    /notify: \{ \/\* look at QuasarConfOptions from the API card \*\/ \}/
  )
})
