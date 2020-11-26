import 'prismjs'
import { h, toRefs, computed } from 'vue'

export default {
  name: 'CodePrism',

  props: {
    code: String,
    lang: String
  },

  setup (props) {
    const { lang, code } = toRefs(props)
    const className = computed(() => `language-${lang.value}`)

    return () => h('pre', { class: 'doc-code ' + className.value }, [
      h('code', {
        class: 'doc-code__inner ' + className.value,
        innerHTML: Prism.highlight(
          code.value,
          Prism.languages[ lang.value ],
          lang.value
        )
      })
    ])
  }
}
