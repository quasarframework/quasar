<template lang="pug">
section.doc-heading.col.text-subtitle1.doc-card-title(:id="id", @click="copyHeading(id)")
  | {{ title }}
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
.doc-card-title
  color inherit
</style>
