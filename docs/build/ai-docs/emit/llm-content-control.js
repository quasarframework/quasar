/**
 * Content-control tags borrowed from vitepress-plugin-llms:
 *   <llm-only>...</llm-only>       kept in AI export, stripped from HTML
 *   <llm-exclude>...</llm-exclude> stripped from AI export, kept in HTML
 *
 * Opening tags accept arbitrary attributes (e.g. `reason="..."`) for
 * self-documentation in source. Attributes are never emitted.
 *
 * This module handles the AI-export side as a pre-walker pass on raw source:
 * drop <llm-exclude> with its content, unwrap <llm-only> keeping content.
 */

const EXCLUDE_RE = /<llm-exclude(?:\s[^>]*)?>[\s\S]*?<\/llm-exclude>/g
const ONLY_OPEN_RE = /<llm-only(?:\s[^>]*)?>/g
const ONLY_CLOSE_RE = /<\/llm-only>/g

/**
 * @param {string} source raw page source
 * @returns {string} source with llm-exclude blocks removed and llm-only wrappers stripped
 */
export function applyLlmContentControl(source) {
  return source
    .replace(EXCLUDE_RE, '')
    .replace(ONLY_OPEN_RE, '')
    .replace(ONLY_CLOSE_RE, '')
}
