/**
 * Token walker for AI-docs extraction.
 *
 * Walks markdown-it's flat token stream and dispatches each token to a
 * registered emitter. Emitters append markdown text to the output buffer.
 * Block-level prefixes (blockquotes, container alerts) are stacked in
 * ctx.prefixStack and applied per emitted line.
 *
 * Emitters register via registerEmitter(tokenType, fn) before extract runs.
 */

/**
 * Per-page mutable emit context. Threaded through every emitter call so
 * stateful concerns stay scoped to a single page instead of leaking
 * through globals.
 *
 * @typedef {object} EmitCtx
 * @property {string[]} output - accumulated markdown chunks
 * @property {string[]} prefixStack - active blockquote/indent prefixes for nested wrappers
 * @property {Record<string, any>} frontMatter - source page frontmatter
 * @property {string} sourcePath - relative path, used in warnings and link resolution
 * @property {Set<string>} menuPaths - slug strings (no leading `/`, no `.md` suffix) for in-tree link rewriting
 * @property {string[]} warnings
 * @property {boolean} _atLineStart - whether the next emit lands at the start of a line
 * @property {Array<{type: 'bullet'|'ordered', counter: number}>} [_listStack] - list nesting stack
 * @property {string[]} [_cellBuf] - active table cell buffer (when emitting inside <td>/<th>)
 * @property {string} [_linkHref] - active link target (set in link_open, used in link_close)
 * @property {boolean} [_lastBlockWasHeading] - true when the previous block was a heading with no body content after it, used by doc-example to suppress a redundant title
 * @property {{rows: Array<{section: 'head'|'body', cells: string[]}>, row: string[]|null, section: 'head'|'body'}} [_table] - active table state
 */

/**
 * Subset of the markdown-it Token shape that emitters care about. Typed
 * loosely because markdown-it ships permissive types and we only read fields.
 *
 * @typedef {object} MarkdownItToken
 * @property {string} type
 * @property {string} [tag]
 * @property {string} [content]
 * @property {string} [info]
 * @property {string} [markup]
 * @property {number} [nesting]
 * @property {number} [level]
 * @property {Array<[string, string]>} [attrs]
 * @property {MarkdownItToken[]|null} [children]
 */

/**
 * Emitter signature. The optional meta arg lets emitters peek at siblings.
 * For example, heading_open consumes the following inline token for its text.
 *
 * @typedef {(token: MarkdownItToken, ctx: EmitCtx, meta?: {index: number, all: MarkdownItToken[]}) => void} TokenEmitter
 */

/** @type {Map<string, TokenEmitter>} */
const emitters = new Map()

/**
 * Register an emitter for a markdown-it token type. Later registrations win.
 * That is how special-case plugins like tabs override the prose fallback.
 *
 * @param {string} tokenType
 * @param {TokenEmitter} emitter
 */
export function registerEmitter(tokenType, emitter) {
  emitters.set(tokenType, emitter)
}

/**
 * Clear all registered emitters. Keeps registrations from leaking across
 * test runs.
 */
export function clearEmitters() {
  emitters.clear()
}

/**
 * Build a fresh per-page emit context.
 *
 * @param {object} params
 * @param {string} params.sourcePath
 * @param {Record<string, any>} params.frontMatter
 * @param {Set<string>} [params.menuPaths] - slug strings used by link-rewrite
 * @returns {EmitCtx}
 */
export function createCtx({ sourcePath, frontMatter, menuPaths = new Set() }) {
  return {
    output: [],
    prefixStack: [],
    frontMatter,
    sourcePath,
    menuPaths,
    warnings: [],
    _atLineStart: true,
    _lastBlockWasHeading: false
  }
}

/**
 * Append text to the output buffer, prepending the active prefix stack at
 * every line start so nested blockquote/container wrappers stay aligned.
 *
 * When emitting inside a table cell (ctx._cellBuf set), route to the cell
 * buffer so the table_close emitter can serialize cells as a single
 * pipe-table line. This covers all inline markup uniformly without each
 * emitter needing its own _cellBuf check.
 *
 * @param {EmitCtx} ctx
 * @param {string} text
 */
