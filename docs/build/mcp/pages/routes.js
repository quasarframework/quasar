/**
 * Source path -> output path transformations.
 *
 * Collapse rule per spec D12: when the last two path segments are
 * identical (foo/foo.md), drop the duplicated dir, so
 * `vue-components/menu/menu.md` -> `vue-components/menu.md`.
 *
 * Both functions accept a forward-slash relative path with `.md`
 * extension (e.g. `vue-components/knob.md`).
 */

import { dirname, relative } from 'node:path/posix'

/**
 * @param {string} relativePath Relative source path with `.md` extension.
 * @returns {string} Output path with `.md` extension, applying the dir-collapse rule.
 */
export function sourceToOutputPath(relativePath) {
  const parts = relativePath.replace(/\.md$/, '').split('/')
  if (parts.length >= 2 && parts.at(-1) === parts.at(-2)) {
    parts.pop()
  }
  return parts.join('/') + '.md'
}

/**
 * @param {string} relativePath Relative source path with `.md` extension.
 * @returns {string} Menu key (no leading slash, no `.md`), applying the dir-collapse rule.
 */
export function sourceToMenuKey(relativePath) {
  const parts = relativePath.replace(/\.md$/, '').split('/')
  if (parts.length >= 2 && parts.at(-1) === parts.at(-2)) {
    parts.pop()
  }
  return parts.join('/')
}

/**
 * Relative `.md` path from one output file to another page's output file.
 * Relative links resolve correctly everywhere the files land: web server,
 * GitHub, local file tree.
 *
 * @param {string} targetKey Menu key of the target page (no leading slash, no `.md`).
 * @param {string} [fromOutputPath] Output path of the linking file. Empty means dist root.
 * @returns {string} e.g. `../quasar-plugins/dialog.md` from `vue-components/button.md`.
 */
export function relativeMdPath(targetKey, fromOutputPath = '') {
  const fromDir = dirname(fromOutputPath)
  return relative(fromDir, `${targetKey}.md`)
}
