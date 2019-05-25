import 'prismjs'

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
        class: 'doc-code ' + className
      }),
      [
        h('code', {
          class: 'doc-code__inner ' + className,
          domProps: {
            innerHTML: Prism.highlight(code, prismLanguage, language)
          }
        })
      ]
    )
  }
}
