<template lang="pug">
div
  code-prism(:lang="lang")
    slot

  .absolute(style="top: 8px; right: 8px;")
    copy-button(
      :text="markup"
    )
</template>

<script>
import CodePrism from './CodePrism.js'
import CopyButton from './CopyButton'

export default {
  name: 'DocCode',

  components: {
    CodePrism,
    CopyButton
  },

  props: {
    lang: {
      type: String,
      default: 'js'
    }
  },

  methods: {
    markup () {
      return this.$el.querySelector('pre')
    }
  }
}
</script>
