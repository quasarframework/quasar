<template lang="pug">
.doc-code-container
  code-prism(:lang="lang" :code="code" :style="style")

  .doc-code-container__copy.absolute
    copy-button(:text="code")
</template>

<script>
import { computed } from 'vue'

import CodePrism from './CodePrism.js'
import CopyButton from './CopyButton.vue'

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

  setup (props) {
    const style = computed(() => (
      props.maxHeight !== void 0
        ? { overflow: 'auto', maxHeight: props.maxHeight }
        : null
    ))

    return { style }
  }
}
</script>

<style lang="sass">
.doc-code-container
  &__copy
    top: 8px
    right: 16px
</style>
