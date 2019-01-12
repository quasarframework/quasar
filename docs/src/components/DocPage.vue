<template lang="pug">
q-page.doc-page

  doc-section.title(:title="title", name="Introduction")

  slot

  div.doc-edit-link
    | Caught a mistake?
    doc-link(:to="editHref") Suggest an edit on GitHub

</template>

<script>
export default {
  name: 'DocPage',

  props: {
    title: String
  },

  computed: {
    editHref () {
      return `https://github.com/quasarframework/quasar/edit/dev/docs/src/pages${this.$route.path}.vue`
    }
  },

  mounted () {
    const page = document.body.getElementsByClassName('q-page')[0]
    const els = page.getElementsByClassName('doc-section h1')

    const toc = []
    Array.prototype.forEach.call(els, el => {
      toc.push({
        id: el.getAttribute('id'),
        name: el.textContent
      })
    })

    this.$store.commit('updateToc', toc)
  }
}
</script>

<style lang="stylus">
.doc-page
  padding 16px 46px
  font-weight 300

  > div
    margin-bottom 22px
    font-weight 300
    font-size 15px

.doc-edit-link
  margin 68px 0 12px !important
</style>
