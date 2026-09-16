import { transformMagicComments } from './code-magic-comments.js'

/**
 * Pick a backtick fence longer than any backtick run inside the content,
 * so code that itself contains ``` can't close the emitted fence early.
 *
 * @param {string} content fenced block body
 * @returns {string} fence delimiter, at least three backticks
 */
export function fenceFor(content) {
  const runs = content.match(/`{3,}/g)
  const longestRun = runs ? Math.max(...runs.map(run => run.length)) : 0
  return '`'.repeat(Math.max(3, longestRun + 1))
}

const FENCE_INFO_RE =
  /^(?<lang>\S+)?(?:\s+\[(?<attrs>[^\]]*)\])?(?:\s+(?<title>.+))?$/

/**
 * The site's fence info line: `lang [attrs] title`, every part optional
 * (````js /quasar.config file`, ````tabs In your code`). The attrs
 * are the site's rendering options and are dropped.
 *
 * @param {string} info
 * @returns {{ lang: string, title: string | null }}
 */
export function parseFenceInfo(info) {
  const match = FENCE_INFO_RE.exec(info.trim())
  return {
    lang: match?.groups.lang ?? '',
    title: match?.groups.title?.trim() || null
  }
}

/**
 * The paragraph a titled code block gets, the one form for a fence, a
 * tab and an inlined example: `Example "/quasar.config file":`. Nothing
 * for no title.
 *
 * @param {string | null} title
 * @returns {string}
 */
export function caption(title) {
  return title === null ? '' : `Example "${title.replace(/:$/, '')}":\n\n`
}

/**
 * A fenced code block, the site's magic comments applied.
 *
 * @param {string} lang
 * @param {string} code
 * @returns {string}
 */
export function renderFence(lang, code) {
  const content = transformMagicComments(code.replace(/\n$/, ''))
  const fence = fenceFor(content)
  return `${fence}${lang}\n${content}\n${fence}\n\n`
}
