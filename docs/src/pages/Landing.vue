<template lang="pug">
.landing.text-white
  section
    .landing__hero

      div(style="height: 28vh")
      .landing__hero-content.row.justify-center.q-gutter-xl

        .row
          img.landing__logo(src="https://cdn.quasar-framework.org/logo/svg/quasar-logo.svg")

        .flex.justify-end
          .q-gutter-sm
            .text-h1
              div.text-weight-bold Quasar
              div Framework

            .text-subtitle1.text-italic.q-pl-sm High Performance Material 2.0 Full Frontend Stack
            .landing__hero-btns.q-pt-md.q-pl-sm.row.items-center
              q-btn(push, color="white", text-color="primary", to="/start", label="Get started")
              .text-body2.q-ml-md v{{ $q.version }}

  section.padding(style="background: rgba(0,0,0,.5);")
    div
      div.q-mb-lg Quasar (pronounced /ˈkweɪ.zɑɹ/) is an MIT licensed open-source Vue.js based framework, which allows you as a web developer to quickly create responsive++ websites/apps in many flavours:
      .q-gutter-md.row
        q-btn(color="primary", push, no-caps, no-wrap, icon-right="launch", label="SPA (Single Page App)", to="/quasar-cli/developing-spa/introduction")
        q-btn(color="teal", push, no-caps, no-wrap, icon-right="launch", label="PWA (Progressive Web App)", to="/quasar-cli/developing-pwa/introduction")
        q-btn(color="accent", push, no-caps, no-wrap, icon-right="launch", label="SSR (Server-side Rendered App)", to="/quasar-cli/developing-ssr/introduction")
        q-btn(color="orange", push, no-caps, no-wrap, icon-right="launch", label="Hybrid Mobile App", to="/quasar-cli/developing-mobile-apps/introduction")
        q-btn(color="red", push, no-caps, no-wrap, icon-right="launch", label="Multi-platform Desktop App", to="/quasar-cli/developing-electron-apps/introduction")

      div.q-mt-lg Write code once and simultaneously deploy it as a website, a Mobile App and/or an Electron App. Yes, <strong>same codebase for all</strong>, helping you develop an app in record time by using a state of the art CLI and backed by well-written, very fast Quasar web components.

  section.padding.bg-white.text-grey-10.text-center
    div
      .text-h6.text-primary.q-mb-xl Proudly sponsored by
      .q-gutter-md.flex.flex-center
        a
          img(width='200px', src='https://cdn.quasar-framework.org/sponsors/think-health-data.png')
        a(href='https://truelogic.com', target='_blank')
          img(width='200px', src='https://cdn.quasar-framework.org/sponsors/truelogic.png')
        a(href='https://www.tayloredtechnology.net', target='_blank')
          img(width='200px', src='https://cdn.quasar-framework.org/sponsors/taylored-technology-big.jpeg')
        a(href='http://campuscloudservices.com', target='_blank')
          img(width='222px', src='https://cdn.quasar-framework.org/sponsors/campus-cloud-services.png')
        a(href='https://www.jugglestreet.com', target='_blank')
          img(width='222px', src='https://cdn.quasar-framework.org/sponsors/juggle-street.png')
        a(href='http://comcomservices.com', target='_blank')
          img(width='222px', src='https://cdn.quasar-framework.org/sponsors/com-com-services.png')
        a(href='http://www.kalisio.com', target='_blank')
          img(width='222px', src='https://cdn.quasar-framework.org/sponsors/kalisio.png')
        a(href='http://platformpurple.com', target='_blank')
          img(width='222px', src='https://cdn.quasar-framework.org/sponsors/platform-purple.png')
        a(href='http://www.bgasoft.com', target='_blank')
          img(width='222px', src='https://cdn.quasar-framework.org/sponsors/bgasoft.png')
        a(href='https://www.letsbutterfly.com/', target='_blank')
          img(width='170px', src='https://cdn.quasar-framework.org/sponsors/letsbutterfly.png')

  section.padding.bg-primary
    .landing__features.row.items-start.q-col-gutter-xl
      .col-12.text-center
        .feature-item.q-mx-md
          img.doc-img(src="https://cdn.quasar-framework.org/img/responsive-logo.png")
          h4 All Platforms in One Go
          p One source code for all platforms simultaneously: responsive desktop/mobile websites (SPA or SSR), PWAs (Progressive Web Apps), mobile apps (that look native) and Desktop apps (through Electron).

      .col-xs-12.col-sm-6
        .feature-item
          q-icon(name="fab fa-google")
          h6 Material Design 2.0
          p Quasar is focused on following the Material Guidelines 2.0 and stay up to date to it.

      .col-xs-12.col-sm-6
        .feature-item
          q-icon(name="fas fa-users")
          h6 Big community
          p We have grown into a big community. You can get help or advise others through Quasar's Discord chat server or the Quasar Forum. You're not alone when in need of an advice.

      .col-xs-12.col-sm-6
        .feature-item
          q-icon(name="fas fa-bolt")
          h6 Top Class, Fast Web Components
          p There's a component for almost every web development need out there. Each of these components are carefully crafted to offer the best possible experience to users. Quasar is designed with performance and responsiveness in mind – so the overhead of using Quasar is barely noticeable. This is an area we take special pride in.

      .col-xs-12.col-sm-6
        .feature-item
          q-icon(name="fas fa-cogs")
          h6 Best practices integrated by default
          p Quasar developers are encouraged to follow web development best practices, and it comes with many embedded features to that regard out of the box. HTML/CSS/JS minification, cache busting, tree shaking, sourcemapping, code-splitting and lazy loading, ES6 transpiling, linting code, accessibility features. Quasar takes care of all these and more - no configuration needed.

      .col-xs-12.col-sm-6
        .feature-item
          q-icon(name="fas fa-align-right")
          h6 Full RTL support
          p RTL (right to left) support for both Quasar components and developer's own code. Developer-written website/app CSS code gets automatically converted to RTL if an RTL language pack is used.

      .col-xs-12.col-sm-6
        .feature-item
          .q-gutter-sm
            q-icon(name="fas fa-browser")
            q-icon(name="fab fa-chrome")
            q-icon(name="fab fa-firefox")
            q-icon(name="fab fa-safari")
            q-icon(name="fab fa-edge")
          h6 Wide platform support
          p Google Chrome, Firefox, IE11/Edge, Safari, Opera, iOS, Android, Windows Phone, Blackberry. We care a great deal about your website or app's behavior both on desktop browsers and on mobile browsers.

      .col-xs-12.col-sm-6
        .feature-item
          q-icon(name="fas fa-language")
          h6 Internationalization and Localization
          p There's more than 40 Quasar language packs available. If your desired language pack is missing it takes just 5 minutes to add it.

      .col-xs-12.col-sm-6
        .feature-item
          q-icon(name="fas fa-graduation-cap")
          h6 Great documentation
          p It's worth mentioning the significant amount of time that is spent on writing great, bloat-free, focused, complete documentation pages so you as a developer can quickly pick up Quasar.

      .col-xs-12.col-sm-6
        .feature-item
          q-icon(name="fas fa-sign-in-alt")
          h6 Progressively migrate your existing project
          p Quasar offers an UMD (Unified Module Definition) version, which you add a CSS and JS HTML tag into existing project and you're ready to use it. No build step is required.

      .col-xs-12.col-sm-6
        .feature-item
          q-icon(name="fas fa-star")
          h6 Unparalleled developer experience through Quasar CLI
          p Quasar CLI takes care of all the quirks involved in developing a SPA, PWA, SSR, Mobile and Electron App.

      .col-xs-12.col-sm-6
        .feature-item
          q-icon(name="fas fa-chart-line")
          h6 Focus on your App
          p Your full focus is on your App's content rather than all other boilerplating stuff around it (build system, layout, and many more). You'll be spending time only on what matters, which is your product. Quasar greatly increases your productivity.

  section.landing__footer
    div.text-center
      div.footer__icons.row.flex-center
        a(href="https://github.com/quasarframework/quasar", target="_blank")
          q-icon(name="fab fa-github")

        a(href="https://twitter.com/quasarframework", target="_blank")
          q-icon(name="fab fa-twitter")

        a(href="https://medium.com/quasar-framework", target="_blank")
          q-icon(name="fab fa-medium")

        a(href="https://discord.gg/5TDhbDg", target="_blank")
          q-icon(name="fab fa-discord")

        a(href="https://forum.quasar-framework.org/", target="_blank")
          q-icon(name="fas fa-comments")

      div.q-mt-md
        | Released under the <doc-link to="https://github.com/quasarframework/quasar/blob/dev/LICENSE">MIT LICENSE</doc-link>

      div Copyright © 2015 - {{ year }} PULSARDEV SRL, Razvan Stoenescu

  section.fixed-top.landing__toolbar.text-white
    q-toolbar.q-pa-none
      q-btn.quasar-logo.text-bold(flat, no-caps, no-wrap, to="/start")
        q-avatar
          img(src="https://cdn.quasar-framework.org/img/quasar-logo.png")
        q-toolbar-title(shrink) Docs

      q-space

      q-btn.q-mr-xs(type="a", flat, icon="fab fa-github", href="https://github.com/quasarframework/quasar", target="_blank")
      q-btn.q-mr-xs(type="a", flat, icon="fab fa-twitter", href="https://twitter.com/quasarframework", target="_blank")
      q-btn.q-mr-xs.gt-xs(type="a", flat, icon="fab fa-medium", href="https://medium.com/quasar-framework", target="_blank")
      q-btn.q-mr-xs(type="a", flat, icon="fab fa-discord", href="https://discord.gg/5TDhbDg", target="_blank")
      q-btn.gt-xs(type="a", flat, icon="fas fa-comments", href="https://forum.quasar-framework.org/", target="_blank")
