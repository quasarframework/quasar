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
      router-link.q-link.doc-page-related.rounded-borders.q-pa-md.cursor-pointer.column.justify-center.bg-grey-4(
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
      router-link.q-link.doc-page-related.doc-page-related-bordered.rounded-borders.q-pa-md.cursor-pointer.column.justify-center.bg-white(
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

  .doc-page-footer
    div.doc-page-footer__icons.row.items-center
      a(href="https://github.com/quasarframework/quasar", target="_blank")
        q-icon(name="fab fa-github")

      a(href="https://twitter.com/quasarframework", target="_blank")
        q-icon(name="fab fa-twitter")

      a(href="https://medium.com/quasar-framework", target="_blank")
        q-icon(name="fab fa-medium")

      a(href="https://discord.gg/5TDhbDg", target="_blank")
        q-icon(name="fab fa-discord")

      a(href="https://forum.quasar-framework.org/", target="_blank")
        q-icon(name="fas fa-comments")
    div
      | Released under the <doc-link to="https://github.com/quasarframework/quasar/blob/dev/LICENSE">MIT LICENSE</doc-link> | <doc-link to="https://www.iubenda.com/privacy-policy/40685560">Privacy Policy</doc-link>

    div Copyright © 2015 - {{ year }} PULSARDEV SRL, Razvan Stoenescu

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

  data () {
    return {
      year: (new Date()).getFullYear()
    }
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
  max-width 900px
  margin-left auto
  margin-right auto

  > div, > pre
    margin-bottom 22px

  &__top-link
    color inherit
    text-decoration none
    outline 0

@media (max-width 600px)
  .doc-page
    padding 16px

.doc-edit-link
  margin 52px 0

.doc-page-related
  color $grey-9
  transition color .28s

  &:hover
    color $primary

.doc-page-related-bordered
  border 1px solid $separator-color

.doc-page-footer
  padding 46px 0 16px

  &__icons
    font-size 28px
    a
      margin 0 8px 8px
      text-decoration none
      outline 0
      color $primary
    .q-icon:hover
      color #000

.doc-page-nav
  margin 68px 0 12px

  & + &
    margin-top 0

  .q-icon
    font-size 1.75em
    top 12px
    right 10px

  &__categ
    font-size .8em

  &__name
    font-size 1em
</style>
