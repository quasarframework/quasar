<template lang="pug">
  a.doc-link(
    :href="href"
    :target="target"
  )
    slot
    q-icon(name="launch")
</template>

<script>
export default {
  name: 'DocLink',

  props: {
    href: String,
    external: Boolean
  },

  computed: {
    target () { // eslint-disable-line
      if (this.external === true) {
        return '__blank'
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~quasar-variables'

.doc-link
  color $primary
  font-weight 500
  text-decoration none
  outline 0
  border-bottom 1px dotted currentColor
  vertical-align center
  transition opacity .2s
  margin 0 4px

  &:hover
    opacity .8

  .q-icon
    margin-top -3px
    margin-left 4px
</style>
