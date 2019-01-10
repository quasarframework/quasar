<template lang="pug">
section.doc-section(:id="id")
  span {{ title }}
  q-icon.cursor-pointer(
    name="content_copy"
    @click="copyLink"
  )
</template>

<script>
import { scroll } from 'quasar'

export default {
  name: 'DocPage',

  props: {
    title: String
  },

  computed: {
    id () {
      return this.title.replace(/ /g, '-')
    }
  },

  methods: {
    copyLink () {
      const text = window.location.origin + window.location.pathname + '#' + this.id

      var textArea = document.createElement('textarea')
      textArea.className = 'absolute'
      textArea.style.top = scroll.getScrollPosition(window) + 'px'
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      document.execCommand('copy')
      document.body.removeChild(textArea)

      this.$q.notify('Anchor has been copied to clipboard.')
    }
  }
}
</script>

<style lang="stylus">
@import '~quasar-variables'

.doc-section
  color $primary
  font-weight 600

  &.title
    font-size 30px
    margin-bottom 16px

  &.h1
    font-size 22px
    margin 1.5em 0 .8em
    padding-bottom .4em
    border-bottom 1px solid #ddd

  &.h2
    font-size 18px
    margin 1.5em 0 1.2em
    position relative
    &:before
      content '#'
      position absolute
      left -.7em
      top -2px
      font-size 1.2em

  &.h3
    font-size 16px
    margin 18px 0 8px

  .q-icon
    display none
    margin-left 8px

  &:hover
    .q-icon
      display inline-flex
</style>
