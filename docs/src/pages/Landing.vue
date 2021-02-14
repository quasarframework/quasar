<template lang="pug">
q-page.landing
  section
    .landing__hero.q-mt-lg.flex.flex-center
      .relative-position.text-center
        .text-h1
          img.landing__logo(src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg")
          .text-bold.text-primary Quasar
          .landing__hero-row.row.no-wrap.items-baseline.justify-center.text-grey
            | Framework
        .text-subtitle1.q-pa-sm.q-my-sm.bg-grey-3.rounded-borders Efortlessly build high-performance <strong>Vue 3</strong> user interfaces in record time
        .q-pt-md.q-pl-sm
          .landing__hero-row.landing__hero-btns.q-gutter-sm.row.items-center.justify-center
            q-btn(color="primary" no-caps to="/start" label="Get Started")
            q-btn(color="brown" no-caps to="/introduction-to-quasar" label="Why Quasar?")
            q-btn(color="accent" no-caps to="/video-tutorials" label="Video Tutorials")

  section.landing__front.text-center
    div
      .row.justify-center
        introduction-video.landing__video

  section.padding.bg-white.text-grey-10.text-center
    .landing__features.row.items-start.q-col-gutter-xl
      .col-12.text-center
        h4 All Platforms in One Go
      .col-12.text-center
        .landing__feature-item.q-gutter-lg
          q-icon(:name="fabApple")
          q-icon(:name="fabWindows")
          q-icon(:name="fabLinux")
          q-icon(:name="fabAndroid")
          q-icon(:name="fabChrome")
          q-icon(:name="fabFirefox")
          q-icon(:name="fabEdge")
          q-icon(:name="fabSafari")
      .col-12.text-center
        p Combine the power of Quasar UI with Quasar CLI. One source code for all platforms simultaneously with all the latest and greatest best practices out of the box. Focus only on your app's features and forget about the boilerplate around it.
      .col-12.q-gutter-md
        q-btn(color="red", no-caps, no-wrap, :icon-right="mdiLaunch", label="User Interface Components", to="/vue-components")
        q-btn(color="primary", no-caps, no-wrap, :icon-right="mdiLaunch", label="SPA (Single Page App)", to="/quasar-cli/developing-spa/introduction")
        q-btn(color="teal", no-caps, no-wrap, :icon-right="mdiLaunch", label="PWA (Progressive Web App)", to="/quasar-cli/developing-pwa/introduction")
        q-btn(color="pink", no-caps, no-wrap, :icon-right="mdiLaunch", label="BEX (Browser Extension)", to="/quasar-cli/developing-browser-extensions/introduction")
        q-btn(color="accent", no-caps, no-wrap, :icon-right="mdiLaunch", label="SSR (Server-side Rendered App)", to="/quasar-cli/developing-ssr/introduction")
        q-btn(color="orange", no-caps, no-wrap, :icon-right="mdiLaunch", label="Hybrid Mobile App", to="/quasar-cli/developing-mobile-apps")
        q-btn(color="indigo", no-caps, no-wrap, :icon-right="mdiLaunch", label="Multi-platform Desktop App", to="/quasar-cli/developing-electron-apps/introduction")

  section.padding.bg-white.text-grey-10.text-center
    div
      .text-h4.q-mb-xl Silver, Gold and Platinum Sponsors:
      sponsor-list

  section.landing__footer.flex.flex-center
    div.text-center
      div.landing__footer-icons.row.flex-center.q-gutter-md
        a(href="https://github.quasar.dev", target="_blank", rel="noopener")
          q-icon(:name="fabGithub")

        a(href="https://blog.quasar.dev", target="_blank", rel="noopener")
          q-icon(:name="mdiBlogger")

        a(href="https://chat.quasar.dev", rel="noopener", target="_blank")
          q-icon(:name="mdiChat")

        a(href="https://forum.quasar.dev/", rel="noopener", target="_blank")
          q-icon(:name="mdiForum")

        a(href="https://twitter.quasar.dev", target="_blank", rel="noopener")
          q-icon(:name="fabTwitter")

        a(href="https://facebook.quasar.dev", target="_blank", rel="noopener")
          q-icon(:name="fabFacebook")

        a(href="https://donate.quasar.dev", rel="sponsored", target="_blank")
          q-icon(:name="fasMedkit")

      div.q-mt-lg
        | <doc-link to="https://github.com/quasarframework/quasar/blob/dev/LICENSE">MIT LICENSE</doc-link> | <doc-link to="https://www.iubenda.com/privacy-policy/40685560">Privacy Policy</doc-link> | <doc-link to="https://github.com/quasarframework/quasar-art">Quasar Artwork</doc-link>

      div Copyright © 2015 - {{ year }} PULSARDEV SRL, Razvan Stoenescu
</template>

<script>
import { useMeta } from 'quasar'

import Sponsor from 'components/page-parts/sponsors-and-backers/Sponsor'
import SponsorList from 'components/page-parts/sponsors-and-backers/SponsorList'
import LandingTopBar from 'components/page-parts/landing/LandingTopBar'
import IntroductionVideo from 'components/page-parts/introduction-to-quasar/IntroductionVideo'
// import SurveyCountdown from '../components/SurveyCountdown'

import {
  fabGithub, fabTwitter, fabFacebook, fasMedkit,
  fabApple, fabWindows, fabLinux, fabAndroid, fabChrome,
  fabFirefox, fabEdge, fabSafari, fabGoogle
} from '@quasar/extras/fontawesome-v5'

import {
  mdiChevronDown, mdiLaunch, mdiBlogger,
  mdiChat, mdiForum
} from '@quasar/extras/mdi-v5'

import { useDocStore } from 'assets/doc-store.js'

export default {
  name: 'Landing',

  components: {
    Sponsor,
    SponsorList,
    LandingTopBar,
    // SurveyCountdown,
    IntroductionVideo
  },

  setup () {
    useMeta({
      title: 'Quasar Framework',
      titleTemplate: ''
    })

    const $store = useDocStore()
    $store.toc = []

    return {
      year: (new Date()).getFullYear(),

      fabGithub,
      fabTwitter,
      fabFacebook,
      fasMedkit,
      fabApple,
      fabWindows,
      fabLinux,
      fabAndroid,
      fabChrome,
      fabFirefox,
      fabEdge,
      fabSafari,
      fabGoogle,

      mdiChevronDown,
      mdiLaunch,
      mdiBlogger,
      mdiChat,
      mdiForum
    }
  }
}
</script>

<style lang="sass">
.landing

  > section
    display: flex
    justify-content: center
    padding: 0 16px

    &.padding
      padding: 50px 16px

    > div
      position: relative
      max-width: 1040px
      width: 100%

  &__hero

    .text-h1
      margin-left: 2px
      margin-bottom: 28px

  &__front
    padding: 50px 16px 50px !important

    > div
      max-width: 700px !important

  &__video
    width: 530px
    max-width: 100%

  &__logo
    width: 170px
    height: 170px
    margin: 0 4px

  &__arrow-down
    top: 100%
    left: 50%
    transform: translateX(-50%)
  &__arrow-down-icon
    animation: landing-bounce 2s infinite

  &__feature-item
    .q-icon
      font-size: 64px

  &__features

    h4, h6
      margin: 26px 0

    h6
      margin-top: 18px

    p
      opacity: .6
      font-size: 16px

  &__footer
    padding-top: 72px !important
    padding-bottom: 72px !important

  &__footer-icons
    font-size: 28px

    a
      text-decoration: none
      outline: 0
      color: $primary
      transition: color .28s

      &:hover
        color: $teal

@media (max-width: 718px)
  .landing

    &__hero
      text-align: center

      .landing__hero-row
        justify-content: center

      .text-h1
        font-size: 3.5rem
        line-height: 4.05rem

    > section.padding
      padding-top: 90px
      padding-bottom: 90px

    .landing__feature-item
      text-align: center

    &__hero-btns
      justify-content: center
</style>
