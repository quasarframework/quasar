const prism = require('prismjs')
const loadLanguages = require('prismjs/components/index')

loadLanguages([ 'markup', 'bash', 'javascript', 'sass', 'scss', 'css', 'json', 'xml' ])

module.exports = function (str, lang) {
  if (lang === '') {
    lang = 'js'
  }
  else if (lang === 'vue' || lang === 'html') {
    lang = 'html'
  }

  if (prism.languages[ lang ] !== void 0) {
    const code = prism.highlight(str, prism.languages[ lang ], lang)

    return `<pre v-pre class="doc-code language-${lang}">` +
      `<code class="doc-code__inner doc-code__inner--prerendered language-${lang}">${code}</code>` +
      `</pre>`
  }

  return ''
}
