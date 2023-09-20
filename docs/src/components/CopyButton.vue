<template>
  <div class="doc-copy-btn">
    <q-btn class="header-btn doc-copy-btn__action" color="brand-primary" round dense flat :icon="mdiContentCopy" @click="copy">
      <q-tooltip>Copy to Clipboard</q-tooltip>
    </q-btn>

    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <q-badge
        class="absolute doc-copy-btn__badge header-badge"
        v-show="copied"
        label="Copied to clipboard"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { copyToClipboard } from 'quasar'
import { mdiContentCopy } from '@quasar/extras/mdi-v6'

const { proxy } = getCurrentInstance()

let timer
const copied = ref(false)

function copy () {
  copyToClipboard(proxy.$el.previousSibling.innerText)
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
</script>

<style lang="sass">
.doc-copy-btn

  &__action
    .q-icon
      font-size: 18px !important

  &__badge
    top: 5px
    right: 38px

pre + .doc-copy-btn
  position: absolute
  top: 8px
  right: 16px
</style>
