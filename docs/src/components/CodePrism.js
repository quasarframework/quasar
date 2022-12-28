import 'prismjs'
import { h, computed } from 'vue'

export default {
  name: 'CodePrism',

  props: {
    code: String,
    lang: String
  },

  setup (props) {
    const html = computed(() => Prism.highlight(
      props.code,
      Prism.languages[ props.lang ],
      props.lang
    ))

    return () => h('pre', { class: `doc-code language-${ props.lang }`, innerHTML: html.value })
  }
}
