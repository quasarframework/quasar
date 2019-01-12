<template lang="pug">
pre.inline-block.doc-token
  slot
</template>

<script>
export default {
  name: 'DocToken'
}
</script>

<style lang="stylus">
@import '~quasar-variables'

.doc-token
  white-space nowrap
  background $grey-4
  font-weight 600
  color $primary
  border-radius $generic-border-radius
  padding 0 5px
  margin 0
</style>
