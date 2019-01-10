<template lang="pug">
.doc-warning
  strong {{ title }}
  slot
</template>

<script>
export default {
  name: 'DocWarning',

  props: {
    title: {
      type: String,
      default: 'WARNING'
    }
  }
}
</script>

<style lang="stylus">
@import '~quasar-variables'

.doc-warning
  background $grey-4
  border-radius .3em
  margin 2em 0
  padding .5em 1.5em
  border-left 5px solid $primary
  letter-spacing .5px
</style>
