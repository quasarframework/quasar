<template>
  <div class="relative-position copybtn-hover">
    <template v-if="html">
      <div v-html="html" />
      <DocCopyBtn />
    </template>

    <pre
      v-else
      class="shiki shiki-themes doc-code"
    ><code v-text="props.code" /></pre>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

import DocCopyBtn from './DocCopyBtn.vue'
import { runtimeLangHighlighterMap } from '@/../build/md/highlight/client-store.js'

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  lang: {
    type: String,
    default: 'text'
  }
})

/**
 * If the language has already been loaded at runtime,
 * then immediately highlight the code.
 */
const html = ref(runtimeLangHighlighterMap[props.lang]?.(props.code) || null)

if (import.meta.env.QUASAR_CLIENT) {
  const update = () => {
    html.value = runtimeLangHighlighterMap[props.lang](props.code)
  }

  watch(
    () => props.code,
    newCode => {
      /**
       * Avoid doing anything if the client-runtime hasn't yet loaded,
       * since when it loads, it will use latest props.code value anyway.
       */
      if (html.value !== null) update()
    }
  )

  /**
   * If the language hasn't been loaded at runtime,
   * then async load it and highlight the code with it.
   *
   * The following also ensures separate chunks are
   * loaded on demand only.
   */
  if (html.value === null) {
    const renderCode = async () => {
      const { lazyLoadLanguage } =
        await import('@/../build/md/highlight/client-runtime.js')

      await lazyLoadLanguage(props.lang)
      update()
    }

    renderCode()
  }
}
</script>

<style lang="sass">
.doc-code
  margin: 0
  position: relative
  overflow: auto
  border-radius: inherit
  max-height: 70vh

  --shiki-light: #212121
  --shiki-dark: #f8f8f2
  --shiki-light-bg: #f5f5f5
  --shiki-dark-bg: #002433

  code
    display: block
    padding: 16px
    width: fit-content
    min-width: 100%

    font-size: ($font-size - 2px)
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace
    line-height: 1.5em
    tab-size: 2
    text-align: left
    white-space: pre
    word-spacing: normal
    word-break: normal
    word-wrap: normal
    hyphens: none
    -webkit-hyphens: none

    border-radius: inherit

  .line
    position: relative
    display: inline-block
    width: 100%

// Line-level decorations from Shiki notation transformers and our line-decor:
//   .highlighted              -> notation-highlight
//   .diff.add / .diff.remove  -> notation-diff
//   .focused / .has-focused   -> notation-focus
//   .highlighted.warning      -> notation-error-level (warning)
//   .highlighted.error        -> notation-error-level (error)
//   .highlighted-word         -> notation-word-highlight

.line
  &.highlighted:before,
  &.diff:before
    position: absolute
    pointer-events: none
    user-select: none
    -webkit-user-select: none /* Safari 16.4, older Chrome */
    top: 0
    left: -16px
    right: -16px
    height: 1.5em

  &.highlighted:before
    content: ' '

  &.diff:before
    padding-left: 4px

  &.diff.add:before
    content: '+'
    color: $green
  &.diff.remove:before
    content: '−'
    color: $red-5

.has-focused
  .line:not(.focused)
    filter: blur(0.095rem)
    opacity: 0.7
    transition: filter 0.35s, opacity 0.35s
  &:hover .line:not(.focused)
    filter: none
    opacity: 1

.highlighted-word
  border-radius: 3px
  padding: 1px 3px
  margin: -1px -3px

.doc-code-fold
  display: block

  &__summary
    cursor: pointer
    list-style: none

    &::-webkit-details-marker
      display: none
    &::marker
      content: ''

  &__placeholder
    opacity: .6
    font-style: italic

  &__chevron
    display: inline-block
    transition: transform .15s ease

  &[open] &__chevron
    transform: rotate(90deg)

