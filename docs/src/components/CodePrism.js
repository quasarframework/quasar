import 'prismjs'
import { h } from 'vue'

export default {
  name: 'CodePrism',

  props: {
    code: String,
    lang: String
  },

  render () {
    const className = `language-${this.lang}`

    return h('pre', { class: 'doc-code ' + className }, [
      h('code', {
        class: 'doc-code__inner ' + className,
        innerHTML: Prism.highlight(
          this.code,
          Prism.languages[ this.lang ],
          this.lang
        )
      })
    ])
  }
}
