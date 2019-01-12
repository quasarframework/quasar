<template lang="pug">
.doc-note
  div(v-if="title").text-weight-bold {{ title }}
  slot
</template>

<script>
export default {
  name: 'DocNote',

  props: {
    title: String
  }
}
</script>

<style lang="stylus">
@import '~quasar-variables'

.doc-note
  background $grey-4
  border-radius $generic-border-radius
  margin 16px 0
  padding .5em 1.5em
  border-left 5px solid $primary
  letter-spacing .5px
</style>
