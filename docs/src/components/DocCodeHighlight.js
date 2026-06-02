import { h } from 'vue'

import { getBrowserHighlighter } from '#md/highlight/browser-highlighter.js'
import { supportedLangs } from '#md/highlight/browser-langs.js'
import { buildBrowserTransformers, themeOptions } from '#md/highlight/shared.js'

const supportedLangSet = new Set(supportedLangs)

export default {
  name: 'DocCodeHighlight',

  props: {
    code: String,
    lang: String
  },

  setup(props) {
    const lang = supportedLangSet.has(props.lang) ? props.lang : 'text'
    const html = getBrowserHighlighter().codeToHtml(props.code, {
      lang,
      ...themeOptions,
      transformers: buildBrowserTransformers()
    })

    return () => h('div', { innerHTML: html })
  }
}
