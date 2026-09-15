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

/** The parts whose entries are named members `get_api` can serve one of. */
export const MEMBER_PARTS = [
  'props',
  'computedProps',
  'methods',
  'events',
  'slots',
  'modifiers'
]

/**
 * Member names compare without case or punctuation: `modelValue`,
 * `model-value` and the rendered `@update:model-value` all meet.
 *
 * @param {string} value
 * @returns {string}
 */
function normalizeMember(value) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]/g, '')
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
  const markdown = readApiFile(docsDir, name)
  if (markdown === null) {
    return null
  }
  if (part === void 0) {
    return markdown
  }
  const sections = PART_HEADINGS[part]
    .map(heading => extractSection(markdown, heading))
    .filter(section => section !== null)
  return sections.length === 0 ? null : sections.join('\n\n') + '\n'
}

/**
 * @param {string} docsDir
 * @param {string} name
 * @returns {string | null}
 */
function readApiFile(docsDir, name) {
  const file = join(docsDir, 'api', `${name}.md`)
  let markdown = cache.get(file)
  if (markdown === void 0) {
    if (!existsSync(file)) {
      return null
    }
    markdown = readFileSync(file, 'utf8')
    cache.set(file, markdown)
  }
  return markdown
}

/**
 * The members of a descriptor named like `member`, across the parts
 * that have named members or in the one given.
 *
 * @param {Record<string, unknown>} api
 * @param {string} member
 * @param {string} [part]
 * @returns {Array<{ part: string, name: string }>}
 */
export function findApiMembers(api, member, part) {
  const wanted = normalizeMember(member)
  const matches = []
  for (const candidate of part === void 0 ? MEMBER_PARTS : [part]) {
    const entries = api[candidate]
    if (!entries || typeof entries !== 'object') {
      continue
    }
    for (const name of Object.keys(entries)) {
      if (normalizeMember(name) === wanted) {
        matches.push({ part: candidate, name })
      }
    }
  }
  return matches
}

/**
 * @param {Record<string, unknown>} api
 * @param {string} member
 * @param {string} [part]
 * @returns {string[]} `part.name` of the members containing the input, for a miss.
 */
export function similarApiMembers(api, member, part) {
  const needle = normalizeMember(member)
  const similar = []
  for (const candidate of part === void 0 ? MEMBER_PARTS : [part]) {
    const entries = api[candidate]
    if (!entries || typeof entries !== 'object') {
      continue
    }
    for (const name of Object.keys(entries)) {
      if (needle !== '' && normalizeMember(name).includes(needle)) {
        similar.push(`${candidate}.${name}`)
      }
    }
  }
  return similar.slice(0, 8)
}

/**
 * The name a rendered entry line (`- \`pagination\``, `- \`@click\``,
 * `- \`#default\``, `- \`toggle(): void\``) is about, null for any
 * other line.
 *
 * @param {string} line
 * @returns {string | null}
 */
function entryName(line) {
  const match = /^- `([^`]+)`/.exec(line)
  return match === null
    ? null
    : match[1].replace(/^[@#]/, '').replace(/\(.*$/, '')
}

/**
 * The rendered entries of the given members, each under its section
 * heading. Null when the release bundles no rendered form or none of
 * the members has an entry there.
 *
 * @param {string} docsDir
 * @param {string} name
 * @param {Array<{ part: string, name: string }>} members From findApiMembers().
 * @returns {string | null}
 */
export function readApiMembersMarkdown(docsDir, name, members) {
  const markdown = readApiFile(docsDir, name)
  if (markdown === null) {
    return null
  }
  const found = []
  for (const member of members) {
    const wanted = normalizeMember(member.name)
    for (const heading of PART_HEADINGS[member.part]) {
      const section = extractSection(markdown, heading)
      if (section === null) {
        continue
      }
      const [headingLine, ...lines] = section.split('\n')
      let entry = null
      for (const line of lines) {
        const current = entryName(line)
        if (current !== null) {
          if (entry !== null) {
            break
          }
          if (normalizeMember(current) === wanted) {
            entry = [line]
          }
        } else if (entry !== null) {
          entry.push(line)
        }
      }
      if (entry !== null) {
        found.push(`${headingLine}\n\n${entry.join('\n').trim()}`)
        break
      }
    }
  }
  return found.length === 0 ? null : found.join('\n\n') + '\n'
}
