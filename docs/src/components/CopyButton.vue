<template>
  <div class="doc-copy-btn">
    <q-icon name="content_paste" color="brand-primary" @click="copy" />

    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <q-badge
        class="absolute header-badge"
        v-show="copied"
        label="Copied to clipboard"
      />
    </transition>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref } from 'vue'
import { copyToClipboard } from 'quasar'

const props = defineProps({
  lang: String
})

const { proxy } = getCurrentInstance()

let timer
const copied = ref(false)

function copy() {
  const target = proxy.$el.previousSibling

  // We need to remove artifacts (like line numbers) and reveal any folded
  // #region blocks before reading text. The doc-code--copying class hides
  // line-number/diff/fold-placeholder noise; opening every <details>
  // ensures their inner code is included in innerText.
  const folds = target.querySelectorAll('.doc-code-fold')
  const previousOpen = Array.from(folds, fold => fold.open)
  folds.forEach(fold => {
    fold.open = true
  })

  target.classList.add('doc-code--copying')
  // oxlint-disable-next-line unicorn/prefer-dom-node-text-content
  let text = target.innerText
  target.classList.remove('doc-code--copying')

  folds.forEach((fold, index) => {
    fold.open = previousOpen[index]
  })

  if (props.lang === 'bash') {
    const bashStartRE = /^\$ /
    text = text
      .split('\n')
      .map(line => line.replace(bashStartRE, ''))
      .join('\n')
  }

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
  position: absolute
  top: 8px
  right: 16px // account for scrollbar

  .q-icon
    cursor: pointer
    color: $brand-primary
    font-size: 20px
    padding: 4px
    border-radius: $generic-border-radius
    border: 1px solid $brand-primary
    opacity: 0
    transition: opacity .28s

  .q-badge
    top: 4px
    right: 34px

body.body--light
  .doc-copy-btn .q-icon
    background-color: $light-pill
    &:hover
      background-color: #fff

body.body--dark
  .doc-copy-btn .q-icon
    background-color: $dark-pill
    &:hover
      background-color: #000

.copybtn-hover:hover
  .doc-copy-btn .q-icon
    opacity: 1
</style>
