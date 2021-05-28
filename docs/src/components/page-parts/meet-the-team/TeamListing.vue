<template lang="pug">
div
  template(v-for="category in team" :key="category")
    h4.text-brand-primary {{ category.name }}
    .row.items-stretch.q-gutter-sm
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

  setup () {
    return { team }
  }
}
</script>
