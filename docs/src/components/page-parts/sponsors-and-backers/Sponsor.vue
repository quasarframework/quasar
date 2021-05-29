<template lang="pug">
  q-card.quasar-sponsor(flat, bordered, @click.native="openWebsite", :style="style")
    q-card-section.quasar-sponsor__title {{ name }}
    q-separator
    q-card-section.quasar-sponsor__logo.flex.flex-center
      q-img(:alt="name" :src="`https://cdn.quasar.dev/sponsors/${img}`")
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'Sponsor',

  props: {
    img: String,
    name: String,
    url: String
  },

  computed: {
    style () {
      return {
        cursor: this.url ? 'pointer' : 'default'
      }
    }
  },

  methods: {
    openWebsite () {
      this.url && openURL(this.url)
    }
  }
}
</script>

<style lang="sass">
.quasar-sponsor
  width: 100%
  max-width: 14rem
  height: 265px

  &__logo
    height: 200px
  &__title
    transition: color .28s, background .28s

  &:hover .quasar-sponsor__title
    background: $brand-primary
    color: #fff
</style>
