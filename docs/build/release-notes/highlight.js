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

  if (prism.languages[ lang ] !== void 0) {
    const html = prism.highlight(str, prism.languages[ lang ], lang)
    return `<pre v-pre class="doc-code language-${lang}"><code>${html}</code></pre>`
  }

  return ''
}
