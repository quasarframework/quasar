<template lang="pug">
section.fixed-top.landing-top-bar.text-white
  q-toolbar.q-pa-none
    q-btn.quasar-logo.text-bold(flat, no-caps, no-wrap, to="/start")
      q-avatar.landing-top-bar__avatar
        img(src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg")
      q-toolbar-title Docs

    q-space

    q-btn.q-mr-xs(type="a", flat, :icon="fabGithub", href="https://github.quasar.dev", target="_blank", rel="noopener")
    q-btn.q-mr-xs.gt-xs(type="a", flat, :icon="mdiBlogger", href="https://blog.quasar.dev", target="_blank", rel="noopener")
    q-btn.q-mr-xs(type="a", flat, :icon="mdiChat", href="https://chat.quasar.dev", target="_blank", rel="noopener")
    q-btn.q-mr-xs(type="a", flat, :icon="mdiForum", href="https://forum.quasar.dev/", target="_blank", rel="noopener")
    q-btn.q-mr-xs.gt-xs(type="a", flat, :icon="fabTwitter", href="https://twitter.quasar.dev", target="_blank", rel="noopener")
    q-btn.gt-xs(type="a", flat, :icon="fabFacebook", href="https://facebook.quasar.dev", target="_blank", rel="noopener")
</template>

<script>
import {
  fabGithub, fabTwitter, fabFacebook
} from '@quasar/extras/fontawesome-v5'

import {
  mdiBlogger, mdiChat, mdiForum
} from '@quasar/extras/mdi-v4'

export default {
  name: 'LandingTopBar',

  created () {
    this.fabGithub = fabGithub
    this.fabTwitter = fabTwitter
    this.fabFacebook = fabFacebook

    this.mdiBlogger = mdiBlogger
    this.mdiChat = mdiChat
    this.mdiForum = mdiForum
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
