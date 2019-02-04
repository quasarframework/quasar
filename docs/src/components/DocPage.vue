<template lang="pug">
q-page.doc-page

  h1.doc-heading.doc-h1#Introduction(@click="copyHeading('Introduction')")
    span {{ title }}
    a.doc-page__top-link.float-right(:href="editHref", target="_blank", rel="noopener noreferrer")
      q-icon(name="edit", @click.stop)
        q-tooltip Improve page

  slot

  div.row.q-px-md.q-py-lg.q-gutter-xs.justify-start
    q-btn(push, color="primary", label="Prev" :disable="!prevPage" @click="gotoPrev")
    q-btn(push, color="primary", label="Next" :disable="!nextPage" @click="gotoNext")

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
    },
    prevPage () {
      return this.$store.state.prevPage
    },
    nextPage () {
      return this.$store.state.nextPage
    }
  },

  methods: {
    copyHeading,

    gotoPrev () {
      if (this.prevPage) {
        if (this.prevPage[0] === '/') {
          this.$router.push(this.prevPage)
        }
        else {
          let paths = this.$route.fullPath.split('/')
          paths.pop()
          paths.push(this.prevPage)
          let path = paths.join('/')
          this.$router.push(path)
        }
      }
    },

    gotoNext () {
      if (this.nextPage) {
        if (this.nextPage[0] === '/') {
          this.$router.push(this.nextPage)
        }
        else {
          let paths = this.$route.fullPath.split('/')
          paths.pop()
          paths.push(this.nextPage)
          let path = paths.join('/')
          this.$router.push(path)
        }
      }
    }
  }
}
</script>

<style lang="stylus">
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
  margin 68px 0 12px !important
</style>
