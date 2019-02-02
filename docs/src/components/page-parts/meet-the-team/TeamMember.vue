<template lang="pug">
  div.team-member
    div.inner-team-member(@mouseover="visible = 1", @mouseout="visible = 0")
      q-avatar.profile-pic(square,size="14rem")
        img(:src="image ? image : 'https://cdn.quasar-framework.org/img/boy-avatar.png'")

      q-slide-transition(v-show="visible")
        q-card.profile-card.text-white(square)
            q-card-section
              div.text-h6(v-if="name")
                center {{ name }}
              div.text-subtitle2(v-if="alias")
                center @{{ alias }}
              div.text-h6(v-if="title")
                center {{ title }}

            q-card-section
              slot

            q-card-section
              div.row.justify-around
                q-btn(v-if="twitter", @click="openTwitter" round, color="primary", icon="fab fa-twitter")
                q-btn(v-if="github", @click="openGithub" round, color="primary", icon="fab fa-github")
                q-btn(v-if="website", @click="openWebsite" round, color="primary", icon="fas fa-home")

</template>

<script>
import { openURL } from 'quasar'
export default {
  name: 'TeamMember',

  props: {
    image: String,
    name: String,
    alias: String,
    title: String,
    twitter: String,
    github: String,
    website: String
  },

  data () {
    return {
      visible: 0
    }
  },

  methods: {
    openTwitter () {
      openURL('https://twitter.com/' + this.twitter)
    },
    openGithub () {
      openURL('https://github.com/' + this.github)
    },
    openWebsite () {
      openURL(this.website)
    }
  }
}
</script>

<style lang="stylus">
@import '~quasar-variables'

.team-member
  position relative
  display inline-block
  width 100%
  max-width 14rem
  min-height: 14rem
  max-height: 14rem
  margin 5px

.inner-team-member
  position absolute

.profile-pic
  margin 0
  img
    border-style solid
    border-color $primary

.profile-card
  position absolute
  background radial-gradient(circle, #35a2ff 0%, #014a88 100%)
  top 100%
  left 0
  width 100%
  max-width 14rem
  z-index 100
</style>
