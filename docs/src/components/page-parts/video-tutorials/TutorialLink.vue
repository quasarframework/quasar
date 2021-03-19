<template lang="pug">
  q-card.full-width.column.tutorial-link.cursor-pointer(flat, bordered, @click.native="openWebsite")
    q-card-section.col.tutorial-link__title
      .text-subtitle2 {{ name }}
      .q-mt-sm {{ desc }}
    q-img(alt="Tutorial logo", :src="imgUrl")
    q-card-section
      div Created by: {{ author }}
      div
        | Language:
        span.q-ml-xs.text-weight-bold {{ lang }}
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'TutorialLink',

  props: {
    name: String,
    desc: String,
    author: String,
    lang: String,
    link: String,
    imgUrl: String
  },

  methods: {
    openWebsite () {
      openURL(this.link)
    }
  }
}
</script>

<style lang="sass">
.tutorial-link
  &__title
    background: rgba(0,0,0,.05)

body.desktop .tutorial-link
  transition: background-color .28s
  &:hover
    background-color: rgba(0,0,0,.02)
</style>
