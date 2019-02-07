<template lang="pug">
  q-card.quasar-sponsor(@click.native="openWebsite", :style="style")
    q-card-section.quasar-sponsor__title {{ name }}
    q-separator
    q-card-section.quasar-sponsor__logo.flex.flex-center(v-if="img")
      q-img(alt="name", :src="`https://cdn.quasar-framework.org/sponsors/${img}`")
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

<style lang="stylus">
.quasar-sponsor
  width 100%
  max-width 14rem
  height 260px

  &__logo
    height 200px
  &__title
    transition background .28s

  &:hover .quasar-sponsor__title
    background #eee
</style>
