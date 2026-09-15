import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { extractSection } from './docs.js'

/** The sections of an API descriptor `get_api` can serve on their own. */
export const API_PARTS = [
  'props',
  'slots',
  'events',
  'methods',
  'computedProps',
  'value',
  'arg',
  'modifiers',
  'injection',
  'quasarConfOptions'
]

/**
 * The heading(s) the docs renderer (docs/build/mcp/api/render.js)
 * gives each part in `api/<Name>.md`.
 */
const PART_HEADINGS = {
  props: ['Props'],
  slots: ['Slots', 'Scoped Slots'],
  events: ['Events'],
  methods: ['Methods'],
  computedProps: ['Computed Props'],
  value: ['Directive Value'],
  arg: ['Directive Argument'],
  modifiers: ['Directive Modifiers'],
  injection: ['Vue Injection'],
  quasarConfOptions: ['quasar.config.js Options']
}

const cache = new Map()

/**
 * @param {string} apiDir
 * @returns {string[]} Descriptor names (`QBtn`, `Notify`, `Ripple`, ...), sorted.
 */
export function listApi(apiDir) {
  return readdirSync(apiDir)
    .filter(file => file.endsWith('.json'))
    .map(file => file.slice(0, -'.json'.length))
    .sort()
}

/**
 * @param {string} apiDir
 * @param {string} name
 * @returns {Record<string, unknown> | null}
 */
export function readApi(apiDir, name) {
  const file = join(apiDir, `${name}.json`)
  let api = cache.get(file)
  if (api === void 0) {
    try {
      api = JSON.parse(readFileSync(file, 'utf8'))
    } catch {
      return null
    }
    cache.set(file, api)
  }
  return api
}

/**
 * Case-insensitive lookup that also forgives a missing `Q` prefix, so
 * `btn`, `qbtn` and `QBtn` all find QBtn.
 *
 * @param {string} apiDir
 * @param {string} name
 * @returns {string | null} The canonical descriptor name.
 */
export function resolveApiName(apiDir, name) {
  const names = listApi(apiDir)
  const wanted = name.trim().toLowerCase()
  return (
    names.find(known => known.toLowerCase() === wanted) ??
    names.find(known => known.toLowerCase() === `q${wanted}`) ??
    null
  )
}

/**
 * @param {string} apiDir
 * @param {string} name
 * @returns {string[]} Names containing the input, for a miss.
 */
export function similarApiNames(apiDir, name) {
  const needle = name.trim().toLowerCase().replace(/^q/, '')
  return listApi(apiDir)
    .filter(known => known.toLowerCase().includes(needle))
    .slice(0, 8)
}

/**
 * The descriptor as the site inlines it (`api/<Name>.md` in the ui
 * slice, rendered by the docs generator), whole or one part. Null when
 * the installed release bundles no rendered form, or the part has no
 * section there.
 *
 * @param {string} docsDir The ui slice (`dist/mcp`).
 * @param {string} name
 * @param {string} [part]
 * @returns {string | null}
 */
export function readApiMarkdown(docsDir, name, part) {
  const file = join(docsDir, 'api', `${name}.md`)
  let markdown = cache.get(file)
  if (markdown === void 0) {
    if (!existsSync(file)) {
      return null
    }
    markdown = readFileSync(file, 'utf8')
    cache.set(file, markdown)
  }
  if (part === void 0) {
    return markdown
  }
  const sections = PART_HEADINGS[part]
    .map(heading => extractSection(markdown, heading))
    .filter(section => section !== null)
  return sections.length === 0 ? null : sections.join('\n\n') + '\n'
}
