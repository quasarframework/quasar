import prism from 'prismjs'
import loadLanguages from 'prismjs/components/index.js'

loadLanguages([ 'markup', 'bash', 'javascript', 'typescript', 'sass', 'scss', 'css', 'json', 'xml', 'nginx', 'diff' ])

export default function highlight (str, lang) {
  if (lang === '') {
    lang = 'js'
  }
  else if (lang === 'vue' || lang === 'html') {
    lang = 'html'
  }
  else if (lang === 'jsonc') {
    // Prism permits comments in json blocks
    // But github requires jsonc
    lang = 'json'
  }

  if (prism.languages[ lang ] !== void 0) {
    const code = prism.highlight(str, prism.languages[ lang ], lang)
    return `<pre v-pre class="doc-code doc-code--prerendered language-${lang}">${code}</pre>`
  }

  return ''
}
