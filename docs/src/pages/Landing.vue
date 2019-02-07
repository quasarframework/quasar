<template lang="pug">
.landing
  section.landing__toolbar.bg-primary.text-white
    q-toolbar.q-pa-none
      q-btn.quasar-logo.text-bold(flat, no-caps, no-wrap, to="/start")
        q-avatar
          img(src="https://cdn.quasar-framework.org/img/quasar-logo.png")
        q-toolbar-title(shrink) Get started

      q-space

      q-btn.q-mr-sm(type="a", flat, icon="fab fa-github", href="https://github.com/quasarframework/quasar", target="_blank")
      q-btn.q-mr-sm(type="a", flat, icon="fab fa-twitter", href="https://twitter.com/quasarframework", target="_blank")
      q-btn.q-mr-sm(type="a", flat, icon="fab fa-medium", href="https://medium.com/quasar-framework", target="_blank")
      q-btn.q-mr-sm(type="a", flat, icon="fab fa-discord", href="https://discord.gg/5TDhbDg", target="_blank")
      q-btn(type="a", flat, icon="fas fa-comments", href="https://forum.quasar-framework.org/", target="_blank")

  section.bg-primary.text-white
    .landing__hero.row
      .col-8.flex.items-center
        .q-gutter-md
          .text-h1
            div.text-weight-bold Quasar
            div Framework

          div
            .q-gutter-md.row.items-center
              q-btn(push, color="white", text-color="primary", to="/start", label="Get started")
              .text-body2 v{{ $q.version }}

      .col-4.row.items-center.justify-end
        img.landing__logo(src="https://cdn.quasar-framework.org/logo/svg/quasar-logo.svg")

</template>

<script>
export default {
  name: 'Landing',

  meta: {
    title: 'Quasar Framework'
  }
}
</script>

<style lang="stylus">
.landing

  > section
    display flex
    justify-content center
    position relative
    padding 0 16px

    > div
      position relative
      max-width 800px
      width 100%

  &__toolbar

    &:before
      content ''
      position absolute
      top 0
      right 0
      bottom 0
      left 0
      background linear-gradient(to bottom, rgba(0,0,0,.2), transparent 70%)

    .q-btn
      border-radius 0 0 5px 5px
      align-self stretch

  &__hero
    min-height 70vh

  &__logo
    width 184px
    height 184px
</style>
