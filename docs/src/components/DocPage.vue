<template lang="pug">
q-page.doc-page

  h1.doc-heading.doc-h1#Introduction(@click="copyHeading('Introduction')")
    span {{ title }}
    a.doc-page__top-link.float-right(:href="editHref", target="_blank", rel="noopener noreferrer")
      q-icon(name="edit", @click.stop)
        q-tooltip Improve page

  slot

  .doc-page-nav.doc-page-padding.text-primary(v-if="related !== void 0")
    .text-h6.q-pb-md Ready for more?
    .q-gutter-sm.flex.items-stretch
      router-link.relative-position.q-link.doc-page-related.rounded-borders.q-pa-md.cursor-pointer.column.justify-center(
        v-for="link in related"
        :key="link.category + link.path"
        :to="link.path"
      )
        q-icon.absolute(v-if="link.dir !== void 0", :name="`chevron_${link.dir}`")

        .doc-page-nav__categ.text-uppercase.q-pr-lg {{ link.category || 'Docs' }}
        .doc-page-nav__name.text-weight-bold {{ link.name }}

  .doc-edit-link
    | Caught a mistake? <doc-link :to="editHref">Suggest an edit on Github</doc-link>

</template>

<script>
import { copyHeading } from 'assets/page-utils'

export default {
  name: 'DocPage',

  props: {
    title: String,
    related: Array
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
@import '~quasar-variables'

.doc-page
  padding 16px 46px
  font-weight 300

  > div, > pre
    margin-bottom 22px

  &__top-link
    color inherit
    text-decoration none
    outline 0

@media (max-width 600px)
  .doc-page
    padding 16px 22px

.doc-edit-link
  margin 48px 0 12px

.doc-page-related
  background-color $grey-4
  color $grey-9
  transition background-color .28s, color .28s

  &:hover
    background white
    color $primary

.doc-page-nav
  margin 68px 0 12px

  .q-icon
    font-size 1.5em
    top 12px
    right 10px
  &__categ
    font-size .8em
  &__name
    font-size 1em
</style>
