<template lang="pug">
div.relative
  q-btn(
    color="primary"
    round
    dense
    flat
    icon="content_copy"
    @click="copy"
  )
    q-tooltip Copy to Clipboard

  transition(
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  )
    q-badge.absolute(
      v-show="copied"
      style="top: 12px; right: 58px;"
    ) Copied to clipboard
</template>

<script>

import { copyToClipboard } from 'quasar'

export default {
  props: {
    text: [ Function, String ]
  },

  data () {
    return {
      copied: false
    }
  },

  methods: {
    copy () {
      const text = typeof this.text === 'function'
        ? this.text()
        : this.text

      copyToClipboard(text)
        .then(() => {
          this.copied = true
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.copied = false
            this.timer = null
          }, 2000)
        })
        .catch(() => {})
    }
  }
}
</script>
