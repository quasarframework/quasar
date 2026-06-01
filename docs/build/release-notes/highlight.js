import { highlighter } from '#md/highlight/build-highlighter.js'
import { supportedLangs } from '#md/highlight/build-langs.js'
import { buildBareTransformers, themeOptions } from '#md/highlight/shared.js'

const supportedLangSet = new Set(supportedLangs)

export default function highlight(str, lang) {
  const resolved = lang === '' ? 'js' : lang
  if (supportedLangSet.has(resolved) === false) {
    return ''
  }

  return highlighter
    .codeToHtml(str, {
      lang: resolved,
      ...themeOptions,
      transformers: buildBareTransformers()
    })
    .replace('<pre ', '<pre v-pre ')
}
