<template lang="pug">
section.doc-section.cursor-pointer(:id="id", @click="copyLink")
  | {{ title }}
</template>

<script>
import { scroll } from 'quasar'

export default {
  name: 'DocPage',

  props: {
    title: String,
    name: String
  },

  computed: {
    id () {
      return this.name === void 0
        ? this.title.replace(/ /g, '-')
        : this.name
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

      this.$q.notify({
        message: 'Anchor has been copied to clipboard.',
        position: 'top',
        actions: [ { icon: 'close' } ],
        timeout: 2000
      })
    }
  }
}
</script>

<style lang="stylus">
@import '~quasar-variables'

.doc-section
  color $primary
  font-weight 600

  &:hover:after
    content ' #'

  &.title
    font-size 30px
    margin-bottom 16px

  &.h1
    font-size 26px
    margin 1.5em 0 .8em
    padding-bottom .4em
    border-bottom 1px solid #ddd

  &.h2
    font-size 22px
    margin 1.5em 0 1.2em

  &.h3
    font-size 18px
    margin 18px 0 8px

  &.h4
    color inherit
    font-weight inherit

  .q-icon
    display none
    margin-left 8px

  &:hover
    .q-icon
      display inline-flex
</style>
