<template lang="pug">
div
  code-prism(:lang="lang")
    slot

  .absolute(style="top: 8px; right: 8px;")
    q-btn(
      color="primary"
      round
      dense
      flat
      icon="content_copy"
      @click="copyToClipboard"
    )
      q-tooltip Copy to Clipboard

  transition(
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  )
    q-badge.absolute(
      v-show="copied"
      style="top: 16px; right: 58px;"
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
    }
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
