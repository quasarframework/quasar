/**
 * Rendering shared by the tests that sweep the whole site. Both of them need
 * every page put through the real pipeline, and one render is the expensive
 * part of either - keeping it in one place also keeps them from drifting into
 * measuring two slightly different sites.
 */

import { globSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { sourceToMenuKey } from '../ai-docs/routes.js'
import md from './md.js'
import { applyHtmlContentControl } from './md-parse.js'
import { parseFrontMatter } from './md-parse-utils.js'

const pagesDir = join(import.meta.dirname, '../../src/pages')

/**
 * Renders the way mdParse does, handing back exactly what it hands
 * reportPageIdIssues: the rendered markdown, and the front matter with the
 * TOC the render collected into it.
 *
 * @param {string} content the page body, front matter already taken off
 * @param {object} frontMatter
 */
export function renderPage(content, frontMatter = {}) {
  const fullFrontMatter = { ...frontMatter, toc: [], pageScripts: new Set() }

  md.$frontMatter = fullFrontMatter
  const html = md.render(content)
  md.$frontMatter = null

  return { html, frontMatter: fullFrontMatter }
}

/**
 * Every page under src/pages, with nothing held out: a page not on a route
 * today (__elements.md) is still one someone opens in dev, and holding it out
 * would mean the one page most likely to be edited carelessly is the one page
 * nothing checks.
 *
 * @returns {Array<{ rel: string, route: string, html: string, frontMatter: object }>}
 */
export function renderAllPages() {
  return globSync('**/*.md', { cwd: pagesDir }).map(rel => {
    // through the same content control mdParse runs first: whatever sits in
    // an <llm-only> block belongs to the AI export and never reaches the
    // site, so counting it here would report a fault that does not exist
    const { data, content } = parseFrontMatter(
      applyHtmlContentControl(readFileSync(join(pagesDir, rel), 'utf8'))
    )

    return {
      rel,
      // sourceToMenuKey owns the foo/foo.md -> /foo collapse the router uses
      route: '/' + sourceToMenuKey(rel),
      ...renderPage(content, data)
    }
  })
}
