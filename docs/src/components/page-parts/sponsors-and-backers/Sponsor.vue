<template lang="pug">
  div.sponsor.bg-white(:style="sponsorStyle", @click="openWebsite")
    q-card-section
      div.text-h6(v-if="amount")
        center {{ amount }}
      q-separator.sponsor-separator(v-if="amount")
      q-img(v-if="image", basic, contain, :alt="name", :src="image")
        q-tooltip {{ name }}
      div(v-else) {{ name }}

</template>

<script>
import { openURL } from 'quasar'
export default {
  name: 'Sponsor',

  props: {
    height: String,
    image: String,
    name: String,
    amount: String,
    website: String
  },

  computed: {
    sponsorStyle () {
      return {
        minHeight: this.height ? this.height : '14rem',
        cursor: this.website ? 'pointer' : 'default'
      }
    }
  },

  methods: {
    openWebsite () {
      this.website && openURL(this.website)
    }
  }
}
</script>

<style lang="stylus">
@import '~quasar-variables'

.sponsor
  position relative
  display inline-block
  width 100%
  max-width 14rem
  margin 5px
  border-style solid
  border-color $primary
  overflow hidden

.sponsor-separator
  margin 2px 0 5px 0

</style>
