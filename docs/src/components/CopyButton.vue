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
import { ref } from 'vue'
import { copyToClipboard } from 'quasar'
import { mdiContentCopy } from '@quasar/extras/mdi-v5'

export default {
  props: {
    text: String
  },

  setup (props) {
    let timer
    const copied = ref(false)

    function copy () {
      copyToClipboard(props.text)
        .then(() => {
          copied.value = true
          clearTimeout(timer)
          timer = setTimeout(() => {
            copied.value = false
            timer = null
          }, 2000)
        })
        .catch(() => {})
    }

    return {
      mdiContentCopy,
      copied,
      copy
    }
  }
}
</script>
