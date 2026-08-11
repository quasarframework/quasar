---
title: Meet the Team
desc: The list of people behind Quasar Framework.
keys: Team
---

Hailing from all around the planet, the Quasar Team is not only international but full of people with a vast range of fields of expertise. From real rocket engineers to Fortune 500 developers, the unifying factor among us is our dedication to quality and the love for our community of contributors and developers.

With hundreds of contributors to Quasar, **the list of people you can meet below is by no means exhaustive**. Just remember to thank everyone using Quasar and supporting us, because together we all help you push your products light-years ahead of your competition. A great way to do that is to [donate](https://donate.quasar.dev).

<script doc>
import TeamMember from './TeamMember.vue'
import { coreTeam, honorableTeamMentions } from '@/assets/team.js'
</script>

### Core Team

<div class="row items-stretch q-gutter-sm">
  <TeamMember
    v-for="m in coreTeam"
    :key="m.name"
    :name="m.name"
    :role="m.role"
    :avatar="m.avatar"
    :email="m.email"
    :twitter="m.twitter"
    :github="m.github"
    :desc="m.desc"
  />
</div>

### Honorable mentions

<div class="row items-stretch q-gutter-sm">
  <TeamMember
    v-for="m in honorableTeamMentions"
    :key="m.name"
    :name="m.name"
    :role="m.role"
    :avatar="m.avatar"
    :email="m.email"
    :twitter="m.twitter"
    :github="m.github"
    :desc="m.desc"
  />
</div>
