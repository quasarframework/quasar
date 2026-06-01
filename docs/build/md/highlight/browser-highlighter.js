import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

import { langAlias, langs } from './browser-langs.js'
import { themes } from './shared.js'

let cached = null

export function getBrowserHighlighter() {
  if (cached === null) {
    cached = createHighlighterCoreSync({
      engine: createJavaScriptRegexEngine(),
      themes,
      langs,
      langAlias
    })
  }
  return cached
}
