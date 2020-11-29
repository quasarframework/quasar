<template lang="pug">
q-card.quasar-sponsor(flat, bordered, @click.native="openWebsite", :style="style")
  q-card-section.quasar-sponsor__title {{ name }}
  q-separator
  q-card-section.quasar-sponsor__logo.flex.flex-center
    q-img(:alt="name" :src="`https://cdn.quasar.dev/sponsors/${img}`")
</template>

<script>
import { computed } from 'vue'
import { openURL } from 'quasar'

export default {
  name: 'Sponsor',

  props: {
    img: String,
    name: String,
    url: String
  },

  setup (props) {
    return {
      style: computed(() => ({
        cursor: props.url ? 'pointer' : 'default'
      })),

      openWebsite () {
        props.url && openURL(props.url)
      }
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
    background: $primary
    color: #fff
</style>
