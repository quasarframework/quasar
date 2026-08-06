import { expect, test } from 'vitest'
import { join, resolve } from 'node:path'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { docApiHandler } from '../emit/doc-api.js'

const __dirname = import.meta.dirname
const apiDir = resolve(__dirname, '../../../../ui/dist/api')

// a built ui package is guaranteed by the vitest globalSetup preflight
test('renders QKnob API from real JSON file', () => {
  const handler = docApiHandler({ apiDir })
  const token = { content: '<DocApi file="QKnob" />' }
  const ctx = { warnings: [], sourcePath: 'vue-components/knob.md' }
  const output = handler.block(token, ctx)
  expect(output).toMatch(/## QKnob API/)
  expect(output).toMatch(/### Props/)
})

test('missing file logs warning and emits placeholder', () => {
  const handler = docApiHandler({ apiDir })
  const token = { content: '<DocApi file="QNonexistent" />' }
  const ctx = { warnings: [], sourcePath: 'vue-components/x.md' }
  const output = handler.block(token, ctx)
  expect(ctx.warnings.length).toBe(1)
  expect(ctx.warnings[0]).toMatch(/QNonexistent/)
  expect(output).toMatch(/<!-- DocApi: QNonexistent not found -->/)
})

test('malformed API JSON degrades to a placeholder comment and warns', () => {
  const brokenDir = mkdtempSync(join(tmpdir(), 'doc-api-'))
  try {
    writeFileSync(join(brokenDir, 'Broken.json'), '{ not json')
    const handler = docApiHandler({ apiDir: brokenDir })
    const token = { content: '<DocApi file="Broken" />' }
    const ctx = { warnings: [], sourcePath: 't.md' }
    const output = handler.block(token, ctx)
    expect(output).toMatch(/<!-- DocApi: Broken parse error/)
    expect(ctx.warnings[0]).toMatch(/failed to parse/)
  } finally {
    rmSync(brokenDir, { recursive: true, force: true })
  }
})

test('valid JSON that is not an object degrades the same way', () => {
  const brokenDir = mkdtempSync(join(tmpdir(), 'doc-api-'))
  try {
    writeFileSync(join(brokenDir, 'Nullish.json'), 'null')
    const handler = docApiHandler({ apiDir: brokenDir })
    const token = { content: '<DocApi file="Nullish" />' }
    const ctx = { warnings: [], sourcePath: 't.md' }
    const output = handler.block(token, ctx)
    expect(output).toMatch(/not a JSON object/)
    expect(ctx.warnings[0]).toMatch(/failed to parse/)
  } finally {
    rmSync(brokenDir, { recursive: true, force: true })
  }
})
