<template lang="pug">
  router-link.doc-link(
    v-if="external === true"
    tag="a"
    :to="to"
  )
    slot
    q-icon(name="launch")
  a.doc-link(
    v-else
    :href="to"
    target="_blank"
  )
    slot
    q-icon(name="launch")
</template>

<script>
export default {
  name: 'DocLink',

  props: {
    to: String
  },

  computed: {
    external () {
      return this.to.charAt(0) === '/'
    }
  }
}
</script>

<style lang="stylus">
@import '~quasar-variables'

.doc-link
  color $teal
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
