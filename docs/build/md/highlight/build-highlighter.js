import { createHighlighterCoreSync } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

import { langAlias, langs } from './build-langs.js'
import { themes } from './shared.js'

const engine = await createOnigurumaEngine(import('shiki/wasm'))

export const highlighter = createHighlighterCoreSync({
  engine,
  themes,
  langs,
  langAlias
})
