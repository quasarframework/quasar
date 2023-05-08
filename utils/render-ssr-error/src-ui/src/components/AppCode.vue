<template>
  <div class="app-code">
    <div class="app-code__prism" :style="entry.style">
      <pre><code v-html="entry.html" /></pre>
    </div>

    <div v-if="entry.links" class="app-code__links row items-center q-px-md q-pb-md text-white bg-dark">
      <div>Open in:</div>
      <q-btn
        v-for="link in entry.links"
        :key="link.label"
        class="q-ml-sm"
        unelevated
        size="sm"
        color="primary"
        :label="link.label"
        :href="link.href"
        no-caps
      />
    </div>
  </div>
</template>

<script setup>
import Prism from 'prismjs'
import { computed } from 'vue'

import data from 'src/assets/data.js'
import store from 'src/assets/store.js'

const editorList = [
  { name: 'vscode', href: entry => `vscode://file/${ entry.fileName }:${ entry.lineNumber }${ entry.columnNumber !== null ? `:${ entry.columnNumber }` : '' }` },
  { name: 'sublime', href: entry => `subl://open?url=file://${ encodeURIComponent(entry.fileName) }&line=${ entry.lineNumber }` },
  { name: 'textmate', href: entry => `txmt://open?url=file://${ encodeURIComponent(entry.fileName) }&line=${ entry.lineNumber }` }
]

function highlight (sourceCode) {
  return Prism.highlight(sourceCode, Prism.languages.javascript, 'html')
}

const noSourceHtml = highlight(`/**
 * Source code not available.
 * Might be in-memory compiled code that we cannot access.
 */`)

const entry = computed(() => {
  const target = data.stack[ store.value.selectedStackEntryIndex ]
  const { sourceCode } = target

  if (sourceCode === null) {
    return {
      style: { '--highlight-top': '-100px' },
      html: noSourceHtml
    }
  }

  const html = sourceCode.linesList.map((line, index) => {
    const htmlCode = Prism.highlight(
      line,
      Prism.languages.javascript,
      'javascript'
    )

    return `<span class="line-number q-mr-md">${
      ('' + (sourceCode.startLineNumber + index)).padStart(sourceCode.maxLineNumberLen, ' ')
    }.</span>${ htmlCode }`
  }).join('\n')

  return {
    links: editorList.map(editor => ({
      href: editor.href(target),
      label: editor.name
    })),
    style: { '--highlight-top': sourceCode.highlightTopOffset },
    html
  }
})
</script>

<style lang="sass">
.app-code
  position: sticky
  top: 0
  border-left: 5px solid $primary
  z-index: 10

  &__prism
    background-color: $dark
    position: relative
    overflow: hidden

    pre
      margin: 0
      padding: 16px
      font-size: 14px
      font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace
      line-height: 21px
      tab-size: 2
      text-align: left
      white-space: pre
      word-spacing: normal
      word-break: normal
      word-wrap: normal
      hyphens: none
      color: #f8f8f2
      overflow: auto

      &:after
        content: ''
        position: absolute
        top: var(--highlight-top)
        right: 0
        left: 0
        height: 21px
        background: rgba(#fff, .2)
        pointer-events: none

  &__links
    //

.token.comment,
.token.prolog,
.token.doctype,
.token.cdata
  color: #d4d0ab

.token.punctuation
  color: #fefefe

.token.property,
.token.tag,
.token.constant,
.token.symbol,
.token.deleted
  color: #ffa07a

.token.boolean,
.token.number
  color: #00e0e0

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted
  color: #abe338

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string,
.token.variable
  color: #00e0e0

.token.atrule,
.token.attr-value,
.token.function
  color: #ffd700

.token.keyword
  color: #00e0e0

.token.regex,
.token.important
  color: #ffd700

.token.important,
.token.bold
  font-weight: 700

.token.italic
  font-style: italic

.token.entity
  cursor: help

.line-number
  color: $grey
</style>
