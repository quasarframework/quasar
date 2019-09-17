<template lang="pug">
section.fixed-top.landing-top-bar.text-white
  q-toolbar.q-pa-none
    q-btn.quasar-logo.text-bold(flat, no-caps, no-wrap, to="/start")
      q-avatar.landing-top-bar__avatar
        img(src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg")
      q-toolbar-title Docs

    q-space

    q-btn.q-mr-xs(type="a", flat, icon="fab fa-github", href="https://github.quasar.dev", target="_blank", rel="noopener")
    q-btn.q-mr-xs.gt-xs(type="a", flat, icon="fab fa-medium", href="https://blog.quasar.dev", target="_blank", rel="noopener")
    q-btn.q-mr-xs(type="a", flat, icon="fab fa-discord", href="https://chat.quasar.dev", target="_blank", rel="noopener")
    q-btn.q-mr-xs(type="a", flat, icon="fas fa-comments", href="https://forum.quasar.dev/", target="_blank", rel="noopener")
    q-btn.q-mr-xs.gt-xs(type="a", flat, icon="fab fa-twitter", href="https://twitter.quasar.dev", target="_blank", rel="noopener")
    q-btn.q-mr-xs.gt-xs(type="a", flat, icon="fab fa-facebook", href="https://facebook.quasar.dev", target="_blank", rel="noopener")
    q-btn.gt-xs(type="a", flat, icon="email", to="/newsletter", rel="noopener")
</template>

<style lang="stylus">
.landing-top-bar
  background: linear-gradient(to bottom, #000, transparent)
  padding: 0 !important

  .q-btn
    border-radius: 0 0 5px 5px
    align-self: stretch

  &__avatar > div
    border-radius: 0
</style>
