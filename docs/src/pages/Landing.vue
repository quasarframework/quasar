<template lang="pug">
.landing.text-white
  .landing__space.fixed

  section
    .landing__hero.flex.flex-center
      .relative-position.text-center
        .text-h1
          div
            span.text-bold Quasar
            span.text-subtitle1 v{{ $q.version }}
          .landing__hero-row.row.no-wrap.items-baseline.justify-center
            span Framew
            img.landing__logo(src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg")
            span rk
        .text-subtitle1.q-pl-sm Build high-performance <strong>VueJS</strong> user interfaces in record time
        .q-pt-sm.q-px-sm
          conf-countdown.landing-countdown.bg-primary.text-white.rounded-borders(
            color="white"
            text-color="primary"
            align-class="justify-center"
          )
        .q-pt-md.q-pl-sm
          .landing__hero-row.landing__hero-btns.q-gutter-sm.row.items-center.justify-center
            q-btn(color="white" text-color="primary" no-caps to="/start" label="Get Started")
            q-btn(color="white" text-color="primary" no-caps to="/introduction-to-quasar" label="Why Quasar?")
            q-btn(color="white" text-color="primary" no-caps to="/video-tutorials" label="Video Tutorials")
        .landing__arrow-down.row.justify-center.absolute
          q-icon.landing__arrow-down-icon.q-mt-xl(:name="mdiChevronDown" size="50px")

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
        p One source code for all platforms simultaneously through Quasar CLI with all the latest and greatest best practices out of the box. Focus only on your app's features and forget about the boilerplate around it.
      .col-12.q-gutter-md
        q-btn(color="red", no-caps, no-wrap, :icon-right="mdiLaunch", label="User Interface Components", to="/vue-components")
        q-btn(color="primary", no-caps, no-wrap, :icon-right="mdiLaunch", label="SPA (Single Page App)", to="/quasar-cli/developing-spa/introduction")
        q-btn(color="teal", no-caps, no-wrap, :icon-right="mdiLaunch", label="PWA (Progressive Web App)", to="/quasar-cli/developing-pwa/introduction")
        q-btn(color="pink", no-caps, no-wrap, :icon-right="mdiLaunch", label="BEX (Browser Extension)", to="/quasar-cli/developing-browser-extensions/introduction")
        q-btn(color="accent", no-caps, no-wrap, :icon-right="mdiLaunch", label="SSR (Server-side Rendered App)", to="/quasar-cli/developing-ssr/introduction")
        q-btn(color="orange", no-caps, no-wrap, :icon-right="mdiLaunch", label="Hybrid Mobile App", to="/quasar-cli/developing-mobile-apps")
        q-btn(color="indigo", no-caps, no-wrap, :icon-right="mdiLaunch", label="Multi-platform Desktop App", to="/quasar-cli/developing-electron-apps/introduction")

  section.padding.bg-primary
    .landing__features.row.justify-between.items-start.q-col-gutter-xl

      .col-xs-12.col-sm-5
        .landing__feature-item
          q-icon(name="gps_fixed")
          h6 Quasar's goal
          p What we want to achieve with Quasar is to raise the bar for web development as a whole. Make it go forward, evolve. Change minds. Point out when there’s a better alternative to current establishment. You deserve a stellar development experience.

      .col-xs-12.col-sm-5
        .landing__feature-item
          q-icon(:name="fabGoogle")
          h6 Material Design 2.0
          p Quasar is focused on following the Material 2.0 Guidelines and to stay up-to-date to them.

      .col-xs-12.col-sm-5
        .landing__feature-item
          q-icon(name="group_add")
          h6 Big community
          p We have grown into a big community. You can get help or advise others through Quasar's Discord chat server or the Quasar Forum. You're not alone.

      .col-xs-12.col-sm-5
        .landing__feature-item
          q-icon(name="flash_on")
          h6 Top Class, Fast Web Components
          p There's a component for almost every web development need out there. Each of these components are carefully crafted to offer the best possible experience to your users. Quasar is designed with performance and responsiveness in mind – so the overhead of using Quasar is barely noticeable. This is an area we take special pride in.

      .col-xs-12.col-sm-5
        .landing__feature-item
          q-icon(name="settings_applications")
          h6 Best practices integrated by default
          p Quasar developers are encouraged to follow web development best practices, and Quasar comes with many embedded features to that regard out of the box. HTML/CSS/JS minification, cache busting, tree shaking, source-mapping, code-splitting and lazy loading, ES6 transpiling, linting code, accessibility features. Quasar takes care of all these and more - no configuration needed.

      .col-xs-12.col-sm-5
        .landing__feature-item
          q-icon(name="format_align_right")
          h6 Full RTL support
          p RTL (right to left) support for both Quasar components and developer's own code. Developer-written website/app CSS code gets automatically converted to RTL, if an RTL language pack is used.

      .col-xs-12.col-sm-5
        .landing__feature-item
          q-icon(name="language")
          q-icon(name="translate")
          h6 Internationalization and Localization
          p There's more than 40 Quasar language packs available. If your desired language pack is missing it takes just 5 minutes to add it.

      .col-xs-12.col-sm-5
        .landing__feature-item
          q-icon(name="collections_bookmark")
          h6 Great documentation
          p It's worth mentioning the significant amount of time that is spent on writing great, bloat-free, focused, complete documentation pages so you as a developer can quickly pick up Quasar.

      .col-xs-12.col-sm-5
        .landing__feature-item
          q-icon(name="security")
          h6 We care deeply about Security
          p We are always paranoid about the security of Quasar and the security of apps built with Quasar. We are on a constant lookout to inform you about any security threats that you might need to know about. We have Security guidelines and we are even offering our security expertise through the Quasar Audit program.

      .col-xs-12.col-sm-5
        .landing__feature-item
          q-icon(name="exit_to_app")
          h6 Progressively migrate your existing project
          p Quasar offers a UMD (Unified Module Definition) version, which you add as a CSS and a JS HTML tags into an existing project and you're ready to use it. No build step is required.

      .col-xs-12.col-sm-5
        .landing__feature-item
          q-icon(name="star")
          h6 Unparalleled developer experience through Quasar CLI
          p Quasar CLI takes care of all the quirks involved in developing an SPA, PWA, SSR, Mobile and Electron App.

      .col-xs-12.col-sm-5
        .landing__feature-item
          q-icon(name="important_devices")
          h6 Focus on your App
          p Your full focus is on your App's content rather than all other boilerplating stuff around it (build system, layout, and much more). You'll be spending time only on what matters, which is your product. Quasar greatly increases your productivity.

  section.padding.bg-white.text-grey-10.text-center
    div
      .text-h6.text-primary.q-mb-xl Silver, Gold and Platinum Sponsors:
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

  landing-top-bar
</template>

<script>
import Sponsor from 'components/page-parts/sponsors-and-backers/Sponsor'
import SponsorList from 'components/page-parts/sponsors-and-backers/SponsorList'
import LandingTopBar from 'components/page-parts/landing/LandingTopBar'
import IntroductionVideo from 'components/page-parts/introduction-to-quasar/IntroductionVideo'
import ConfCountdown from '../components/ConfCountdown'

import {
  fabGithub, fabTwitter, fabFacebook, fasMedkit,
  fabApple, fabWindows, fabLinux, fabAndroid, fabChrome,
  fabFirefox, fabEdge, fabSafari, fabGoogle
} from '@quasar/extras/fontawesome-v5'

import {
  mdiChevronDown, mdiLaunch, mdiBlogger,
  mdiChat, mdiForum
} from '@quasar/extras/mdi-v5'

export default {
  name: 'Landing',

  components: {
    Sponsor,
    SponsorList,
    LandingTopBar,
    IntroductionVideo,
    ConfCountdown
  },

  meta: {
    title: 'Quasar Framework',
    titleTemplate: ''
  },

  created () {
    this.year = (new Date()).getFullYear()

    this.fabGithub = fabGithub
    this.fabTwitter = fabTwitter
    this.fabFacebook = fabFacebook
    this.fasMedkit = fasMedkit
    this.fabApple = fabApple
    this.fabWindows = fabWindows
    this.fabLinux = fabLinux
    this.fabAndroid = fabAndroid
    this.fabChrome = fabChrome
    this.fabFirefox = fabFirefox
    this.fabEdge = fabEdge
    this.fabSafari = fabSafari
    this.fabGoogle = fabGoogle

    this.mdiChevronDown = mdiChevronDown
    this.mdiLaunch = mdiLaunch
    this.mdiBlogger = mdiBlogger
    this.mdiChat = mdiChat
    this.mdiForum = mdiForum
  }
}
</script>

<style lang="sass">
.landing

  background: #111

  > section
    display: flex
    justify-content: center
    padding: 0 16px

    &.padding
      padding: 180px 16px

    > div
      position: relative
      max-width: 1040px
      width: 100%

  &__hero
    min-height: 100vh

    .text-h1
      margin-left: 2px
      margin-bottom: 28px

  &__front
    padding: 130px 16px 100px !important
    background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.9) 15%)
    > div
      max-width: 700px !important

  &__video
    width: 530px
    max-width: 100%

  &__logo
    width: 72px
    height: 72px
    margin: 0 4px
    animation: logo-rotate 80s linear infinite

  &__space
    width: 400vw
    height: 400vh
    top: 50%
    left: 50%
    margin-top: -200vh
    margin-left: -200vw
    animation: logo-rotate 200s linear infinite
    background-size: 240px
    backface-visibility: visible
    background-image: url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8yIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDI0MCAyNDAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0MCAyNDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxyZWN0IHg9IjEwNiIgeT0iOTAiIGZpbGw9IiNGRkZGRkYiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiLz48cmVjdCB4PSI3NCIgeT0iNjMiIGZpbGw9IiNGRkZGRkYiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz48cmVjdCB4PSIyMyIgeT0iNjYiIGZpbGw9IiNGRkZGRkYiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz48cmVjdCB4PSI1MCIgeT0iMTEwIiBmaWxsPSIjRkZGRkZGIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIi8+PHJlY3QgeD0iNjMiIHk9IjEyOCIgZmlsbD0iI0ZGRkZGRiIgd2lkdGg9IjEiIGhlaWdodD0iMSIvPjxyZWN0IHg9IjQ1IiB5PSIxNDkiIGZpbGw9IiNGRkZGRkYiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz48cmVjdCB4PSI5MiIgeT0iMTUxIiBmaWxsPSIjRkZGRkZGIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIi8+PHJlY3QgeD0iNTgiIHk9IjgiIGZpbGw9IiNGRkZGRkYiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz48cmVjdCB4PSIxNDciIHk9IjMzIiBmaWxsPSIjRkZGRkZGIiB3aWR0aD0iMiIgaGVpZ2h0PSIyIi8+PHJlY3QgeD0iOTEiIHk9IjQzIiBmaWxsPSIjRkZGRkZGIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIi8+PHJlY3QgeD0iMTY5IiB5PSIyOSIgZmlsbD0iI0ZGRkZGRiIgd2lkdGg9IjEiIGhlaWdodD0iMSIvPjxyZWN0IHg9IjE4MiIgeT0iMTkiIGZpbGw9IiNGRkZGRkYiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz48cmVjdCB4PSIxNjEiIHk9IjU5IiBmaWxsPSIjRkZGRkZGIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIi8+PHJlY3QgeD0iMTM4IiB5PSI5NSIgZmlsbD0iI0ZGRkZGRiIgd2lkdGg9IjEiIGhlaWdodD0iMSIvPjxyZWN0IHg9IjE5OSIgeT0iNzEiIGZpbGw9IiNGRkZGRkYiIHdpZHRoPSIzIiBoZWlnaHQ9IjMiLz48cmVjdCB4PSIyMTMiIHk9IjE1MyIgZmlsbD0iI0ZGRkZGRiIgd2lkdGg9IjIiIGhlaWdodD0iMiIvPjxyZWN0IHg9IjEyOCIgeT0iMTYzIiBmaWxsPSIjRkZGRkZGIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIi8+PHJlY3QgeD0iMjA1IiB5PSIxNzQiIGZpbGw9IiNGRkZGRkYiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz48cmVjdCB4PSIxNTIiIHk9IjIwMCIgZmlsbD0iI0ZGRkZGRiIgd2lkdGg9IjEiIGhlaWdodD0iMSIvPjxyZWN0IHg9IjUyIiB5PSIyMTEiIGZpbGw9IiNGRkZGRkYiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiLz48cmVjdCB5PSIxOTEiIGZpbGw9IiNGRkZGRkYiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz48cmVjdCB4PSIxMTAiIHk9IjE4NCIgZmlsbD0iI0ZGRkZGRiIgd2lkdGg9IjEiIGhlaWdodD0iMSIvPjwvc3ZnPg==)

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
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 65%, #000)
    padding-top: 72px !important
    padding-bottom: 72px !important

    .doc-link
      color: #fff

      &:hover
        opacity: .8

  &__footer-icons
    font-size: 28px

    a
      text-decoration: none
      outline: 0
      color: white
      transition: color .28s

      &:hover
        color: $grey-4

.landing-countdown
  border-top: 4px solid darken($primary, 10%)
  border-bottom: 4px solid darken($primary, 10%)

@keyframes logo-rotate
  100%
    transform: rotate(-360deg)

@keyframes landing-bounce
  0%, 20%, 50%, 80%, 100%
    transform: translate3d(0, 0, 0)
  40%
    transform: translateY(-30px)
  60%
    transform: translateY(-15px)

@media (max-width: 718px)
  .landing

    &__hero
      text-align: center

      .landing__hero-row
        justify-content: center

      .text-h1
        font-size: 4rem
        line-height: 4.05rem

    > section.padding
      padding-top: 90px
      padding-bottom: 90px

    .landing__feature-item
      text-align: center

    &__hero-btns
      justify-content: center

    &__logo
      width: 46px
      height: 46px
</style>
