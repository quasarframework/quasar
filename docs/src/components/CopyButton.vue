<template>
  <div class="relative">
    <q-btn class="header-btn copy-button__action" color="brand-primary" round dense flat :icon="mdiContentCopy" @click="copy">
      <q-tooltip>Copy to Clipboard</q-tooltip>
    </q-btn>

    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <q-badge
        class="absolute copy-button__badge header-badge"
        v-show="copied"
        label="Copied to clipboard"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { copyToClipboard } from 'quasar'
import { mdiContentCopy } from '@quasar/extras/mdi-v6'

const props = defineProps({
  text: String
})

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
</script>

<style lang="sass">
.copy-button

  &__action
    .q-icon
      font-size: 18px !important

  &__badge
    top: 5px
    right: 38px
</style>
