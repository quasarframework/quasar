<template lang="pug">
section.q-my-sm.q-mr-md.cursor-pointer.text-subtitle1(:id="id", @click="copyHeading(id)")
  div.doc-card-title {{ title }}
</template>

<script>
import { copyHeading, slugify } from 'assets/page-utils'

export default {
  name: 'DocHeading',

  props: {
    title: String,
    prefix: String
  },

  computed: {
    id () {
      return this.prefix + slugify(this.title)
    }
  },

  methods: {
    copyHeading
  }
}
</script>

<style lang="stylus">
$title-color = $grey-4

.doc-card-title
  margin-left -24px
  padding 2px 10px 2px 24px
  background $title-color
  color $grey-8
  position relative
  border-radius 3px 5px 5px 0

  &:after
    content ''
    position absolute;
    top 100%
    left 0
    width 0
    height 0
    border 0 solid transparent
    border-top-color darken($title-color, 15%)
    border-width 9px 0 0 11px
</style>
