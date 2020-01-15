<template lang="pug">
  q-card.quasar-member.column(flat, bordered)
    q-card-section
      .text-bold {{ name }}
      div(v-if="github") @{{ github }}

    q-img(v-if="avatar", alt="avatar", :src="url.avatar", :ratio="1")

    q-card-section.quasar-member__front.col
      div.text-grey.text-italic.q-mt-xs.quasar-member__role {{ role }}
      div.q-mt-xs {{ desc }}

    q-separator(style="height: 1px")

    q-card-actions(align="around")
      div(v-if="twitter")
        q-btn(type="a", :href="url.twitter", target="_blank", rel="noopener", round, flat, :icon="fabTwitter")
      div(v-if="github")
        q-btn(type="a", :href="url.github", target="_blank", rel="noopener", round, flat, :icon="fabGithub")
      div(v-if="email")
        q-btn(type="a", :href="url.email", target="_blank", rel="noopener", round, flat, icon="mail")
</template>

<script>
import {
  fabGithub, fabTwitter
} from '@quasar/extras/fontawesome-v5'

export default {
  name: 'TeamMember',

  props: {
    name: String,
    avatar: String,
    role: String,
    twitter: String,
    github: String,
    email: String,
    desc: String
  },

  computed: {
    url () {
      return {
        avatar: 'https://cdn.quasar.dev/team/' + this.avatar,
        twitter: 'https://twitter.com/' + this.twitter,
        github: 'https://github.com/' + this.github,
        email: 'mailto:' + this.email
      }
    }
  },

  created () {
    this.fabGithub = fabGithub
    this.fabTwitter = fabTwitter
  }
}
</script>

<style lang="sass">
.quasar-member
  width: 12.2rem

  &__role
    height: 42px

  .q-img__image
    filter: grayscale(100%)

  &__front
    min-height: 300px

  @media (max-width: $breakpoint-xs-max)
    width: 100%
    min-height: 640px
</style>
