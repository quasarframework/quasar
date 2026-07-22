/**
 * Default prose emitters for the token walker.
 *
 * Heading levels are emitted at their source level (h1 -> #, h2 -> ##, ...).
 * The frontmatter `title:` field already carries the page title, so
 * per-page.js does not wrap the body with an extra H1.
 */

import { emit, emitTokens, registerEmitter } from './walker.js'
import { rewriteLink } from './link-rewrite.js'
import { transformMagicComments } from './code-magic-comments.js'
import { sourceToOutputPath } from '../routes.js'

/** @typedef {import('./walker.js').EmitCtx} EmitCtx */
/** @typedef {import('./walker.js').MarkdownItToken} MarkdownItToken */

/**
 * Escape literal pipes so a cell containing `|` (markdown-it strips the
 * source `\|` escape during table parsing) can't split into extra columns.
 *
 * @param {string} cell
 * @returns {string}
 */
function escapeTableCell(cell) {
  return cell.replaceAll('|', String.raw`\|`)
}

/**
 * Get the active list-nesting stack on ctx, lazily creating it on first use.
 *
 * @param {EmitCtx} ctx
 * @returns {Array<{type: 'bullet'|'ordered', counter: number}>}
 */
function listState(ctx) {
  if (!ctx._listStack) {
    ctx._listStack = []
  }
  return ctx._listStack
}

/**
 * Render an inline token's children into a flat string.
 *
 * Uses a shadow context with an empty prefixStack so inline-level emit()
 * calls don't apply the outer blockquote/container prefix here. The caller
 * emits the joined text back through the prefix-aware emit() on the real ctx.
 *
 * @param {MarkdownItToken} token
 * @param {EmitCtx} ctx
 * @returns {string}
 */
function inlineToText(token, ctx) {
  if (!token.children) {
    return ''
  }

  // A single emitTokens pass over all children, so emitter state (like
  // ctx._linkHref between link_open and link_close) survives across siblings.
  const childOutput = []
  const childCtx = {
    ...ctx,
    output: childOutput,
    prefixStack: [],
    _atLineStart: false
  }
  emitTokens(token.children, childCtx)
  return childOutput.join('')
}

/**
 * Register all prose-level emitters with the walker. Idempotent, call once
 * per pipeline setup before emitTokens runs.
 */
