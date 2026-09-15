import { expect, test } from 'vitest'
import { join, resolve } from 'node:path'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { docApiHandler } from './doc-api.js'
import { apiParts } from '../../api/render.js'

const __dirname = import.meta.dirname
const apiDir = resolve(__dirname, '../../../../../ui/dist/api')

// a built ui package is guaranteed by the vitest globalSetup preflight
test('renders QKnob API from real JSON file', () => {
  const handler = docApiHandler({ apiDir })
  const token = { content: '<DocApi file="QKnob" />' }
  const ctx = { warnings: [], sourcePath: 'vue-components/knob.md' }
  const output = handler.block(token, ctx)
  expect(output).toMatch(/## QKnob API/)
  expect(output).toMatch(/### Props/)
})

test('emits a get_api pointer instead of the API when referenceOnly, naming the parts the descriptor has', () => {
  const handler = docApiHandler({ apiDir, referenceOnly: true })
  const ctx = { warnings: [], sourcePath: 'vue-components/knob.md' }

  const knob = JSON.parse(readFileSync(join(apiDir, 'QKnob.json'), 'utf8'))
  const knobParts = apiParts(knob)
  expect(knobParts[0]).toBe('props')
  const component = handler.block({ content: '<DocApi file="QKnob" />' }, ctx)
  expect(component).toBe(
    `## QKnob API\n\nNot inlined here: call the \`get_api\` tool with \`name: "QKnob"\` for its definition, or add \`part\` (${knobParts.map(part => `\`${part}\``).join(', ')}) for one of them.\n\n`
  )
  expect(component).not.toMatch(/### Props/)

  // a plugin: no props/slots/events, but injection and config options
  const plugin = handler.block({ content: '<DocApi file="Notify" />' }, ctx)
  expect(plugin).toContain(
    'with `name: "Notify"` for its definition, or add `part` (`methods`, `injection`, `quasarConfOptions`) for one of them.'
  )

  // a directive
  const directive = handler.block({ content: '<DocApi file="Ripple" />' }, ctx)
  expect(directive).toContain(
    'with `name: "Ripple"` for its definition, or add `part` (`quasarConfOptions`, `value`, `arg`, `modifiers`) for one of them.'
  )
  expect(ctx.warnings).toEqual([])
})

test('a single-part descriptor gets no part clause, an empty part does not count', () => {
  const dir = mkdtempSync(join(tmpdir(), 'doc-api-'))
  try {
    writeFileSync(
      join(dir, 'Brand.json'),
      JSON.stringify({
        type: 'plugin',
        internal: true,
        props: {},
        quasarConfOptions: { definition: { primary: { type: 'String' } } }
      })
    )
    const handler = docApiHandler({ apiDir: dir, referenceOnly: true })
    const ctx = { warnings: [], sourcePath: 'style/color-palette.md' }
    const output = handler.block({ content: '<DocApi file="Brand" />' }, ctx)
    expect(output).toBe(
      '## Brand API\n\nNot inlined here: call the `get_api` tool with `name: "Brand"` for its `quasarConfOptions` definition.\n\n'
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('referenceOnly degrades on malformed JSON like the rendered form', () => {
  const dir = mkdtempSync(join(tmpdir(), 'doc-api-'))
  try {
    writeFileSync(join(dir, 'Broken.json'), '{ not json')
    const handler = docApiHandler({ apiDir: dir, referenceOnly: true })
    const ctx = { warnings: [], sourcePath: 't.md' }
    const output = handler.block({ content: '<DocApi file="Broken" />' }, ctx)
    expect(output).toMatch(/<!-- DocApi: Broken parse error/)
    expect(ctx.warnings[0]).toMatch(/failed to parse/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('referenceOnly still reports a missing API file', () => {
  const handler = docApiHandler({ apiDir, referenceOnly: true })
  const token = { content: '<DocApi file="QNonexistent" />' }
  const ctx = { warnings: [], sourcePath: 'vue-components/x.md' }
  const output = handler.block(token, ctx)
  expect(ctx.warnings.length).toBe(1)
  expect(output).toMatch(/<!-- DocApi: QNonexistent not found -->/)
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
