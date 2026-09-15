/**
 * The API descriptors rendered once, for the ui slice: one
 * `api/<Name>.md` per `dist/api/<Name>.json`, in the exact form the
 * site pages inline (`<DocApi>`), so the @quasar/mcp server answers
 * `get_api` with the same compact markdown instead of the JSON.
 */

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { renderApi } from '../api/render.js'

/**
 * @param {{ distDir: string, apiDir: string }} opts The slice root and
 *   the built `dist/api` directory.
 * @returns {string[]} The descriptor names written, sorted.
 */
export function writeApiPages({ distDir, apiDir }) {
  const outDir = join(distDir, 'api')
  mkdirSync(outDir, { recursive: true })
  const names = readdirSync(apiDir)
    .filter(file => file.endsWith('.json'))
    .map(file => file.slice(0, -'.json'.length))
    .sort()
  for (const name of names) {
    const json = JSON.parse(readFileSync(join(apiDir, `${name}.json`), 'utf8'))
    writeFileSync(join(outDir, `${name}.md`), renderApi(name, json))
  }
  return names
}
