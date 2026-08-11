/**
 * Tabs fence handler. Source format:
 *   ```tabs
 *   <<| ts setup |>>
 *   ...code...
 *   <<| js |>>
 *   ...code...
 *   ```
 *
 * Per spec D7: selective pruning by case-insensitive label substring.
 * Only prunes when ALL members of a pair/trio are present, so a TS-only
 * page doesn't accidentally collapse to nothing.
 *
 * Re-implements the `<<| ... |>>` line parser instead of importing from the
 * codeblock plugin. That plugin's parseDefinitionLine returns pre-rendered
 * HTML for the live site, but we need the raw tab list.
 */

import { emit, registerEmitter } from './walker.js'
import { transformMagicComments } from './code-magic-comments.js'
import { fenceFor } from './fence-utils.js'

/** @typedef {import('./walker.js').EmitCtx} EmitCtx */
/** @typedef {import('./walker.js').MarkdownItToken} MarkdownItToken */

/**
 * @typedef {object} Tab
 * @property {string} label
 * @property {string} lang
 * @property {string} code
 */

const COMPOSITION_RE = /composition/i
const OPTIONS_RE = /options/i
// Word boundaries: avoid "ts" matching inside "tsx-helper" labels.
const TS_RE = /\b(ts|typescript)\b/i
const JS_RE = /\b(js|javascript)\b/i
const PNPM_RE = /\bpnpm\b/i
const YARN_RE = /\byarn\b/i
const NPM_RE = /\bnpm\b/i

/**
 * Drop redundant alternative-syntax tabs when the canonical one is present.
 * Pruning is conservative: a pair/trio must be fully present before any drop.
 *
 * @param {Tab[]} tabs
 * @returns {Tab[]}
 */
export function pruneTabs(tabs) {
  const labels = tabs.map(({ label }) => label)

  // Drop only the redundant alternative, never unrelated tabs that happen
  // to share a group with a known pair/trio.

  // Composition/Options pair
  const hasComposition = labels.some(label => COMPOSITION_RE.test(label))
  const hasOptions = labels.some(label => OPTIONS_RE.test(label))
  if (hasComposition && hasOptions) {
    tabs = tabs.filter(({ label }) => !OPTIONS_RE.test(label))
  }

  // TS/JS pair
  const hasTs = tabs.some(({ label }) => TS_RE.test(label))
  const hasJs = tabs.some(({ label }) => JS_RE.test(label))
  if (hasTs && hasJs) {
    tabs = tabs.filter(({ label }) => !JS_RE.test(label))
  }

  // pnpm/yarn/npm trio. "pnpm" contains the substring "npm" so we exclude
  // pnpm-labelled tabs from the npm checks explicitly.
  const isPlainNpm = ({ label }) => NPM_RE.test(label) && !PNPM_RE.test(label)
  const hasPnpm = tabs.some(({ label }) => PNPM_RE.test(label))
  const hasYarn = tabs.some(({ label }) => YARN_RE.test(label))
  const hasNpm = tabs.some(isPlainNpm)
  if (hasPnpm && hasYarn && hasNpm) {
    tabs = tabs.filter(tab => !YARN_RE.test(tab.label) && !isPlainNpm(tab))
  }

  return tabs
}

/**
 * Render pruned tabs back to markdown. Single survivor -> a bare fenced block
 * (the label is redundant). Multiple survivors -> bolded label heading per block.
 *
 * @param {Tab[]} tabs
 * @returns {string}
 */
export function renderTabs(tabs) {
  if (tabs.length === 1) {
    const tab = tabs[0]
    const code = transformMagicComments(tab.code)
    const fence = fenceFor(code)
    return fence + tab.lang + '\n' + code + '\n' + fence + '\n\n'
  }
  return tabs
    .map(tab => {
      const code = transformMagicComments(tab.code)
      const fence = fenceFor(code)
      return `**${tab.label}:**\n\n${fence}${tab.lang}\n${code}\n${fence}\n\n`
    })
    .join('')
}

/**
 * Parse a `tabs` fence body into a `Tab[]`. The body splits on
 * `<<| lang [attrs] title |>>` marker lines. Everything between markers is
 * the preceding tab's code.
 *
 * @param {MarkdownItToken} token
 * @returns {Tab[]}
 */
function extractTabsFromFence(token) {
  const tabsLineRE =
    /^<<\|\s+(?<lang>\S+)(\s+\[(?<attrs>.*)\])?(\s+(?<title>.+))?\s*\|>>$/
  const tabs = []
  let current = null
  for (const line of token.content.split('\n')) {
    const matches = line.match(tabsLineRE)
    if (matches) {
      if (current) {
        tabs.push(current)
      }
      const title = matches.groups.title?.trim()
      current = {
        label: title || `Tab ${tabs.length + 1}`,
        lang: matches.groups.lang,
        code: ''
      }
    } else if (current) {
      current.code += (current.code ? '\n' : '') + line
    }
  }
  if (current) {
    tabs.push(current)
  }
  return tabs
}

// Local copy of prose's fence behavior for non-tabs fences. We can't import
// the original, registerEmitter replaces it.
const previousFence = (token, ctx) => {
  const langMatch = token.info.trim().match(/^(\S+)/)
  const lang = langMatch ? langMatch[1] : ''
  const content = transformMagicComments(token.content.replace(/\n$/, ''))
  const fence = fenceFor(content)
  ctx._lastBlockWasHeading = false
  emit(ctx, fence + lang + '\n' + content + '\n' + fence + '\n\n')
}

/**
 * Override the walker's `fence` emitter so info='tabs' takes priority. Must be
 * called AFTER registerProseEmitters so it wins for tabs while delegating to
 * the prose-style fence render for all other languages.
 */
export function registerTabsEmitter() {
  registerEmitter('fence', (token, ctx) => {
    const info = token.info.trim()
    if (
      info === 'tabs' ||
      info.startsWith('tabs ') ||
      info.startsWith('tabs\t')
    ) {
      const tabs = pruneTabs(extractTabsFromFence(token))
      ctx._lastBlockWasHeading = false
      emit(ctx, renderTabs(tabs))
      return
    }
    previousFence(token, ctx)
  })
}
