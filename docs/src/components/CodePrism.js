import 'prismjs'

export default {
  props: {
    code: String,
    lang: String
  },

  computed: {
    className () {
      return `language-${this.lang}`
    }
  },

  render (h) {
    return h(
      'pre',
      { class: 'doc-code ' + this.className },
      [
        h('code', {
          class: 'doc-code__inner ' + this.className,
          domProps: {
            innerHTML: Prism.highlight(this.code, Prism.languages[this.lang], this.lang)
          }
        })
      ]
    )
  }
}
