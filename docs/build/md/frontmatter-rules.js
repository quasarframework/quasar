/**
 * What a page's frontmatter may hold. The keys are few and each is read
 * somewhere that does not check it: a misspelt key is ignored without a
 * word, `keys` as a list crashes the search generator, a double quote
 * in a title breaks the attribute it is written into. The guide page
 * (src/pages/guide.md) documents the keys for whoever writes a page;
 * keep the two in step.
 */

import { existsSync } from 'node:fs'
import { join } from 'node:path'

const isText = value => typeof value === 'string' && value.trim() !== ''

// written into a double-quoted attribute of the page's root component
const attributeText = value =>
  !isText(value)
    ? 'must be a non-empty string'
    : value.includes('"')
      ? 'cannot hold a double quote, it is written into an HTML attribute'
      : null

// on by default, so the only thing to say is no
const optOut = value =>
  value === false ? null : 'can only be false (it is on by default)'

/** @type {Record<string, (value: unknown, ctx: { examplesDir: string }) => string | null>} */
const RULES = {
  title: attributeText,
  desc: attributeText,
  overline: attributeText,
  badge: attributeText,

  keys: value => {
    if (!isText(value)) {
      return 'must be a comma-separated string, like QTabs,QTab'
    }
    const names = value.split(',').map(name => name.trim())
    return names.includes('')
      ? 'has an empty name'
      : new Set(names).size !== names.length
        ? 'names the same thing twice'
        : null
  },

  examples: (value, { examplesDir }) =>
    !isText(value)
      ? 'must be the name of a folder under src/examples'
      : existsSync(join(examplesDir, value))
        ? null
        : `names src/examples/${value}, which does not exist`,

  related: value => {
    if (!Array.isArray(value) || value.length === 0) {
      return 'must be a non-empty list of routes'
    }
    const wrong = value.find(
      route => typeof route !== 'string' || !/^\/[^\s#]+$/.test(route)
    )
    return wrong !== void 0
      ? `holds ${JSON.stringify(wrong)}, expected a route like /vue-components/button`
      : new Set(value).size !== value.length
        ? 'lists the same route twice'
        : null
  },

  heading: optOut,
  editLink: optOut,

  scope: value =>
    value !== null && typeof value === 'object' && !Array.isArray(value)
      ? null
      : 'must be an object'
}

const REQUIRED = ['title', 'desc']

/**
 * @param {Record<string, unknown>} data The parsed frontmatter.
 * @param {{ examplesDir: string }} ctx
 * @returns {string[]} One line per problem, empty when there is none.
 */
export function frontMatterIssues(data, ctx) {
  const issues = []
  for (const key of REQUIRED) {
    if (data[key] === void 0) {
      issues.push(`${key}: is required`)
    }
  }
  for (const [key, value] of Object.entries(data)) {
    const rule = RULES[key]
    if (rule === void 0) {
      issues.push(
        `${key}: is not a frontmatter key, expected one of: ${Object.keys(RULES).join(', ')}`
      )
      continue
    }
    const issue = rule(value, ctx)
    if (issue !== null) {
      issues.push(`${key}: ${issue}`)
    }
  }
  return issues
}
