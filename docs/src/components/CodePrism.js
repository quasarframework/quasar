import 'prismjs'
import { h, computed } from 'vue'

export default {
  name: 'CodePrism',

  props: {
    code: String,
    lang: String
  },

  setup (props) {
    const className = computed(() => `language-${props.lang}`)

    return () => h('pre', { class: 'doc-code ' + className.value }, [
      h('code', {
        class: 'doc-code__inner ' + className.value,
        innerHTML: Prism.highlight(
          props.code,
          Prism.languages[ props.lang ],
          props.lang
        )
      })
    ])
  }
}
