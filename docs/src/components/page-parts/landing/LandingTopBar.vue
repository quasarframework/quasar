<template lang="pug">
section.fixed-top.landing-top-bar.text-white
  q-toolbar.q-pa-none
    q-btn.quasar-logo.text-bold(flat, no-caps, no-wrap, to="/start")
      q-avatar.landing-top-bar__avatar
        img(src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg")
      q-toolbar-title Docs

    q-space

    q-btn.q-mr-xs(type="a", flat, :icon="fabGithub", href="https://github.quasar.dev", target="_blank", rel="noopener")
    q-btn.q-mr-xs.gt-xs(type="a", flat, :icon="fabMedium", href="https://blog.quasar.dev", target="_blank", rel="noopener")
    q-btn.q-mr-xs(type="a", flat, icon="chat", href="https://chat.quasar.dev", target="_blank", rel="noopener")
    q-btn.q-mr-xs(type="a", flat, icon="forum", href="https://forum.quasar.dev/", target="_blank", rel="noopener")
    q-btn.q-mr-xs.gt-xs(type="a", flat, :icon="fabTwitter", href="https://twitter.quasar.dev", target="_blank", rel="noopener")
    q-btn.gt-xs(type="a", flat, :icon="fabFacebook", href="https://facebook.quasar.dev", target="_blank", rel="noopener")
</template>

<script>
import {
  fabGithub, fabMedium, fabTwitter, fabFacebook
} from '@quasar/extras/fontawesome-v5'

export default {
  name: 'LandingTopBar',

  created () {
    this.fabGithub = fabGithub
    this.fabMedium = fabMedium
    this.fabTwitter = fabTwitter
    this.fabFacebook = fabFacebook
  }
}
</script>

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
