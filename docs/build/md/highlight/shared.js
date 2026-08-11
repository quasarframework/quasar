import { addClassToHast } from 'shiki/core'

import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight
} from '@shikijs/transformers'

import quasarLight from './themes/quasar-light.json' with { type: 'json' }
import quasarDark from './themes/quasar-dark.json' with { type: 'json' }

import { regionFoldTransformer } from './region-fold-transformer.js'

export const themes = [quasarLight, quasarDark]
export const themeOptions = {
  themes: { light: 'quasar-light', dark: 'quasar-dark' },
  defaultColor: false
}

const docCodePreTransformer = {
  name: 'docs:doc-code',
  pre(node) {
    addClassToHast(node, 'doc-code')
  }
}

/**
 * Avoid Safari bug in the regex engine where it fails to
 * properly highlight code that contains a comment with a diff marker
 * in certain scenarios.
 *
 * Example:
 *   api.compatibleWith(
 *    '@quasar/app-vite',
 *      '^2.0.0' // [!code --]
 *      '^3.0.0' // [!code ++]
 * )
 *
 * What we do here is split the comment into a separate line
 * before the actual code, so that the regex engine can handle it properly.
 */
const transformerSplitRE = /(.+?)(\s*\/\/\s*\[!code.+?\])/g
const transformerSplitComments = {
  name: 'split-diff-comments',
  // The preprocess hook runs BEFORE tokenization (where Safari fails)
  preprocess(code) {
    return code.replaceAll(transformerSplitRE, '$2\n$1')
  }
}

// Build-only transformers (eg. twoslash) are injected via this hook so
// they don't leak Node imports into the browser bundle. `md-plugin-codeblock.js`
// passes them in but `DocCode` does not.
export function buildFenceTransformers(buildOnly = []) {
  return [
    docCodePreTransformer,
    ...buildOnly,
    transformerNotationHighlight(),
    transformerNotationFocus(),
    transformerNotationDiff(),
    regionFoldTransformer()
  ]
}

// Used by the release-notes pipeline (build-only).
export function buildBareTransformers() {
  return [docCodePreTransformer]
}

// Used exclusively the the client runtime through DocCode.vue.
export function buildClientTransformers() {
  return [
    docCodePreTransformer,
    transformerSplitComments,
    transformerNotationHighlight(),
    transformerNotationFocus(),
    transformerNotationDiff(),
    regionFoldTransformer()
  ]
}
