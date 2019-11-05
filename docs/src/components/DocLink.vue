<template lang="pug">
  router-link.doc-link(
    v-if="internal === true"
    tag="a"
    :to="to"
  )
    slot
  a.doc-link(
    v-else
    :href="to"
    target="_blank"
    rel="noopener"
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
    internal () {
      return this.to.charAt(0) === '/'
    }
  }
}
</script>

<style lang="sass">
.doc-link
  color: $primary
  font-weight: 500
  text-decoration: none
  outline: 0
  border-bottom: 1px dotted currentColor
  vertical-align: center
  transition: opacity .2s
  white-space: nowrap

  &:hover
    opacity: .8

  .q-icon
    margin-top: -3px
    margin-left: 4px
</style>
