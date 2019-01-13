<template lang="pug">
q-page.doc-page

  h1.doc-heading.doc-h1#Introduction(@click="copyHeading('Introduction')") {{ title }}

  slot

  div.doc-edit-link
    | Caught a mistake? <doc-link :to="editHref">Suggest an edit on Github</doc-link>

</template>

<script>
import { copyHeading } from 'assets/page-utils'

export default {
  name: 'DocPage',

  props: {
    title: String
  },

  computed: {
    editHref () {
      return `https://github.com/quasarframework/quasar/edit/dev/docs/src/pages${this.$route.path}.md`
    }
  },

  methods: {
    copyHeading
  }
}
</script>

<style lang="stylus">
.doc-page
  padding 16px 46px
  font-weight 300

  > div
    margin-bottom 22px

.doc-edit-link
  margin 68px 0 12px !important
</style>
