---
title: Meet the Team
description: The list of people behind Quasar Framework.
canonical: https://quasar.dev/meet-the-team
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

Hailing from all around the planet, the Quasar Team is not only international but full of people with a vast range of fields of expertise. From real rocket engineers to Fortune 500 developers, the unifying factor among us is our dedication to quality and the love for our community of contributors and developers.

With hundreds of contributors to Quasar, **the list of people you can meet below is by no means exhaustive**. Just remember to thank everyone using Quasar and supporting us, because together we all help you push your products light-years ahead of your competition. A great way to do that is to [donate](https://donate.quasar.dev).

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
