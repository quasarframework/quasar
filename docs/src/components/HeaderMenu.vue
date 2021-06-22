<template lang="pug">
div
  q-btn-dropdown.text-bold(:align="align", flat, no-caps, stretch, :label="`v${$q.version}`", auto-close)
    q-list(dense padding)
      q-item-label(header) Latest (v{{ $q.version }})
      q-item(clickable, to="/start/release-notes")
        q-item-section.text-teal(avatar)
          q-icon(:name="mdiClipboardText")
        q-item-section.text-no-wrap Release notes

      q-item(clickable, tag="a", href="https://github.com/quasarframework/quasar/issues", target="_blank", rel="noopener")
        q-item-section.text-purple(avatar)
          q-icon(:name="mdiBugCheck")
        q-item-section.text-no-wrap Report a bug

      q-item(clickable, tag="a", href="https://github.com/quasarframework/quasar", target="_blank", rel="noopener")
        q-item-section(avatar)
          q-icon(:name="fabGithub")
        q-item-section Repository

      q-separator.q-mb-sm.q-mt-md

      q-item-label(header) Older Releases
      q-item(
        key="v1-link"
        clickable
        tag="a"
        href="https://v1.quasar.dev/"
        target="_blank"
        rel="noopener"
      )
        q-item-section v1 docs
      q-item(
        v-for="version in ['17', '16', '15', '14', '13']"
        :key="version"
        clickable
        tag="a"
        :href="`https://v0-${version}.quasar-framework.org/`"
        target="_blank"
        rel="noopener"
      )
        q-item-section {{ `v0.${version}` }} docs

  q-btn-dropdown.text-bold(:align="align", flat, no-caps, stretch, label="Tools", auto-close)
    q-list(dense padding)
      q-item(clickable, tag="a", href="https://awesome.quasar.dev", rel="noopener", target="_blank")
        q-item-section.text-yellow-9(avatar)
          q-icon(:name="mdiFlare")
        q-item-section.text-no-wrap Awesome List

      q-item(to="/app-extensions/discover")
        q-item-section.text-brand-primary(avatar)
          q-icon(:name="mdiFilePlus")
        q-item-section.text-no-wrap App Extensions

      q-item-label.q-mt-md(header) Helpers

      q-item(clickable, to="/icongenie")
        q-item-section.text-red(avatar)
          q-icon(:name="mdiStarCircle")
        q-item-section.text-no-wrap
          .row.no-wrap.items-center
            span Icon Genie CLI
            //- q-badge.q-ml-sm new

      q-item(clickable, to="/style/theme-builder")
        q-item-section.text-teal(avatar)
          q-icon(:name="mdiPaletteSwatch")
        q-item-section.text-no-wrap Theme Builder

      q-item(clickable, to="/style/dark-mode")
        q-item-section(avatar)
          q-icon(:name="mdiInvertColors")
        q-item-section.text-no-wrap Dark Mode

      q-item(clickable, tag="a", href="layout-builder", target="_blank")
        q-item-section.text-brand-primary(avatar)
          q-icon(:name="mdiViewDashboard")
        q-item-section.text-no-wrap Layout Builder

      q-item(clickable, to="/layout/gallery")
        q-item-section.text-grey-8(avatar)
          q-icon(:name="mdiShoppingMusic")
        q-item-section.text-no-wrap Layout Gallery

      q-item(clickable, to="/layout/grid/flex-playground")
        q-item-section.text-orange(avatar)
          q-icon(:name="fasFlask")
        q-item-section.text-no-wrap
          .row.no-wrap.items-center
            span Flex Playground

      q-item-label.q-mt-md(header) Playground

      q-item(clickable, tag="a", href="https://codepen.quasar.dev", target="_blank", rel="noopener")
        q-item-section.text-brown-5(avatar)
          q-icon(:name="fabCodepen")
        q-item-section Codepen

      q-item(clickable, tag="a", href="https://jsfiddle.quasar.dev", target="_blank", rel="noopener")
        q-item-section.text-brand-primary(avatar)
          q-icon(:name="fabJsfiddle")
        q-item-section jsFiddle

      q-item(clickable, tag="a", href="https://codesandbox.quasar.dev", target="_blank", rel="noopener")
        q-item-section.text-black(avatar)
          q-icon(:name="fasCubes")
        q-item-section Codesandbox

  q-btn-dropdown.text-bold(:align="align", flat, no-caps, stretch, label="Support", auto-close)
    q-list(dense padding)

      q-item(clickable, tag="a", href="https://chat.quasar.dev", rel="noopener", target="_blank")
        q-item-section.text-brand-primary(avatar)
          q-icon(:name="mdiChat")
        q-item-section.text-no-wrap Discord Chat

      q-item(clickable, tag="a", href="https://forum.quasar.dev/", rel="noopener", target="_blank")
        q-item-section.text-secondary(avatar)
          q-icon(:name="mdiForum")
        q-item-section Forum

      q-item(clickable, tag="a", href="https://github.com/quasarframework", rel="noopener", target="_blank")
        q-item-section(avatar)
          q-icon(:name="fabGithub")
        q-item-section.text-no-wrap GitHub Repositories

      q-item-label.q-mt-md(header) Social

      q-item(clickable, tag="a", href="https://blog.quasar.dev", rel="noopener", target="_blank")
        q-item-section.text-brand-primary(avatar)
          q-icon(:name="mdiBlogger")
        q-item-section Blog

      q-item(clickable, tag="a", href="https://github.com/quasarframework/quasar/discussions/categories/announcements", target="_blank", rel="noopener")
        q-item-section.text-purple(avatar)
          q-icon(:name="mdiBullhorn")
        q-item-section Announcements

      q-item(clickable, tag="a", href="https://twitter.quasar.dev", target="_blank", rel="noopener")
        q-item-section.text-blue(avatar)
          q-icon(:name="fabTwitter")
        q-item-section Twitter

      q-item(clickable, tag="a", href="https://facebook.quasar.dev", target="_blank", rel="noopener")
        q-item-section.text-blue-8(avatar)
          q-icon(:name="fabFacebook")
        q-item-section
          .row.no-wrap.items-center
            span Facebook

      q-item-label.q-mt-md(header) Donate

      q-item(clickable, tag="a", href="https://donate.quasar.dev", target="_blank", rel="noopener")
        q-item-section(avatar)
          q-icon(:name="mdiCharity")
        q-item-section.text-no-wrap GitHub Sponsorship
</template>

<script>
import {
  fabGithub, fasFlask, fabCodepen, fabJsfiddle,
  fasCubes, fabTwitter, fabFacebook
} from '@quasar/extras/fontawesome-v5'

import {
  mdiBlogger, mdiForum, mdiChat, mdiBullhorn,
  mdiViewDashboard, mdiShoppingMusic, mdiClipboardText,
  mdiBugCheck, mdiFlare, mdiFilePlus, mdiPaletteSwatch,
  mdiInvertColors, mdiCharity, mdiStarCircle
} from '@quasar/extras/mdi-v5'

export default {
  name: 'HeaderMenu',

  props: {
    align: String
  },

  setup () {
    return {
      fabGithub,
      fasFlask,
      fabCodepen,
      fabJsfiddle,
      fasCubes,
      fabTwitter,
      fabFacebook,

      mdiBlogger,
      mdiChat,
      mdiForum,
      mdiBullhorn,
      mdiViewDashboard,
      mdiShoppingMusic,
      mdiClipboardText,
      mdiBugCheck,
      mdiFlare,
      mdiFilePlus,
      mdiPaletteSwatch,
      mdiInvertColors,
      mdiCharity,
      mdiStarCircle
    }
  }
}
</script>
