---
title: Meet the Team
desc: The list of people behind Quasar Framework.
keys: Team
components:
  - ./TeamMember
scope:
  core:
  - name: Razvan Stoenescu
    role: Creator, Lead Dev & Architect
    avatar: razvan_stoenescu.jpeg
    email: razvan@quasar.dev
    twitter: rstoenescu1
    github: rstoenescu
    desc: Architecture and development of Quasar on all fronts
  - name: Dan Popescu
    role: Senior Core Developer
    avatar: dan_popescu.jpg
    email: dan@quasar.dev
    github: pdanpdan
    desc: Focuses on Quasar UI components, directives and plugins
  - name: Jeff Galbraith
    role: Senior Developer
    avatar: jeff_galbraith.jpg
    email: jeff@quasar.dev
    twitter: jgalbraith64
    github: hawkeye64
    desc: UI components, App Extensions and community outreach
  - name: Scott Molinari
    role: Media Manager
    avatar: scott_molinari.jpg
    github: smolinari
    desc: Manages our Facebook page, blog and forum. Helps with docs, bug reports,
      external systems, writes and manages articles and offers community support.
  - name: Paolo Caleffi
    role: Senior Developer
    avatar: paolo_caleffi.jpg
    github: IlCallo
    desc: Typescript support
  - name: Yusuf Kandemir
    role: Senior Developer
    avatar: yusuf_kandemir.jpg
    github: yusufkandemir
    desc: Wizard developer on multiple areas of Quasar
  - name: Aldrin Marquez
    role: Community Staff
    avatar: aldrin_marquez.jpg
    github: metalsadman
    desc: Help desk
  - name: Luke Diebold
    role: Senior developer
    avatar: luke_diebold.png
    github: ldiebold
    desc: Creates video tutorials, podcasts and shows for Quasar Framework.
  - name: Niccolò Menozzi
    role: Senior designer
    avatar: niccolo_menozzi.jpg
    github: NiccoloMenozzi
    desc: UX manager, brand management, communication, business strategy.
  others:
  - name: Allan Gaunt
    role: Senior Developer
    avatar: allan_gaunt.png
    github: webnoob
    desc: Wrote the initial BEX mode and much more
  - name: Tobias Mesquita
    role: Senior Developer
    avatar: tobias_mesquita.jpg
    github: TobyMosque
    desc: Help desk
  - name: Kerry Huguet
    role: Senior Developer
    avatar: kerry_huguet.jpeg
    github: outofmemoryagain
    desc: Typescript support
  - name: Noah Klayman
    role: Developer / Community Staff
    avatar: noah_klayman.jpeg
    github: nklayman
    desc: Wrote the initial Capacitor mode
  - name: Heitor Ribeiro
    role: Community Staff
    avatar: heitor_ribeiro.jpg
    github: bloodf
    desc: Writes articles and offers community support.
  - name: Jesús Villanueva
    role: Senior Developer
    avatar: jesus_villanueva.jpg
    github: jesusvilla
    desc: Help desk
  - name: Dmitrij Polianin
    role: Trainer / Community Staff
    avatar: dmitrij_polianin.jpg
    email: dmitrij.polyanin@gmail.com
    github: DmitrijOkeanij
    desc: Russian Community maintainer and Quasar Trainer.
---

Hailing from all around the planet, the Quasar Team is not only international but full of people with a vast range of fields of expertise. From real rocket engineers to Fortune 500 developers, the unifying factor among us is our dedication to quality and the love for our community of contributors and developers.

With hundreds of contributors to Quasar, **the list of people you can meet below is by no means exhaustive**. Just remember to thank everyone using Quasar and supporting us, because together we all help you push your products light-years ahead of your competition. A great way to do that is to [donate](https://donate.quasar.dev).

### Core Team

<div class="row items-stretch q-gutter-sm">
  <team-member
    v-for="m in scope.core"
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
  <team-member
    v-for="m in scope.others"
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