export function emit(ctx, text) {
  if (text === '' || text === void 0) {
    return
  }
  if (ctx._cellBuf) {
    ctx._cellBuf.push(text)
    return
  }
  if (ctx.prefixStack.length === 0) {
    ctx.output.push(text)
    // Track line-start so a later prefix-mode emit prepends correctly.
    ctx._atLineStart = text.endsWith('\n')
    return
  }

  const prefix = currentPrefix(ctx)
  for (const character of text) {
    if (ctx._atLineStart) {
      ctx.output.push(prefix)
      ctx._atLineStart = false
    }
    ctx.output.push(character)
    if (character === '\n') {
      ctx._atLineStart = true
    }
  }
}

/**
 * Push a line-start prefix (e.g. '> ' for blockquote) onto the stack.
 *
 * @param {EmitCtx} ctx
 * @param {string} prefix
 */
export function pushPrefix(ctx, prefix) {
  ctx.prefixStack.push(prefix)
}

/**
 * Pop the most recently pushed prefix.
 *
 * @param {EmitCtx} ctx
 */
export function popPrefix(ctx) {
  ctx.prefixStack.pop()
}

/**
 * Concat the active prefix stack into the single string prepended at line starts.
 *
 * @param {EmitCtx} ctx
 * @returns {string}
 */
export function currentPrefix(ctx) {
  return ctx.prefixStack.join('')
}

/** Alert names recognized at the start of plain `> ` blockquotes. Authors who
 * wrote `> Note that...` get the same GFM alert as the container syntax. */
const PLAIN_BLOCKQUOTE_PREFIX_RE =
  /^> (Note|Notes|Important|Warning|Caution|Tip|Tips):?\s/gm

/** Leading word to GFM alert. Conservative on purpose, only this small set
 * is upgraded. */
const PLAIN_ALERT_MAP = {
  Note: 'NOTE',
  Notes: 'NOTE',
  Tip: 'TIP',
  Tips: 'TIP',
  Important: 'IMPORTANT',
  Warning: 'WARNING',
  Caution: 'CAUTION'
}

/**
 * Tidy-up passes over the joined output:
 * - drop trailing `> ` lines left behind when a blockquote closes, while
 *   keeping interior `> ` lines that separate quoted paragraphs
 * - collapse runs of 3+ blank lines
 * - upgrade plain `> Note ...` blockquotes to GFM alerts
 * - strip a redundant `> **TIP**` line right after `> [!TIP]`
 *
 * @param {string} joinedOutput
 * @returns {string}
 */
function postProcess(joinedOutput) {
  let result = joinedOutput.replaceAll(/^> [ \t]*\n(?!> )/gm, '')
  result = result.replaceAll(/\n{3,}/g, '\n\n')
  result = result.replace(PLAIN_BLOCKQUOTE_PREFIX_RE, (line, word) => {
    const alert = PLAIN_ALERT_MAP[word]
    if (!alert) {
      return line
    }
    const body = line.replace(/^> [A-Z][A-Za-z]+:?\s/, '')
    return `> [!${alert}]\n> ${body}`
  })
  result = result.replaceAll(
    /^(> \[![A-Z]+\]\n)> \*\*(TIP|TIPS|NOTE|NOTES|WARNING|WARNINGS|CAUTION|IMPORTANT)\*\*\n/gm,
    '$1'
  )
  return result
}

/**
 * Walk a token stream and emit its markdown into ctx.output. Unknown token
 * types are recorded as warnings rather than thrown, so one unhandled plugin
 * doesn't kill the whole page.
 *
 * @param {MarkdownItToken[]} tokens
 * @param {EmitCtx} ctx
 * @returns {string} joined output buffer
 */
export function emitTokens(tokens, ctx) {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const emitter = emitters.get(token.type)
    if (!emitter) {
      ctx.warnings.push(
        `No emitter for token type '${token.type}' in ${ctx.sourcePath}`
      )
      continue
    }
    emitter(token, ctx, { index: i, all: tokens })
  }
  return postProcess(ctx.output.join(''))
}
