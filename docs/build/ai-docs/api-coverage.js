/**
 * Coverage guard for API files. Every API with real content should be
 * reachable from some page. An API counts as covered when a page references
 * it directly with <DocApi>, or when the page its meta.docsUrl points at
 * references at least one sibling API. The sibling rule allows representative
 * coverage, e.g. the spinners page documents QSpinnerCube for all variants.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const DOC_API_RE = /<DocApi[^>]*\sfile="([^"]+)"/g
const CONTENT_KEYS = [
  'props',
  'slots',
  'events',
  'methods',
  'computedProps',
  'quasarConfOptions',
  'injection',
  'value',
  'arg',
  'modifiers'
]

/**
 * @param {{ apiDir: string, srcPagesDir: string, includedPages: string[] }} opts
 * @returns {string[]} warning messages, empty when everything is covered
 */
export function checkApiCoverage({ apiDir, srcPagesDir, includedPages }) {
  const warnings = []

  const referenced = new Set()
  for (const relativePath of includedPages) {
    let source
    try {
      source = readFileSync(join(srcPagesDir, relativePath), 'utf8')
    } catch {
      // Page listed but unreadable. The extraction loop already surfaced it.
      continue
    }
    for (const match of source.matchAll(DOC_API_RE)) {
      referenced.add(match[1])
    }
  }

  /** @type {Map<string, string[]>} docsUrl page slug -> API names pointing at it */
  const apisByPage = new Map()
  const hasContent = new Set()
  const withoutDocsUrl = []
  for (const fileName of readdirSync(apiDir)) {
    if (!fileName.endsWith('.json')) {
      continue
    }

    const name = fileName.replace(/\.json$/, '')
    let json
    try {
      json = JSON.parse(readFileSync(join(apiDir, fileName), 'utf8'))
    } catch {
      // Wording matches classifyWarning's config detection. A corrupt build
      // artifact should fail the build, consistently with doc-api.js.
      warnings.push(
        `API file ${fileName} failed to parse, skipped in coverage check`
      )
      continue
    }
    if (json === null || typeof json !== 'object' || Array.isArray(json)) {
      warnings.push(
        `API file ${fileName} failed to parse, skipped in coverage check (not a JSON object)`
      )
      continue
    }
    const hasNonEmptyKey = CONTENT_KEYS.some(key => {
      const value = json[key]
      if (value === void 0 || value === null) {
        return false
      }
      if (typeof value === 'object') {
        return Object.keys(value).length !== 0
      }
      return true
    })
    if (hasNonEmptyKey) {
      hasContent.add(name)
    }

    const docsUrl = json.meta?.docsUrl
    if (!docsUrl) {
      withoutDocsUrl.push(name)
      continue
    }
    const pageSlug = new URL(docsUrl).pathname.replace(/^\//, '')
    if (!apisByPage.has(pageSlug)) {
      apisByPage.set(pageSlug, [])
    }
    apisByPage.get(pageSlug).push(name)
  }

  for (const name of withoutDocsUrl) {
    if (hasContent.has(name) && !referenced.has(name)) {
      warnings.push(
        `API ${name} has content but no meta.docsUrl and no <DocApi> tag references it anywhere`
      )
    }
  }
  for (const [pageSlug, apiNames] of apisByPage) {
    const isPageCovered = apiNames.some(name => referenced.has(name))
    if (isPageCovered) {
      continue
    }
    const uncovered = apiNames.filter(name => hasContent.has(name))
    if (uncovered.length === 0) {
      continue
    }
    warnings.push(
      `API ${uncovered.join(', ')} points at page ${pageSlug} but no <DocApi> tag references it anywhere`
    )
  }
  return warnings
}
