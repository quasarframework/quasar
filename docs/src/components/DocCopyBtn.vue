<template>
  <div class="doc-copy-btn">
    <button
      type="button"
      class="doc-copy-btn__btn"
      aria-label="Copy code to clipboard"
      @click="copy"
    >
      <q-icon name="content_paste" color="brand-primary" />
    </button>

    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <q-badge
        class="absolute header-badge"
        v-show="copied"
        role="status"
        label="Copied to clipboard"
      />
    </transition>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref } from 'vue'
import { copyToClipboard } from 'quasar'

const { proxy } = getCurrentInstance()

let timer
const copied = ref(false)

// Drop the whole line. Hiding just the content would still leave a blank line.
const SKIP_LINE_SELECTOR = [
  '.diff.remove',
  '.doc-code-fold__placeholder' // "▸ …" summary row of a folded region
].join(', ')

// Empty `//` lines authors add to make room for Twoslash autocomplete.
const FILLER_LINE_RE = /^\s*\/\/\s*$/

function lineText(line) {
  const clone = line.cloneNode(true)
  return clone.textContent
}

function extractCode(root) {
  const out = []
  for (const line of root.querySelectorAll('.line')) {
    if (line.matches(SKIP_LINE_SELECTOR)) continue

    const text = lineText(line)
    if (!FILLER_LINE_RE.test(text)) {
      out.push(text)
    }
  }
  return out.join('\n')
}

function copy() {
  const target = proxy.$el.previousSibling

  // Folds must be open or `querySelectorAll('.line')` won't reach their contents.
  const folds = target.querySelectorAll('.doc-code-fold')
  const previousOpen = Array.from(folds, fold => fold.open)
  folds.forEach(fold => {
    fold.open = true
  })

  const text = extractCode(target)

  folds.forEach((fold, index) => {
    fold.open = previousOpen[index]
  })

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

  // the actual control is a native <button> for accessibility;
  // the icon stays the visual
  &__btn
    border: 0
    padding: 0
    margin: 0
    background: none
    line-height: 0

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

.copybtn-hover:hover .doc-copy-btn .q-icon,
.doc-copy-btn__btn:focus-visible .q-icon
  opacity: 1
</style>
