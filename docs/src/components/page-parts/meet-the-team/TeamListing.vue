<template lang="pug">
  .row.items-stretch.q-gutter-sm
    team-member(
      v-for="m in team"
      :key="m.name"
      :name="m.name"
      :role="m.role"
      :avatar="m.avatar"
      :email="m.email"
      :twitter="m.twitter"
      :github="m.github"
      :desc="m.desc"
    )
  </div>
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
