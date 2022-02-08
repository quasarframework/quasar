<template lang="pug">
div
  code-prism(:lang="lang" :code="code" :style="style")

  .doc-code-container__copy.absolute
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
    maxHeight: String,

    lang: {
      type: String,
      default: 'js'
    }
  },

  computed: {
    style () {
      return this.maxHeight !== void 0
        ? { overflow: 'auto', maxHeight: this.maxHeight }
        : null
    }
  }
}
</script>

<style lang="sass">
.doc-code-container
  &__copy
    top: 8px
    right: 16px
</style>
