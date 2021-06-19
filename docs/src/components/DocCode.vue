<template lang="pug">
div
  code-prism(:lang="lang", :code="code")

  .absolute(style="top: 8px; right: 8px;")
    copy-button(:text="code")
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
    code: String,

    lang: {
      type: String,
      default: 'js'
    }
  }
}
</script>
