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
        color: 'primary',
        position: 'top',
        actions: [ { icon: 'close', color: 'white' } ],
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
    font-size 35px
    font-weight 300
    letter-spacing -0.01562em
    margin-bottom 24px

  &.h1
    font-size 30px
    font-weight 300
    letter-spacing -0.00833em
    margin 45px 0 16px
    padding-bottom .2em
    border-bottom 1px solid #ccc

  &.h2
    font-size 22px
    font-weight 400
    letter-spacing normal
    margin 35px 0 16px

  &.h3
    font-size 16px
    font-weight 400
    letter-spacing 0.00735em
    margin 24px 0 8px

  &.h4
    color inherit
    font-weight 400
    letter-spacing normal

  .q-icon
    display none
    margin-left 8px

  &:hover
    .q-icon
      display inline-flex
</style>
