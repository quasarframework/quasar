<template lang="pug">
.relative
  q-btn(
    color="brand-primary"
    round
    dense
    flat
    :icon="mdiContentCopy"
    @click="copy"
  )
    q-tooltip Copy to Clipboard

  transition(
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  )
    q-badge.absolute(
      v-show="copied"
      style="top: 8px; right: 58px;"
      color="brand-primary"
    ) Copied to clipboard
</template>

<script>
import { copyToClipboard } from 'quasar'
import { mdiContentCopy } from '@quasar/extras/mdi-v5'

export default {
  props: {
    text: [ Function, String ]
  },

  created () {
    this.mdiContentCopy = mdiContentCopy
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