export function registerProseEmitters() {
  registerEmitter('heading_open', (token, ctx, { index, all }) => {
    const level = Number(token.tag.slice(1)) // h1 -> #, h2 -> ##, ...
    const hashes = '#'.repeat(level)
    const inline = all[index + 1]
    const text = inline?.type === 'inline' ? inlineToText(inline, ctx) : ''
    // DocExample reads this to suppress its own redundant `### {title}`
    // when the author already wrote a heading right before the example.
    ctx._lastBlockWasHeading = true
    emit(ctx, `${hashes} ${text}\n\n`)
  })
  registerEmitter('heading_close', () => {})
  registerEmitter('inline', (token, ctx) => {
    // Normally handled inside heading_open / paragraph_open via inlineToText.
    // Table cells have no such wrapping parent, so walk the children directly
    // and let the text emitter route into ctx._cellBuf.
    if (ctx._cellBuf && token.children) {
      emitTokens(token.children, ctx)
    }
  })

  registerEmitter('paragraph_open', (_token, ctx, { index, all }) => {
    const isInList = listState(ctx).length !== 0
    const inline = all[index + 1]
    const text = inline?.type === 'inline' ? inlineToText(inline, ctx) : ''
    // Paragraph content invalidates the heading-dedup marker, but only when
    // it actually produced text. An empty inline shouldn't reset the flag.
    if (text.trim() !== '') {
      ctx._lastBlockWasHeading = false
    }
    emit(ctx, text)
    // List items keep single-line spacing. Everything else gets a blank
    // separator line, which inside blockquotes/containers renders as a
    // `> ` line so consecutive paragraphs don't merge.
    emit(ctx, isInList ? '\n' : '\n\n')
  })
  registerEmitter('paragraph_close', () => {})

  registerEmitter('text', (token, ctx) => emit(ctx, token.content))
  registerEmitter('softbreak', (_, ctx) => emit(ctx, '\n'))
  registerEmitter('hardbreak', (_, ctx) => emit(ctx, '  \n'))

  registerEmitter('strong_open', (_, ctx) => emit(ctx, '**'))
  registerEmitter('strong_close', (_, ctx) => emit(ctx, '**'))
  registerEmitter('em_open', (_, ctx) => emit(ctx, '*'))
  registerEmitter('em_close', (_, ctx) => emit(ctx, '*'))
  registerEmitter('code_inline', (token, ctx) => {
    // Content containing a backtick (rare, CLI docs referencing template
    // literals) gets double-backtick fences with space padding so the inner
    // backtick can't read as the closing delimiter.
    if (token.content.includes('`')) {
      emit(ctx, '`` ' + token.content + ' ``')
    } else {
      emit(ctx, '`' + token.content + '`')
    }
  })

  registerEmitter('bullet_list_open', (_, ctx) => {
    ctx._lastBlockWasHeading = false
    listState(ctx).push({ type: 'bullet', counter: 0 })
  })
  registerEmitter('bullet_list_close', (_, ctx) => {
    listState(ctx).pop()
    if (listState(ctx).length === 0) {
      emit(ctx, '\n')
    }
  })
  registerEmitter('ordered_list_open', (_, ctx) => {
    ctx._lastBlockWasHeading = false
    listState(ctx).push({ type: 'ordered', counter: 0 })
  })
  registerEmitter('ordered_list_close', (_, ctx) => {
    listState(ctx).pop()
    if (listState(ctx).length === 0) {
      emit(ctx, '\n')
    }
  })

  registerEmitter('list_item_open', (_, ctx) => {
    const stack = listState(ctx)
    const top = stack.at(-1)
    top.counter += 1
    const indent = '  '.repeat(stack.length - 1)
    const marker = top.type === 'bullet' ? '- ' : `${top.counter}. `
    emit(ctx, indent + marker)
  })
  // No-op close: paragraph_open already emits the item's trailing '\n' when
  // wrapped, which list items always are. Another '\n' would double-space.
  registerEmitter('list_item_close', () => {})

  registerEmitter('fence', (token, ctx) => {
    // Quasar fence info is `lang [attrs] title`. Keep only the language.
    // Fences with info=tabs are overridden by tabs.js, registered later.
    const langMatch = token.info.trim().match(/^(\S+)/)
    const lang = langMatch ? langMatch[1] : ''
    const content = transformMagicComments(token.content.replace(/\n$/, ''))
    ctx._lastBlockWasHeading = false
    emit(ctx, '```' + lang + '\n' + content + '\n```\n\n')
  })

  registerEmitter('code_block', (token, ctx) => {
    const content = token.content.replace(/\n$/, '')
    ctx._lastBlockWasHeading = false
    emit(ctx, '```\n' + content + '\n```\n\n')
  })

  registerEmitter('blockquote_open', (_, ctx) => {
    ctx.prefixStack.push('> ')
  })
  registerEmitter('blockquote_close', (_, ctx) => {
    ctx.prefixStack.pop()
    emit(ctx, '\n')
  })

  registerEmitter('hr', (_, ctx) => {
    ctx._lastBlockWasHeading = false
    emit(ctx, '---\n\n')
  })

  // In-tree absolute hrefs become relative `.md` links. Unresolved ones
  // (start with `/` but not in menuPaths) keep their href and warn so
  // authors can fix typos.
  registerEmitter('link_open', (token, ctx) => {
    const hrefAttr = token.attrs?.find(([name]) => name === 'href')
    const href = hrefAttr ? hrefAttr[1] : ''
    const rewritten = rewriteLink(
      href,
      ctx.menuPaths,
      sourceToOutputPath(ctx.sourcePath)
    )
    const isUnresolvedInTree = href.startsWith('/') && rewritten === href
    if (isUnresolvedInTree) {
      ctx.warnings.push(`Unresolved in-tree link ${href} in ${ctx.sourcePath}`)
    }
    ctx._linkHref = rewritten
    emit(ctx, '[')
  })
  registerEmitter('link_close', (_, ctx) => {
    emit(ctx, `](${ctx._linkHref || ''})`)
    ctx._linkHref = void 0
  })

  registerEmitter('image', (token, ctx) => {
    const srcAttr = token.attrs?.find(([name]) => name === 'src')
    const src = srcAttr ? srcAttr[1] : ''
    const alt = token.content || ''
    emit(ctx, `![${alt}](${src})`)
  })

  // Tables render as GFM pipe tables. Cell text collects into rows via
  // ctx._cellBuf, then table_close serializes the whole thing.
  registerEmitter('table_open', (_, ctx) => {
    ctx._lastBlockWasHeading = false
    ctx._table = { rows: [] }
  })
  registerEmitter('thead_open', (_, ctx) => {
    ctx._table.section = 'head'
  })
  registerEmitter('thead_close', () => {})
  registerEmitter('tbody_open', (_, ctx) => {
    ctx._table.section = 'body'
  })
  registerEmitter('tbody_close', () => {})
  registerEmitter('tr_open', (_, ctx) => {
    ctx._table.row = []
  })
  registerEmitter('tr_close', (_, ctx) => {
    ctx._table.rows.push({ section: ctx._table.section, cells: ctx._table.row })
    ctx._table.row = null
  })
  registerEmitter('th_open', (_, ctx) => {
    ctx._cellBuf = []
  })
  registerEmitter('th_close', (_, ctx) => {
    ctx._table.row.push(ctx._cellBuf.join(''))
    ctx._cellBuf = null
  })
  registerEmitter('td_open', (_, ctx) => {
    ctx._cellBuf = []
  })
  registerEmitter('td_close', (_, ctx) => {
    ctx._table.row.push(ctx._cellBuf.join(''))
    ctx._cellBuf = null
  })

  registerEmitter('table_close', (_, ctx) => {
    const { rows } = ctx._table
    const head = rows.find(({ section }) => section === 'head')
    const body = rows.filter(({ section }) => section === 'body')
    const lines = []
    if (head) {
      lines.push(
        `| ${head.cells.map(escapeTableCell).join(' | ')} |`,
        `| ${head.cells.map(() => '---').join(' | ')} |`
      )
    }
    for (const row of body) {
      lines.push(`| ${row.cells.map(escapeTableCell).join(' | ')} |`)
    }
    emit(ctx, lines.join('\n') + '\n\n')
    ctx._table = null
  })
}
