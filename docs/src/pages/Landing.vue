<template lang="pug">
q-page.landing
  section.landing__front.text-center
    div
      .row.justify-center
        introduction-video.landing__video

  section.bg-white.text-grey-10.text-center.row.justify-center
    .landing__features.row
      .col-12.text-center
        h4 All Platforms in One Go
      .col-12.text-center.q-my-xl
        .landing__features-icons.q-gutter-lg
          q-icon(:name="fabApple")
          q-icon(:name="fabWindows")
          q-icon(:name="fabLinux")
          q-icon(:name="fabAndroid")
          q-icon(:name="fabChrome")
          q-icon(:name="fabFirefox")
          q-icon(:name="fabEdge")
          q-icon(:name="fabSafari")
      .col-12.text-center.q-my-xl
        p Combine the power of Quasar UI with Quasar CLI. One source code for all platforms simultaneously with all the latest and greatest best practices out of the box. Focus only on your app's features and forget about the boilerplate around it.
      .col-12.row.justify-center
        q-card.bg-grey-1.q-px-lg.q-py-sm(bordered flat)
          q-card-section(horizontal)
            q-card-section.text-left.column.items-center.q-gutter-sm
              q-badge(label="$ yarn global add @quasar/cli" color="grey-8")
              q-badge(label="$ yarn create quasar" color="grey-8")
            q-separator(vertical)
            q-card-section.text-left.column.items-center.q-gutter-sm
              q-badge(label="$ npm i -g @quasar/cli" color="grey-8")
              q-badge(label="$ npm init quasar" color="grey-8")

  section.bg-white.text-grey-10.text-center.row.justify-center
    .landing__features.row
      .col-12.q-my-xl.row.items-center.justify-center
        q-img.col-12.col-sm-4.landing__icongenie-logo(src="https://cdn.quasar.dev/img/iconfactory.png")
        .col-12.col-sm-8.column.items-center
          h4 Quasar Icon Genie
          .q-mt-lg.q-mb-xl Consumes a source icon and automatically clones, scales, minifies and places the (needed) 100+ generated icons and splash screens in the appropriate directories for you.
          q-btn(color="brand-primary", unelevated, no-caps, no-wrap, :icon-right="mdiLaunch", label="IconGenie", to="/icongenie/introduction")
</template>

<script>
import { useMeta } from 'quasar'

import IntroductionVideo from 'components/page-parts/introduction-to-quasar/IntroductionVideo.vue'

import {
  fasMedkit, fabApple, fabWindows, fabLinux, fabAndroid, fabChrome,
  fabFirefox, fabEdge, fabSafari, fabGoogle
} from '@quasar/extras/fontawesome-v5'

import {
  mdiChevronDown, mdiLaunch, mdiPost,
  mdiChat, mdiForum
} from '@quasar/extras/mdi-v6'

import { useDocStore } from 'assets/doc-store.js'
import features from 'assets/features.js'

export default {
  name: 'Landing',

  components: {
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
      features,

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
      mdiPost,
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
    padding: 70px 16px 100px

    > div
      position: relative
      max-width: 1040px
      width: 100%

  &__icongenie-logo
    max-width: 220px !important

  &__front

    > div
      max-width: 700px !important

  &__video
    width: 530px
    max-width: 100%

  &__features

    h4, h6
      margin: 26px 0

    h6
      margin-top: 18px

    p
      opacity: .6
      font-size: 16px

    &-icons
      font-size: 64px

    &-link
      color: $grey-9
      text-decoration: none !important
      padding: 2px 3px

      &:hover
        color: $brand-primary
</style>
