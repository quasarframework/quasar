import { expect, test } from 'vitest'
import { resolve } from 'node:path'
import { docExampleHandler } from './doc-example.js'

const __dirname = import.meta.dirname
const examplesDir = resolve(__dirname, '../../../../src/examples')

test('inlines a real example .vue file', () => {
  const handler = docExampleHandler({ examplesDir })
  const token = { content: '<DocExample title="Basic" file="Basic" />' }
  const ctx = {
    warnings: [],
    sourcePath: 'vue-components/knob.md',
    frontMatter: { examples: 'QKnob' }
  }
  const output = handler.block(token, ctx)
  expect(output).toMatch(/^Example "Basic":\n\n```vue\n/)
  expect(output).toMatch(/<template>/)
  expect(output).not.toMatch(/^#/m)
})

test('missing file logs warning', () => {
  const handler = docExampleHandler({ examplesDir })
  const token = {
    content: '<DocExample title="Missing" file="NotARealExample" />'
  }
  const ctx = {
    warnings: [],
    sourcePath: 'vue-components/knob.md',
    frontMatter: { examples: 'QKnob' }
  }
  handler.block(token, ctx)
  expect(ctx.warnings.length).toBe(1)
  expect(ctx.warnings[0]).toMatch(/NotARealExample/)
})

test('a title repeating the section heading is left out of the label', () => {
  const handler = docExampleHandler({ examplesDir })
  const token = { content: '<DocExample title="Basic" file="Basic" />' }
  const ctx = {
    warnings: [],
    sourcePath: 'vue-components/knob.md',
    frontMatter: { examples: 'QKnob' },
    _heading: 'Basic'
  }
  expect(handler.block(token, ctx)).toMatch(/^Example:\n\n```vue\n/)
  // case and punctuation do not make it a different title
  ctx._heading = 'Mini-mode'
  token.content = '<DocExample title="Mini mode" file="Basic" />'
  expect(handler.block(token, ctx)).toMatch(/^Example:\n\n```vue\n/)
})

test('a title of its own is the label, under any heading', () => {
  const handler = docExampleHandler({ examplesDir })
  const token = {
    content: '<DocExample title="Custom min/max" file="Basic" />'
  }
  const ctx = {
    warnings: [],
    sourcePath: 'vue-components/knob.md',
    frontMatter: { examples: 'QKnob' },
    _heading: 'Min and max'
  }
  expect(handler.block(token, ctx)).toMatch(
    /^Example "Custom min\/max":\n\n```vue\n/
  )
})
