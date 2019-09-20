<template lang="pug">
.landing.text-white
  section
    .landing__hero

      div(style="height: 28vh")
      .landing__hero-content.row.justify-center.q-gutter-xl

        .row
          img.landing__logo(src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg")

        .flex.justify-end
          .q-gutter-sm
            .col
              .text-h1
                div.text-weight-bold Quasar
                div Framework
              .text-subtitle1.q-pl-sm Build high-performance <strong>VueJS</strong> user interfaces in record time
              .q-pt-md.q-pl-sm
                .landing__hero-btns.q-gutter-md.row.items-center
                  q-btn(push, color="white", text-color="primary", to="/introduction-to-quasar", label="About")
                  q-btn(push, color="white", text-color="primary", to="/start", label="Docs")
                  q-btn(push, color="white", text-color="primary", to="/quasar-cli/installation", label="Install")
                  .text-body2 v{{ $q.version }}

        .row.justify-center.col-10
          q-icon.landing__arrow-down(name="keyboard_arrow_down" size="50px")

  section.landing__front.text-center
    div
      .q-gutter-md.row.justify-center
        q-btn(color="red", push, no-caps, no-wrap, icon-right="launch", label="User Interface Components", to="/vue-components")
        q-btn(color="primary", push, no-caps, no-wrap, icon-right="launch", label="SPA (Single Page App)", to="/quasar-cli/developing-spa/introduction")
        q-btn(color="teal", push, no-caps, no-wrap, icon-right="launch", label="PWA (Progressive Web App)", to="/quasar-cli/developing-pwa/introduction")
        q-btn(color="accent", push, no-caps, no-wrap, icon-right="launch", label="SSR (Server-side Rendered App)", to="/quasar-cli/developing-ssr/introduction")
        q-btn(color="orange", push, no-caps, no-wrap, icon-right="launch", label="Hybrid Mobile App", to="/quasar-cli/developing-cordova-apps/introduction")
        q-btn(color="indigo", push, no-caps, no-wrap, icon-right="launch", label="Multi-platform Desktop App", to="/quasar-cli/developing-electron-apps/introduction")

  section.padding.bg-white.text-grey-10.text-center
    .landing__features.row.items-start.q-col-gutter-xl
      .col-12.text-center
        img.doc-img(src="https://cdn.quasar.dev/img/responsive.png")
      .col-12.text-center
        .q-gutter-lg
          q-icon(name="fab fa-apple")
          q-icon(name="fab fa-windows")
          q-icon(name="fab fa-linux")
          q-icon(name="fab fa-android")
          q-icon(name="fab fa-chrome")
          q-icon(name="fab fa-firefox")
          q-icon(name="fab fa-edge")
          q-icon(name="fab fa-safari")
      .col-12.text-center
        h4 All Platforms in One Go
        p One source code for all platforms simultaneously through Quasar CLI with all the latest and greatest best practices out of the box. Focus only on your app's features and forget about the boilerplate around it.

  section.padding.bg-primary.landing__swirl-bg
    .landing__features.row.justify-between.items-start.q-col-gutter-xl

      .col-xs-12.col-sm-5
        .feature-item
          q-icon(name="fas fa-chart-line")
          h6 Quasar's goal
          p What we want to achieve with Quasar is to raise the bar for web development as a whole. Make it go forward, evolve. Change minds. Point out when there’s a better alternative to current establishment. You deserve a stellar development experience.

      .col-xs-12.col-sm-5
        .feature-item
          q-icon(name="fab fa-google")
          h6 Material Design 2.0
          p Quasar is focused on following the Material 2.0 Guidelines and to stay up-to-date to them.

      .col-xs-12.col-sm-5
        .feature-item
          q-icon(name="fas fa-users")
          h6 Big community
          p We have grown into a big community. You can get help or advise others through Quasar's Discord chat server or the Quasar Forum. You're not alone.

      .col-xs-12.col-sm-5
        .feature-item
          q-icon(name="fas fa-bolt")
          h6 Top Class, Fast Web Components
          p There's a component for almost every web development need out there. Each of these components are carefully crafted to offer the best possible experience to your users. Quasar is designed with performance and responsiveness in mind – so the overhead of using Quasar is barely noticeable. This is an area we take special pride in.

      .col-xs-12.col-sm-5
        .feature-item
          q-icon(name="fas fa-cogs")
          h6 Best practices integrated by default
          p Quasar developers are encouraged to follow web development best practices, and Quasar comes with many embedded features to that regard out of the box. HTML/CSS/JS minification, cache busting, tree shaking, sourcemapping, code-splitting and lazy loading, ES6 transpiling, linting code, accessibility features. Quasar takes care of all these and more - no configuration needed.

      .col-xs-12.col-sm-5
        .feature-item
          q-icon(name="fas fa-align-right")
          h6 Full RTL support
          p RTL (right to left) support for both Quasar components and developer's own code. Developer-written website/app CSS code gets automatically converted to RTL, if an RTL language pack is used.

      .col-xs-12.col-sm-5
        .feature-item
          .q-gutter-sm
            q-icon(name="fab fa-chrome")
            q-icon(name="fab fa-firefox")
            q-icon(name="fab fa-safari")
            q-icon(name="fab fa-edge")
          h6 Wide platform support
          p Google Chrome, Firefox, IE11/Edge, Safari, Opera, iOS, Android, Windows Phone, Blackberry. We care a great deal about your website or app's behavior both on desktop browsers and on mobile browsers.

      .col-xs-12.col-sm-5
        .feature-item
          q-icon(name="fas fa-language")
          h6 Internationalization and Localization
          p There's more than 40 Quasar language packs available. If your desired language pack is missing it takes just 5 minutes to add it.

      .col-xs-12.col-sm-5
        .feature-item
          q-icon(name="fas fa-graduation-cap")
          h6 Great documentation
          p It's worth mentioning the significant amount of time that is spent on writing great, bloat-free, focused, complete documentation pages so you as a developer can quickly pick up Quasar.

      .col-xs-12.col-sm-5
        .feature-item
          q-icon(name="fas fa-shield-alt")
          h6 We care deeply about Security
          p We are always paranoid about the security of Quasar and the security of apps built with Quasar. We are on a constant lookout to inform you about any security threats that you might need to know about. We have Security guidelines and we are even offering our security expertise through the Quasar Audit program.

      .col-xs-12.col-sm-5
        .feature-item
          q-icon(name="fas fa-sign-in-alt")
          h6 Progressively migrate your existing project
          p Quasar offers a UMD (Unified Module Definition) version, which you add as a CSS and a JS HTML tags into an existing project and you're ready to use it. No build step is required.

      .col-xs-12.col-sm-5
        .feature-item
          q-icon(name="fas fa-star")
          h6 Unparalleled developer experience through Quasar CLI
          p Quasar CLI takes care of all the quirks involved in developing an SPA, PWA, SSR, Mobile and Electron App.

      .col-xs-12.col-sm-5
        .feature-item
          q-icon(name="fas fa-chart-line")
          h6 Focus on your App
          p Your full focus is on your App's content rather than all other boilerplating stuff around it (build system, layout, and much more). You'll be spending time only on what matters, which is your product. Quasar greatly increases your productivity.

  section.padding.bg-white.text-grey-10.text-center
    div
      .text-h6.text-primary.q-mb-xl Silver, Gold and Platinum Sponsors:

      sponsor-list.justify-center

  section.landing__footer.flex.flex-center
    div.text-center
      div.landing__footer-icons.row.flex-center
        a(href="https://github.quasar.dev", target="_blank", rel="noopener")
          q-icon(name="fab fa-github")

        a(href="https://blog.quasar.dev", target="_blank", rel="noopener")
          q-icon(name="fab fa-medium")

        a(href="https://chat.quasar.dev", target="_blank", rel="noopener")
          q-icon(name="fab fa-discord")

        a(href="https://forum.quasar.dev/", target="_blank", rel="noopener")
          q-icon(name="fas fa-comments")

        a(href="https://twitter.quasar.dev", target="_blank", rel="noopener")
          q-icon(name="fab fa-twitter")

        a(href="https://facebook.quasar.dev", target="_blank", rel="noopener")
          q-icon(name="fab fa-facebook")

        a(href="https://donate.quasar.dev", target="_blank", rel="noopener")
          q-icon(name="fas fa-medkit")

      div.q-mt-md
        | Subscribe to our <doc-link to="/newsletter">Newsletter</doc-link>.
      div.q-mt-sm
        | <doc-link to="https://github.com/quasarframework/quasar/blob/dev/LICENSE">MIT LICENSE</doc-link> | <doc-link to="https://www.iubenda.com/privacy-policy/40685560">Privacy Policy</doc-link> | <doc-link to="https://github.com/quasarframework/quasar-art">Quasar Artwork</doc-link>

      div Copyright © 2015 - {{ year }} PULSARDEV SRL, Razvan Stoenescu

  landing-top-bar
</template>

<script>
import Sponsor from 'components/page-parts/sponsors-and-backers/Sponsor'
import SponsorList from 'components/page-parts/sponsors-and-backers/SponsorList'
import LandingTopBar from 'components/page-parts/landing/LandingTopBar'

export default {
  name: 'Landing',

  components: {
    Sponsor,
    SponsorList,
    LandingTopBar
  },

  meta: {
    title: 'Quasar Framework',
    titleTemplate: ''
  },

  created () {
    this.year = (new Date()).getFullYear()
  }
}
</script>

<style lang="sass">
.landing
  background: #000 url('https://cdn.quasar.dev/img/quasar-cover.jpg') no-repeat center center fixed
  background-size: cover

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

  &__front
    padding: 130px 16px 100px !important
    background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.6) 15%)
    > div
      max-width: 700px !important

  &__logo
    width: 150px
    height: 150px
    margin-top: 21px
    animation: logo-rotate 240s linear infinite

  &__arrow-down
    margin-top: 100px
    animation: landing-bounce 2s infinite

  &__features
    .q-icon
      font-size: 64px
      padding-left: 16px

    h4, h6
      margin: 26px 0

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

  &__swirl-bg
    background-repeat: no-repeat !important
    background-position: top center
    background-size: contain !important
    background-image: url(https://cdn.quasar.dev/img/landing_first_section.png) !important

  &__footer-icons
    font-size: 28px

    a
      margin: 0 8px 8px
      text-decoration: none
      outline: 0
      color: white
      transition: color .28s

      &:hover
        color: $grey-4

@keyframes logo-rotate
  100%
    transform: rotate(-360deg)

@keyframes landing-bounce
  0%, 20%, 50%, 80%, 100%
    transform: translate3d(0, 0, 0)
  40%
    transform: translate3d(0, -30px, 0)
  60%
    transform: translate3d(0, -15px, 0)

@media (max-width: 718px)
  .landing
    &__hero
      text-align: center

      .text-h1
        font-size: 3rem
        line-height: 3.05rem
        margin-bottom: 24px

    > section.padding
      padding-top: 90px
      padding-bottom: 90px

    .feature-item
      text-align: center

    &__hero-content
      padding-bottom: 180px

    &__hero-btns
      justify-content: center

    &__arrow-down
      margin-top: 50px

body.mobile .landing
  background: unset

  &:before
    content: ''
    position: fixed /* stretch a fixed position to the whole screen */
    top: 0
    height: 100vh /* fix for mobile browser address bar appearing disappearing */
    left: 0
    right: 0
    bottom: 0
    z-index: -1 /* needed to keep in the background */
    background: #000 url('https://cdn.quasar.dev/img/quasar-cover.jpg') center center
    background-size: cover
</style>
