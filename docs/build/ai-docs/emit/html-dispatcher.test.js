import { expect, test } from 'vitest'
import { clearEmitters, createCtx, emit, emitTokens } from './walker.js'
import {
  clearTagHandlers,
  registerHtmlDispatchers,
  registerTagHandler
} from './html-dispatcher.js'

function setup() {
  clearEmitters()
  clearTagHandlers()
  registerHtmlDispatchers()
}

test('html_block with registered tag dispatches to handler', () => {
  setup()
  registerTagHandler('MyTag', { block: (token, ctx) => emit(ctx, '[mytag]') })
  const ctx = createCtx({ sourcePath: 't.md', frontMatter: {}, pageMenu: {} })
  const output = emitTokens([{ type: 'html_block', content: '<MyTag />' }], ctx)
  expect(output).toBe('[mytag]')
  expect(ctx.warnings.length).toBe(0)
})

test('html_block with unknown tag logs warning and emits nothing', () => {
  setup()
  const ctx = createCtx({ sourcePath: 't.md', frontMatter: {}, pageMenu: {} })
  const output = emitTokens(
    [{ type: 'html_block', content: '<UnknownThing />' }],
    ctx
  )
  expect(output).toBe('')
  expect(ctx.warnings.length).toBe(1)
  expect(ctx.warnings[0]).toMatch(/UnknownThing/)
})

test('html_inline falls back to q-badge inline transform', () => {
  setup()
  const ctx = createCtx({ sourcePath: 't.md', frontMatter: {}, pageMenu: {} })
  const output = emitTokens(
    [{ type: 'html_inline', content: '<q-badge label="v2.5.4+" />' }],
    ctx
  )
  expect(output).toBe('*(v2.5.4+)*')
})

test('html_block with q-* tag uses inline-tags transform', () => {
  setup()
  const ctx = createCtx({ sourcePath: 't.md', frontMatter: {}, pageMenu: {} })
  const output = emitTokens(
    [{ type: 'html_block', content: '<q-icon name="check" />' }],
    ctx
  )
  // q-icon -> empty
  expect(output).toBe('')
})

test('handler shape { inline } without block warns on html_block', () => {
  setup()
  registerTagHandler('InlineOnly', { inline: () => '' })
  const ctx = createCtx({ sourcePath: 't.md', frontMatter: {}, pageMenu: {} })
  emitTokens([{ type: 'html_block', content: '<InlineOnly />' }], ctx)
  expect(ctx.warnings.length).toBe(1)
})

test('strip-set HTML tag (br) is replaced with a space without warning', () => {
  setup()
  const ctx = createCtx({ sourcePath: 't.md', frontMatter: {}, pageMenu: {} })
  const output = emitTokens([{ type: 'html_inline', content: '<br>' }], ctx)
  // `<br>` is noise in prose. We drop it but keep a space to avoid
  // merging adjacent words.
  expect(output).toBe(' ')
  expect(ctx.warnings.length).toBe(0)
})

test('standard HTML inline tag passes through verbatim without warning', () => {
  setup()
  const ctx = createCtx({ sourcePath: 't.md', frontMatter: {}, pageMenu: {} })
  const output = emitTokens(
    [{ type: 'html_inline', content: '<kbd>F1</kbd>' }],
    ctx
  )
  expect(output).toBe('<kbd>F1</kbd>')
  expect(ctx.warnings.length).toBe(0)
})

test('standard HTML block tag passes through verbatim without warning', () => {
  setup()
  const ctx = createCtx({ sourcePath: 't.md', frontMatter: {}, pageMenu: {} })
  const output = emitTokens(
    [{ type: 'html_block', content: '<ul>\n<li>x</li>\n</ul>' }],
    ctx
  )
  expect(output).toBe('<ul>\n<li>x</li>\n</ul>')
  expect(ctx.warnings.length).toBe(0)
})

test('PascalCase Vue components still warn (not in standard HTML set)', () => {
  setup()
  const ctx = createCtx({ sourcePath: 't.md', frontMatter: {}, pageMenu: {} })
  const output = emitTokens(
    [{ type: 'html_block', content: '<UnknownVueComponent name="x" />' }],
    ctx
  )
  expect(output).toBe('')
  expect(ctx.warnings.length).toBe(1)
  expect(ctx.warnings[0]).toMatch(/UnknownVueComponent/)
})

test('strip-set HTML tag with uppercase letters still gets stripped (HTML is case-insensitive)', () => {
  setup()
  const ctx = createCtx({ sourcePath: 't.md', frontMatter: {}, pageMenu: {} })
  const output = emitTokens([{ type: 'html_inline', content: '<BR>' }], ctx)
  expect(output).toBe(' ')
  expect(ctx.warnings.length).toBe(0)
})

test('embedded Vue components are stripped from raw HTML passthrough blocks', () => {
  setup()
  const ctx = createCtx({ sourcePath: 't.md', frontMatter: {}, pageMenu: {} })
  // A `<div class="row">` wrapper around `<q-btn>` is a common authoring
  // pattern in start/landing pages. The wrapper is passed through, the
  // Vue component inside should be removed.
  const output = emitTokens(
    [
      {
        type: 'html_block',
        content: '<div class="row">\n  <q-btn label="Go" to="/start" />\n</div>'
      }
    ],
    ctx
  )
  expect(output, `q-btn should be stripped, got: ${output}`).not.toContain(
    '<q-btn'
  )
  expect(output).toContain('<div class="row">')
})

test('paired Vue component (TeamMember with attributes) is stripped from passthrough block', () => {
  setup()
  const ctx = createCtx({ sourcePath: 't.md', frontMatter: {}, pageMenu: {} })
  const output = emitTokens(
    [
      {
        type: 'html_block',
        content:
          '<div class="row">\n  <TeamMember\n    v-for="m in scope.core"\n    :name="m.name"\n  />\n</div>'
      }
    ],
    ctx
  )
  expect(output, `TeamMember should be stripped, got: ${output}`).not.toContain(
    '<TeamMember'
  )
})

test('closing standard HTML tag arriving as its own token passes through', () => {
  setup()
  const ctx = createCtx({ sourcePath: 't.md', frontMatter: {} })
  // markdown-it tokenizes inline `<kbd>X</kbd>` as open/text/close tokens.
  // Only the html tokens matter here, setup() registers no text emitter.
  const output = emitTokens(
    [
      { type: 'html_inline', content: '<kbd>' },
      { type: 'html_inline', content: '</kbd>' }
    ],
    ctx
  )
  expect(output).toBe('<kbd></kbd>')
  expect(ctx.warnings.length).toBe(0)
})

test('closing tag of a dropped component is dropped silently', () => {
  setup()
  const ctx = createCtx({ sourcePath: 't.md', frontMatter: {} })
  emitTokens([{ type: 'html_inline', content: '</TeamMember>' }], ctx)
  expect(ctx.output.join('')).toBe('')
  expect(ctx.warnings.length).toBe(0)
})
