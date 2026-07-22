import { expect, test } from 'vitest'
import { resolve } from 'node:path'
import { docApiHandler } from '../emit/doc-api.js'

const __dirname = import.meta.dirname
const apiDir = resolve(__dirname, '../../../../ui/dist/api')

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