body.body--light

  .shiki, .shiki span
    color: var(--shiki-light)

  .doc-code
    background-color: var(--shiki-light-bg)

  .line
    &.highlighted:before
      background: rgba($grey, .2)
    &.diff.add:before
      background: rgba($positive, .2)
    &.diff.remove:before
      background: rgba($negative, .2)
    &.highlighted.warning:before
      background: rgba(#cb7800, .2)
    &.highlighted.error:before
      background: rgba($negative, .25)

  .highlighted-word
    background: rgba($grey, .25)

body.body--dark

  .shiki, .shiki span
    color: var(--shiki-dark)

  .doc-code
    background-color: var(--shiki-dark-bg)

  .line
    &.highlighted:before
      background: rgba($grey-3, .2)
    &.diff.add:before
      background: rgba($positive, .25)
    &.diff.remove:before
      background: rgba($red, .3)
    &.highlighted.warning:before
      background: rgba(#ffcc66, .2)
    &.highlighted.error:before
      background: rgba($negative, .3)

  .highlighted-word
    background: rgba($grey-3, .25)

.doc-tab-icon
  .q-tab__label:before
    content: ''
    background: var(--tab-icon) no-repeat center / contain
    width: 1em
    height: 1em
    margin-bottom: -.13em
    margin-right: .5em
    display: inline-block
  &--yarn
    --tab-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 32 32'%3E%3Cpath fill='%232188b6' d='M28.208 24.409a10.5 10.5 0 0 0-3.959 1.822a23.7 23.7 0 0 1-5.835 2.642a1.63 1.63 0 0 1-.983.55a62 62 0 0 1-6.447.577c-1.163.009-1.876-.3-2.074-.776a1.573 1.573 0 0 1 .866-2.074a4 4 0 0 1-.514-.379c-.171-.171-.352-.514-.406-.388c-.225.55-.343 1.894-.947 2.5c-.83.839-2.4.559-3.328.072c-1.019-.541.072-1.813.072-1.813a.73.73 0 0 1-.992-.343a4.85 4.85 0 0 1-.667-2.949a5.37 5.37 0 0 1 1.749-2.895a9.3 9.3 0 0 1 .658-4.4a10.45 10.45 0 0 1 3.165-3.661S6.628 10.747 7.35 8.817c.469-1.262.658-1.253.812-1.308a3.6 3.6 0 0 0 1.452-.857a5.27 5.27 0 0 1 4.41-1.7S15.2 1.4 16.277 2.09a18.4 18.4 0 0 1 1.533 2.886s1.281-.748 1.425-.469a11.33 11.33 0 0 1 .523 6.132a14 14 0 0 1-2.6 5.411c-.135.225 1.551.938 2.615 3.887c.983 2.7.108 4.96.262 5.212c.027.045.036.063.036.063s1.127.09 3.391-1.308a8.5 8.5 0 0 1 4.277-1.604a1.081 1.081 0 0 1 .469 2.11Z'/%3E%3C/svg%3E")
  &--npm
    --tab-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 32 32'%3E%3Cpath fill='%23c12127' d='M2 2h28v28H2'/%3E%3Cpath fill='%23fff' d='M7.25 7.25h17.5v17.5h-3.5v-14H16v14H7.25'/%3E%3C/svg%3E")
  &--bun
    --tab-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 32 32'%3E%3Cpath fill='%23fbf0df' d='M29 17c0 5.65-5.82 10.23-13 10.23S3 22.61 3 17c0-3.5 2.24-6.6 5.66-8.44S14.21 4.81 16 4.81s3.32 1.54 7.34 3.71C26.76 10.36 29 13.46 29 17'/%3E%3Cpath fill='none' stroke='%23000' d='M16 27.65c7.32 0 13.46-4.65 13.46-10.65c0-3.72-2.37-7-5.89-8.85c-1.39-.75-2.46-1.41-3.37-2l-1.13-.69A6.14 6.14 0 0 0 16 4.35a6.9 6.9 0 0 0-3.3 1.23c-.42.24-.86.51-1.32.8c-.87.54-1.83 1.13-3 1.73C4.91 10 2.54 13.24 2.54 17c0 6 6.14 10.65 13.46 10.65Z'/%3E%3Cellipse cx='21.65' cy='18.62' fill='%23febbd0' rx='2.17' ry='1.28'/%3E%3Cellipse cx='10.41' cy='18.62' fill='%23febbd0' rx='2.17' ry='1.28'/%3E%3Cpath fill-rule='evenodd' d='M11.43 18.11a2 2 0 1 0-2-2.05a2.05 2.05 0 0 0 2 2.05m9.2 0a2 2 0 1 0-2-2.05a2 2 0 0 0 2 2.05'/%3E%3Cpath fill='%23fff' fill-rule='evenodd' d='M10.79 16.19a.77.77 0 1 0-.76-.77a.76.76 0 0 0 .76.77m9.2 0a.77.77 0 1 0 0-1.53a.77.77 0 0 0 0 1.53'/%3E%3Cpath fill='%23b71422' stroke='%23000' stroke-width='.75' d='M18.62 19.67a3.3 3.3 0 0 1-1.09 1.75a2.48 2.48 0 0 1-1.5.69a2.53 2.53 0 0 1-1.5-.69a3.28 3.28 0 0 1-1.08-1.75a.26.26 0 0 1 .29-.3h4.58a.27.27 0 0 1 .3.3Z'/%3E%3Cpath fill='%23ccbea7' fill-rule='evenodd' d='M14.93 5.75a6.1 6.1 0 0 1-2.09 4.62c-.1.09 0 .27.11.22c1.25-.49 2.94-1.94 2.23-4.88c-.03-.15-.25-.11-.25.04m.85 0a6 6 0 0 1 .57 5c0 .13.12.24.21.13c.83-1 1.54-3.11-.59-5.31c-.1-.11-.27.04-.19.17Zm1-.06a6.1 6.1 0 0 1 2.53 4.38c0 .14.21.17.24 0c.34-1.3.15-3.51-2.66-4.66c-.12-.02-.21.18-.09.27ZM9.94 9.55a6.27 6.27 0 0 0 3.89-3.33c.07-.13.28-.08.25.07c-.64 3-2.79 3.59-4.13 3.51c-.14-.01-.14-.21-.01-.25'/%3E%3C/svg%3E")
  body.body--light &--pnpm
    --tab-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 32 32'%3E%3Cpath fill='%23f9ad00' d='M30 10.75h-8.749V2H30Zm-9.626 0h-8.75V2h8.75Zm-9.625 0H2V2h8.749ZM30 20.375h-8.749v-8.75H30Z'/%3E%3Cpath fill='%234e4e4e' d='M20.374 20.375h-8.75v-8.75h8.75Zm0 9.625h-8.75v-8.75h8.75ZM30 30h-8.749v-8.75H30Zm-19.251 0H2v-8.75h8.749Z'/%3E%3C/svg%3E")
  body.body--dark &--pnpm
    --tab-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 32 32'%3E%3Cpath fill='%23f9ad00' d='M30 10.75h-8.749V2H30Zm-9.626 0h-8.75V2h8.75Zm-9.625 0H2V2h8.749ZM30 20.375h-8.749v-8.75H30Z'/%3E%3Cpath fill='%23fff' d='M20.374 20.375h-8.75v-8.75h8.75Zm0 9.625h-8.75v-8.75h8.75ZM30 30h-8.749v-8.75H30Zm-19.251 0H2v-8.75h8.749Z'/%3E%3C/svg%3E")
</style>
