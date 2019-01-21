const prism = require('prismjs')
const loadLanguages = require('prismjs/components/index')

loadLanguages(['markup', 'bash', 'javascript', 'stylus', 'css', 'json'])

module.exports = function (str, lang) {
  // let rawLang = lang

  if (lang === '') {
    lang = 'js'
    // rawLang = 'js'
  }
  else if (lang === 'vue' || lang === 'html') {
    lang = 'html'
  }

  if (prism.languages[lang] !== void 0) {
    const code = prism.highlight(str, prism.languages[lang], lang)

    return `<pre v-pre class="doc-code language-${lang}">` +
      `<code>${code}</code>` +
      `</pre>`
  }

  return ''
}
