import { addClassToHast } from 'shiki/core'

import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight
} from '@shikijs/transformers'

import quasarLight from './themes/quasar-light.json' with { type: 'json' }
import quasarDark from './themes/quasar-dark.json' with { type: 'json' }

import { bashPromptTransformer } from './bash-prompt-transformer.js'
import { lineDecorTransformer } from './line-decor-transformer.js'
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

function notationTransformers() {
  return [
    transformerNotationHighlight(),
    transformerNotationDiff(),
    transformerNotationFocus(),
    transformerNotationErrorLevel(),
    transformerNotationWordHighlight(),
    transformerMetaHighlight()
  ]
}

// Build-only transformers (twoslash, etc.) are injected via this hook so
// they don't leak Node imports into the browser bundle. `md-plugin-codeblock.js`
// passes them in but `DocCodeHighlight.js` does not.
export function buildFenceTransformers(attrs = {}, buildOnly = []) {
  return [
    docCodePreTransformer,
    ...buildOnly,
    ...notationTransformers(),
    bashPromptTransformer(),
    lineDecorTransformer(attrs),
    regionFoldTransformer()
  ]
}

export function buildBareTransformers() {
  return [
    docCodePreTransformer,
    bashPromptTransformer(),
    regionFoldTransformer()
  ]
}
