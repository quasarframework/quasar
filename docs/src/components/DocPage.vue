<template lang="pug">
q-page.doc-page

  doc-section.title(:title="title", name="Introduction")

  slot

  div.q-mt-xl
    | Was this page helpful?
    doc-link(:href="editHref", external) Suggest an edit on GitHub

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
</style>
