<template lang="pug">
q-layout.doc-layout(view="lHh LpR lff", @scroll="onScroll")
  q-header.header(elevated)
    q-toolbar
      q-btn.q-mr-sm(flat, dense, round, @click="toggleLeftDrawer", aria-label="Menu", :icon="mdiMenu")

      q-btn.quasar-logo.text-bold(key="logo", flat, no-caps, no-wrap, stretch, to="/")
        q-avatar.doc-layout-avatar
          img(src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg")
        q-toolbar-title(shrink) Quasar

      q-space

      header-menu.self-stretch.row.no-wrap(v-if="$q.screen.gt.xs")

      q-btn.q-ml-xs(
        v-show="showRightDrawerToggler"
        flat,
        dense,
        round,
        @click="toggleRightDrawer",
        aria-label="Menu"
        :icon="mdiClipboardText"
      )

  q-drawer(
    side="left"
    v-model="leftDrawerState"
    show-if-above
    bordered
    class="doc-left-drawer"
  )
    q-scroll-area(style="height: calc(100% - 50px); margin-top: 50px")
      //- survey-countdown.layout-countdown(
      //-   color="primary"
      //-   align-class="justify-start"
      //-   padding-class="q-py-md"
      //- )
      q-separator.q-mb-lg

      .row.justify-center.q-my-lg
        q-btn(
          type="a"
          href="https://donate.quasar.dev"
          target="_blank"
          rel="noopener"
          size="13px"
          color="primary"
          :icon="mdiHeartOutline"
          label="Donate to Quasar"
        )

      app-menu.q-my-lg

    .absolute-top.bg-white.layout-drawer-toolbar
      form(
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
      )
        q-input.full-width.doc-algolia.bg-primary(
          ref="algoliaInputRef"
          v-model="search"
          dense
          square
          dark
          borderless
          :placeholder="searchPlaceholder"
          @focus="onSearchFocus"
          @blur="onSearchBlur"
        )
          template(v-slot:append)
            q-icon(
              :name="mdiMagnify"
              @click="$refs.algoliaInputRef.focus()"
            )
      .layout-drawer-toolbar__shadow.absolute-full.overflow-hidden.no-pointer-events

  q-drawer(
    v-if="hasRightDrawer"
    side="right"
    v-model="rightDrawerState"
    show-if-above
    class="bg-grey-1"
    :width="180"
    @on-layout="updateRightDrawerOnLayout"
  )
    q-scroll-area.fit
      header-menu.q-mt-sm.text-primary.column(v-if="$q.screen.lt.sm", align="right")

      q-list.doc-toc.q-my-lg.text-grey-8
        q-item(
          v-for="tocItem in tocList",
          :key="tocItem.id",
          clickable,
          v-ripple,
          dense,
          @click="scrollTo(tocItem.id)",
          :active="activeToc === tocItem.id"
        )
          q-item-section(v-if="tocItem.sub === true", side) •
          q-item-section {{ tocItem.title }}

  q-page-container
    router-view
    //- TODO vue3 - wait for router-view + transition bugfix
    //- router-view(v-slot="{ Component }")
    //-   transition(
    //-     enter-active-class="animated fadeIn"
    //-     leave-active-class="animated fadeOut"
    //-     mode="out-in"
    //-     @enter="scrollToCurrentAnchor"
    //-   )
    //-     component(:is="Component")

  q-page-scroller
    q-btn(fab-mini, color="primary", glossy, :icon="mdiChevronUp")
</template>

<script>
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'

import {
  mdiMenu, mdiClipboardText, mdiHeartOutline, mdiMagnify, mdiChevronUp
} from '@quasar/extras/mdi-v5'

import AppMenu from 'components/AppMenu'
import HeaderMenu from 'components/HeaderMenu'
// import SurveyCountdown from 'components/SurveyCountdown'

import useToc from './doc-layout/use-toc'
import useDrawers from './doc-layout/use-drawers'
import useScroll from './doc-layout/use-scroll'
import useAlgolia from './doc-layout/use-algolia'

export default {
  name: 'DocLayout',

  components: {
    AppMenu,
    // SurveyCountdown,
    HeaderMenu
  },

  setup () {
    const $q = useQuasar()
    const $route = useRoute()

    const scope = {
      mdiMenu,
      mdiClipboardText,
      mdiHeartOutline,
      mdiMagnify,
      mdiChevronUp
    }

    useToc(scope, $route)
    useDrawers(scope, $q, $route)
    useScroll(scope, $route)
    useAlgolia(scope, $q, $route)

    return scope
  }
}
</script>

<style lang="sass">
@import '../css/docsearch'

.header
  background: linear-gradient(145deg, $primary 11%, $dark-primary 75%)

.header-logo
  width: 25px
  height: 25px

.doc-layout-avatar > div
  border-radius: 0

.layout-drawer-toolbar
  > form
    margin-right: -2px
  &__shadow
    bottom: -10px
    &:after
      content: ''
      position: absolute
      top: 0
      right: 0
      bottom: 10px
      left: 0
      box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.2), 0 0px 10px rgba(0, 0, 0, 0.24)

.doc-algolia
  .q-field__control
    padding: 0 18px 0 16px !important
  &.q-field--focused
    .q-icon
      color: #fff

.q-drawer--mobile
  .layout-drawer-toolbar form
    margin-right: -1px
  .doc-algolia .q-field__control
    padding-right: 17px !important
  .doc-toc
    .q-item
      margin-left: 3px
    .q-item--active
      font-weight: 600

.doc-toc .q-item
  border-radius: 10px 0 0 10px
  margin-top: 1px
  margin-bottom: 1px

  &.q-item--active
    background: scale-color($primary, $lightness: 90%)

.doc-left-drawer
  overflow: inherit !important

.quasar-logo
  img
    transform: rotate(0deg)
    transition: transform .8s ease-in-out
  &:hover img
    transform: rotate(-360deg)

.q-page-container :target
  scroll-margin-top: ($toolbar-min-height + 16px)

.doc-layout
  .countdown
    .heading
      font-size: 18px
    .time
      font-size: 38px

.layout-countdown
  background: linear-gradient(45deg, #e6f1fc 25%, #c3e0ff 25%, #c3e0ff 50%, #e6f1fc 50%, #e6f1fc 75%, #c3e0ff 75%, #c3e0ff)
  background-size: 40px 40px
</style>
