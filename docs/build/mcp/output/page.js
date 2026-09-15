/**
 * Writes one extracted .md file, wrapping the body with frontmatter only.
 * The body keeps source heading levels intact. Parent directories are
 * created as needed.
 *
 * No extra H1 gets added. The frontmatter `title:` field already carries
 * the page title, and source h1s keep their original level.
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import matter from 'gray-matter'

/**
 * @typedef {Object} WritePageOptions
 * @property {string} distDir       Absolute path to the output root.
 * @property {string} outputPath    Relative output path (`.md`) under `distDir`.
 * @property {Record<string, unknown> & { title?: string }} frontMatter Frontmatter to serialize.
 * @property {string} body          Markdown body (without frontmatter).
 */

/**
 * Compose `{ frontmatter, body }` and write to disk.
 *
 * @param {WritePageOptions} options
 * @returns {void}
 */
export function writePage({ distDir, outputPath, frontMatter, body }) {
  const destination = join(distDir, outputPath)
  mkdirSync(dirname(destination), { recursive: true })
  const fileContents = matter.stringify(body.trim() + '\n', frontMatter)
  writeFileSync(destination, fileContents, 'utf8')
}