</template>

<script>
export default {
  name: 'Landing',

  meta: {
    title: 'Quasar Framework'
  },

  created () {
    this.year = (new Date()).getFullYear()
  }
}
</script>

<style lang="stylus">
.landing
  background #000 url(https://cdn.quasar-framework.org/img/quasar-cover.jpg) no-repeat center center fixed
  background-size cover

  > section
    display flex
    justify-content center
    padding 0 16px

    &.padding
      padding 180px 16px

    > div
      position relative
      max-width 800px
      width 100%

  &__toolbar
    background linear-gradient(to bottom, #000, transparent)
    padding 0 !important

    .q-btn
      border-radius 0 0 5px 5px
      align-self stretch

  &__hero
    min-height 100vh

  &__logo
    width 150px
    height 150px
    margin-top 21px
    animation logo-rotate 240s linear infinite

  &__features
    .q-icon
      font-size 64px
    h4, h6
      margin 26px 0
    p
      opacity .6

  &__footer
    border-top 1px solid #fff
    background linear-gradient(to bottom, rgba(0,0,0,.5), #000)
    padding-top 72px !important
    padding-bottom 72px !important

@keyframes logo-rotate
  100%
    transform rotate(-360deg)

@media (max-width 691px)
  .landing

    &__hero
      text-align center
      .text-h1
        font-size 3rem
        line-height 3.05rem
        margin-bottom 24px
    > section.padding
      padding-top 90px
      padding-bottom 90px
    .feature-item
      text-align center
    &__hero-content
      padding-bottom 180px
    &__hero-btns
      justify-content center
</style>
