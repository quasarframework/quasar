/**
 * llms.txt index per https://llmstxt.org: an H1 site name, a blockquote
 * summary, then H2 sections with markdown link lists. Every entry links to
 * the served `.md` sibling of a docs page.
 *
 * Section titles and ordering come from the site navigation (see
 * buildSectionIndex in menu.js), with a title-cased fallback for page roots
 * the nav doesn't name.
 */

/**
 * @param {string} sectionKey Top-level segment of a page key, e.g. `vue-components`.
 * @param {Map<string, string>} sectionIndex Nav-derived titles by section key.
 * @returns {string}
 */
function sectionTitle(sectionKey, sectionIndex) {
  const navTitle = sectionIndex.get(sectionKey)
  if (navTitle) {
    return navTitle
  }
  return sectionKey
    .split('-')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * @typedef {object} LlmsTxtPage
 * @property {string} key - menu key, e.g. `vue-components/button`
 * @property {string} title
 * @property {string|null} desc
 */

/**
 * @param {{ pages: LlmsTxtPage[], sectionIndex: Map<string, string>, quasarVersion: string, baseUrl: string }} opts
 * @returns {string}
 */
export function buildLlmsTxt({ pages, sectionIndex, quasarVersion, baseUrl }) {
  /** @type {Map<string, LlmsTxtPage[]>} */
  const sections = new Map()
  // Seed with nav order so sections list in the same order as the site
  // navigation. Roots unknown to the nav get appended as encountered.
  for (const sectionKey of sectionIndex.keys()) {
    sections.set(sectionKey, [])
  }
  for (const page of pages) {
    const sectionKey = page.key.split('/')[0]
    if (!sections.has(sectionKey)) {
      sections.set(sectionKey, [])
    }
    sections.get(sectionKey).push(page)
  }

  let output = '# Quasar Framework\n\n'
  output +=
    '> Quasar is an MIT-licensed open-source Vue.js framework for building ' +
    'high-performance websites, PWAs, SSR sites, and mobile/desktop apps ' +
    'from a single codebase. This file indexes the markdown version of the ' +
    `official Quasar v${quasarVersion} documentation. Every link below ` +
    'serves plain markdown.\n'

  for (const [sectionKey, sectionPages] of sections) {
    if (sectionPages.length === 0) {
      continue
    }
    output += `\n## ${sectionTitle(sectionKey, sectionIndex)}\n\n`
    for (const { key, title, desc } of sectionPages) {
      const descSuffix = desc ? `: ${desc}` : ''
      output += `- [${title}](${baseUrl}/${key}.md)${descSuffix}\n`
    }
  }
  return output
}
