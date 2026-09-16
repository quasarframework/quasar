import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import { expect, onTestFinished, test } from 'vitest'
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

test('the demo padding leaves the root wrapper, which goes when nothing else is on it', () => {
  const dir = mkdtempSync(join(tmpdir(), 'quasar-mcp-examples-'))
  onTestFinished(() => {
    rmSync(dir, { recursive: true, force: true })
  })
  mkdirSync(join(dir, 'X'))
  const handler = docExampleHandler({ examplesDir: dir })
  const render = (file, vue) => {
    writeFileSync(join(dir, 'X', `${file}.vue`), vue)
    return handler.block(
      { content: `<DocExample title="T" file="${file}" />` },
      { warnings: [], sourcePath: 'p.md', frontMatter: { examples: 'X' } }
    )
  }
  expect(
    render(
      'Bare',
      '<template>\n  <div class="q-pa-md">\n    <q-btn label="Go">\n      <template v-slot:loading>\n        x\n      </template>\n    </q-btn>\n\n    <q-btn />\n  </div>\n</template>\n\n<script setup>\nconst a = 1\n</script>'
    )
  ).toContain(
    '<template>\n  <q-btn label="Go">\n    <template v-slot:loading>\n      x\n    </template>\n  </q-btn>\n\n  <q-btn />\n</template>\n\n<script setup>'
  )
  for (const [wrapper, kept] of [
    ['<div class="q-pa-md q-gutter-sm">', '<div class="q-gutter-sm">'],
    [
      '<div class="q-pa-md" style="max-width: 300px">',
      '<div style="max-width: 300px">'
    ],
    ['<div class="row q-px-lg q-py-sm">', '<div class="row">'],
    ['<div id="demo">', '<div id="demo">']
  ]) {
    const vue = `<template>\n  ${wrapper}\n    <q-btn />\n  </div>\n</template>`
    expect(render('Kept', vue), wrapper).toContain(
      `<template>\n  ${kept}\n    <q-btn />\n  </div>\n</template>`
    )
  }
  for (const wrapper of ['<div class="q-pa-lg">', '<div>']) {
    const vue = `<template>\n  ${wrapper}\n    <q-btn />\n  </div>\n</template>`
    expect(render('Gone', vue), wrapper).toContain(
      '<template>\n  <q-btn />\n</template>'
    )
  }
  // a second root next to the wrapper: nothing to unwrap
  const siblings =
    '<template>\n  <div class="q-pa-md">\n    <q-btn />\n  </div>\n  <q-dialog />\n</template>'
  expect(render('Siblings', siblings)).toContain(siblings)
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

test('a title repeating the section heading gets no label', () => {
  const handler = docExampleHandler({ examplesDir })
  const token = { content: '<DocExample title="Basic" file="Basic" />' }
  const ctx = {
    warnings: [],
    sourcePath: 'vue-components/knob.md',
    frontMatter: { examples: 'QKnob' },
    _heading: 'Basic'
  }
  expect(handler.block(token, ctx)).toMatch(/^```vue\n/)
  // case and punctuation do not make it a different title
  ctx._heading = 'Mini-mode'
  token.content = '<DocExample title="Mini mode" file="Basic" />'
  expect(handler.block(token, ctx)).toMatch(/^```vue\n/)
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
