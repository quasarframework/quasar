/**
 * Strip <script doc>...</script> blocks from source markdown.
 * Runs BEFORE markdown-it parsing (pre-walker pass).
 *
 * Quasar source pages use <script doc>...</script> to inject Vue script
 * setup code into the docs site's runtime. It's meta-content, not part of
 * the docs prose. Drop it entirely from the AI export.
 *
 * Strict literal match on `<script doc>`: variants like `<script doc lang="ts">`
 * are NOT matched here. Broaden the regex if such variants surface.
 */

const SCRIPT_DOC_RE = /<script doc>[\s\S]*?<\/script>/g

/**
 * @param {string} source raw page source
 * @returns {string} source with <script doc> blocks removed
 */
export function stripScriptDoc(source) {
  return source.replace(SCRIPT_DOC_RE, '')
}
