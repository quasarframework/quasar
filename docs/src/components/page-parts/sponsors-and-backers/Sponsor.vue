<template lang="pug">
.quasar-sponsor.flex.flex-center(@click="openWebsite" :style="style")
  q-img.fit(:alt="name" contain :src="logoUrl")
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
    },

    logoUrl () {
      return `https://cdn.quasar.dev/sponsors/${this.img}`
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
  max-width: 11rem
  height: 120px
  padding: 16px

@media (max-width: 720px)
  .quasar-sponsor
    height: 80px
</style>
