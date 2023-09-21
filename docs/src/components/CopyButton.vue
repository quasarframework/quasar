<template>
  <div class="doc-copy-btn">
    <q-icon name="content_paste" color="brand-primary" @click="copy" />

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

const { proxy } = getCurrentInstance()

let timer
const copied = ref(false)

function copy () {
  const target = proxy.$el.previousSibling

  // We need to remove artifacts (like line numbers)
  // before we copy the content.
  // The doc-code--copying class will do that for us
  target.classList.add('doc-code--copying')
  const text = target.innerText
  target.classList.remove('doc-code--copying')

  copyToClipboard(text)
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

  .q-icon
    font-size: 16px
    padding: 6px
    border-radius: $generic-border-radius
    border: 1px solid $brand-primary
    cursor: pointer
    color: $brand-primary

  &__badge
    top: 4px
    right: 34px

body.body--light .doc-copy-btn
  .q-icon
    background-color: #fff

body.body--dark .doc-copy-btn
  .q-icon
    background-color: $dark-pill

pre + .doc-copy-btn
  position: absolute
  top: 8px
  right: 16px /* account for scrollbar */

  .q-icon
    opacity: .3
    transition: opacity .28s

    &:hover
      opacity: 1
</style>
