import { expect, test } from 'vitest'
import { resolve } from 'node:path'
import { docExampleHandler } from './doc-example.js'

const __dirname = import.meta.dirname
const examplesDir = resolve(__dirname, '../../../src/examples')

test('inlines a real example .vue file', () => {
  const handler = docExampleHandler({ examplesDir })
  const token = { content: '<DocExample title="Basic" file="Basic" />' }
  const ctx = {
    warnings: [],
    sourcePath: 'vue-components/knob.md',
    frontMatter: { examples: 'QKnob' }
  }
  const output = handler.block(token, ctx)
  expect(output).toMatch(/### Basic/)
  expect(output).toMatch(/```vue/)
  expect(output).toMatch(/<template>/)
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

test('drops example title heading when preceding block was a heading (exact match)', () => {
  const handler = docExampleHandler({ examplesDir })
  const token = { content: '<DocExample title="Basic" file="Basic" />' }
  const ctx = {
    warnings: [],
    sourcePath: 'vue-components/knob.md',
    frontMatter: { examples: 'QKnob' },
    _lastBlockWasHeading: true
  }
  const output = handler.block(token, ctx)
  // The redundant `### Basic` heading must be suppressed.
  expect(output).not.toMatch(/^### Basic/)
  expect(output).toMatch(/^```vue/)
})

test('drops example title heading when preceding block was a heading (near-match)', () => {
  // Authors often write `### Min and max` followed by
  // `<DocExample title="Custom min/max" file="..." />`. The heading and the
  // example title differ in wording but the example still IS the section.
  const handler = docExampleHandler({ examplesDir })
  const token = {
    content: '<DocExample title="Custom min/max" file="Basic" />'
  }
  const ctx = {
    warnings: [],
    sourcePath: 'vue-components/knob.md',
    frontMatter: { examples: 'QKnob' },
    _lastBlockWasHeading: true
  }
  const output = handler.block(token, ctx)
  expect(output).not.toContain('### Custom min/max')
  expect(output).toMatch(/^```vue/)
})

test('keeps example title heading when no preceding heading present', () => {
  const handler = docExampleHandler({ examplesDir })
  const token = { content: '<DocExample title="Basic" file="Basic" />' }
  const ctx = {
    warnings: [],
    sourcePath: 'vue-components/knob.md',
    frontMatter: { examples: 'QKnob' },
    _lastBlockWasHeading: false
  }
  const output = handler.block(token, ctx)
  expect(output).toMatch(/^### Basic/)
})
