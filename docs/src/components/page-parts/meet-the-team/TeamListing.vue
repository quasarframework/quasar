<template lang="pug">
div
  template(v-for="category in team")
    h4.text-brand-primary(:key="`categ_${category.name}`") {{ category.name }}
    .row.items-stretch.q-gutter-sm(:key="`members_${category.name}`")
      team-member(
        v-for="m in category.members"
        :key="m.name"
        :name="m.name"
        :role="m.role"
        :avatar="m.avatar"
        :email="m.email"
        :twitter="m.twitter"
        :github="m.github"
        :desc="m.desc"
      )
</template>

<script>
import TeamMember from './TeamMember.vue'
import team from './team.js'

export default {
  name: 'TeamListing',

  components: {
    TeamMember
  },

  created () {
    this.team = team
  }
}
</script>
