<template lang="pug">
div
  code-prism(:lang="lang")
    slot

  .absolute(style="top: 8px; right: 8px;")
    copy-button(:text="getMarkup")
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
    getMarkup () {
      return this.$el.querySelector('pre').innerText
    }
  }
}
</script>
