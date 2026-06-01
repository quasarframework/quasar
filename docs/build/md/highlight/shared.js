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

export function buildFenceTransformers(attrs = {}) {
  return [
    docCodePreTransformer,
    ...notationTransformers(),
    bashPromptTransformer(),
    lineDecorTransformer(attrs)
  ]
}

export function buildBareTransformers() {
  return [docCodePreTransformer, bashPromptTransformer()]
}
