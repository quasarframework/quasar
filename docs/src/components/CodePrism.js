import 'prismjs'
import 'prismjs/themes/prism-okaidia.css'

export default {
  functional: true,

  props: {
    code: {
      type: String
    },

    lang: String
  },

  render (h, ctx) {
    const
      code = ctx.props.code || ctx.children[0].text,
      language = ctx.props.lang,
      prismLanguage = Prism.languages[language],
      className = `language-${language}`

    return h(
      'pre',
      Object.assign({}, ctx.data, {
        class: [ctx.data.class, className]
      }),
      [
        h('code', {
          class: className,
          domProps: {
            innerHTML: Prism.highlight(code, prismLanguage, language)
          }
        })
      ]
    )
  }
}
