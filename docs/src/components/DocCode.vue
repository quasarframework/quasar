<template lang="pug">
.doc-code.relative-position
  code-prism(:lang="lang")
    slot

  .absolute(
    v-if="copy"
    style="top: 8px; right: 8px;"
  )
    q-btn(
      color="white"
      round
      dense
      flat
      icon="content_copy"
      @click="copyToClipboard"
    )
      q-tooltip Copy to Clipboard

  transition(
    v-if="copy"
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  )
    .absolute(
      v-show="copied"
      class="text-white"
      style="top: 18px; right: 58px;"
    ) Copied to clipboard
</template>

<script>
import CodePrism from './CodePrism.js'

export default {
  name: 'DocCode',

  components: {
    CodePrism
  },

  props: {
    lang: {
      type: String,
      default: 'js'
    },
    copy: Boolean
  },

  data: () => ({ copied: false }),

  methods: {
    copyToClipboard () {
      const markup = this.$el.querySelector('pre')

      markup.setAttribute('contenteditable', 'true')
      markup.focus()

      document.execCommand('selectAll', false, null)
      document.execCommand('copy')
      markup.removeAttribute('contenteditable')

      if (window.getSelection) {
        const sel = window.getSelection()

        if (sel.removeAllRanges) {
          sel.removeAllRanges()
        }
        else if (sel.empty) {
          sel.empty()
        }
      }
      else if (document.selection) {
        document.selection.empty && document.selection.empty()
      }

      this.copied = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.copied = false
        this.timer = null
      }, 2000)
    }
  }
}
</script>

<style lang="stylus">
@import '~quasar-variables'

.doc-code
  position relative
  font-size 12px
  margin 16px 0 !important
  background-color $code-color !important

  > pre
    border-radius $generic-border-radius !important
    margin 0 !important
    position relative
    background-color $code-color !important

.q-tab-panel .doc-code
  margin 0 !important
</style>
