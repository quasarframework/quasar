<template lang="pug">
q-page.doc-page

  h1.doc-heading.doc-h1#Introduction(@click="copyHeading('Introduction')")
    span {{ title }}
    a.doc-page__top-link.float-right(:href="editHref", target="_blank", rel="noopener noreferrer")
      q-icon(name="edit", @click.stop)
        q-tooltip Improve page

  slot

  .doc-page-nav.text-primary.q-pb-lg(v-if="related !== void 0")
    .text-h6.q-pb-md Related
    .q-gutter-md.flex
      router-link.q-link.doc-page-related.rounded-borders.q-pa-md.cursor-pointer.column.justify-center.shadow-2.bg-grey-4(
        v-for="link in related"
        :key="link.category + link.path"
        :to="link.path"
      )
        .row.items-center
          .col
            .doc-page-nav__categ.text-uppercase {{ link.category || 'Docs' }}
            .doc-page-nav__name.text-weight-bold {{ link.name }}

          .col-auto.q-pl-lg
            q-icon(name="launch")

  .doc-page-nav.text-primary.q-pb-xl(v-if="nav !== void 0")
    .text-h6.q-pb-md Ready for more?
    .q-gutter-md.flex
      router-link.q-link.doc-page-related.rounded-borders.q-pa-md.cursor-pointer.column.justify-center.shadow-2.bg-white(
        v-for="link in nav"
        :key="link.category + link.path"
        :to="link.path"
      )
        .row.items-center
          .col-auto(
            v-if="link.dir !== void 0"
            :class="link.dir === 'right' ? 'order-last q-pl-md' : 'order-first q-pr-md'"
          )
            q-icon(:name="`chevron_${link.dir}`")

          .col
            .doc-page-nav__categ.text-uppercase {{ link.category || 'Docs' }}
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
    related: Array,
    nav: Array
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
  color $grey-9
  transition color .28s

  &:hover
    color $primary

.doc-page-nav
  margin 68px 0 12px

  .q-icon
    font-size 1.75em
    top 12px
    right 10px

  &__categ
    font-size .8em

  &__name
    font-size 1em
</style>
