/**
 * markdown-it instance configured for AI-docs extraction.
 *
 * Differs from the HTML site config (md.js) in two ways:
 *   - typographer is off, smart quotes mangle code-like prose
 *     ("track's" -> "track’s")
 *   - no HTML render hooks, emission happens via the token walker
 */

import markdownIt from 'markdown-it'
import { registerAllParsing, sharedMdOptions } from '../md/md-rules.js'

/**
 * @returns {import('markdown-it')} configured markdown-it instance
 */
export function createAiMd() {
  const md = markdownIt({ ...sharedMdOptions, typographer: false })
  registerAllParsing(md)
  return md
}
