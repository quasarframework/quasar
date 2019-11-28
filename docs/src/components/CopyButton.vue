<template lang="pug">
div.relative
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
      style="top: 12px; right: 58px;"
    ) Copied to clipboard
</template>

<script>

import { copyToClipboard } from 'quasar'

export default {
  props: {
    text: [Function, String]
  },

  data () {
    return {
      copied: false
    }
  },

  methods: {
    copyToClipboard () {
      copyToClipboard(typeof this.text === 'string' ? this.text : this.text())
      this.copied = true
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
