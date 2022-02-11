<template lang="pug">
q-layout.doc-layout.bg-lp-light-grey(view="hHh LpR lff", @scroll="handleScroll")
  main-layout-header(v-model="leftDrawerState" :scroll-data="headerScrollData")

  q-drawer.doc-left-drawer(
    side="left"
    v-model="leftDrawerState"
    show-if-above
    bordered
  )
    q-scroll-area(style="height: 100%;")
      app-menu.q-mb-lg

  q-drawer(
    v-if="hasRightDrawer"
    side="right"
    v-model="rightDrawerState"
    show-if-above
    :width="220"
    @on-layout="updateRightDrawerOnLayout"
  )
    q-scroll-area.fit
      header-menu.q-mt-sm.text-brand-primary.column(v-if="$q.screen.lt.sm", align="right")

      q-list.doc-toc.q-my-sm.text-grey-8
        q-item(
          v-for="tocItem in tocList"
          :key="tocItem.id"
          :id="'toc--'+tocItem.id"
          clickable
          v-ripple
          dense
          @click="scrollTo(tocItem.id)",
          :active="activeToc === tocItem.id"
        )
          q-item-section(v-if="tocItem.sub === true", side) »
          q-item-section {{ tocItem.title }}

  q-page-container
    router-view

  q-page-scroller(:scroll-offset="150" :offset="[18, 18]")
    q-btn(round icon="arrow_upward" color="lp-accent" class="shadow-bottom-small" size="md")
</template>

<script>
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

import {
  mdiMenu, mdiClipboardText, mdiHeart, mdiMagnify, mdiChevronUp
} from '@quasar/extras/mdi-v6'

import AppMenu from 'components/AppMenu.js'
import AppSearchResults from 'components/AppSearchResults.vue'
// import SurveyCountdown from 'components/SurveyCountdown.vue'
import HeaderMenu from 'components/HeaderMenu.vue'
import MainLayoutHeader from 'components/landing-page/MainLayoutHeader'

import useToc from './doc-layout/use-toc'
import useDrawers from './doc-layout/use-drawers'
import useScroll from './doc-layout/use-scroll'

export default {
  name: 'DocLayout',

  components: {
    AppMenu,
    AppSearchResults,
    HeaderMenu,
    MainLayoutHeader
  },

  setup () {
    const $q = useQuasar()
    const $route = useRoute()
    const headerScrollData = ref()
    const HEADER_SCROLL_OFFSET = 100 // number of pixels of scroll before firing a possible header scroll

    const scope = {
      mdiMenu,
      mdiClipboardText,
      mdiHeart,
      mdiMagnify,
      mdiChevronUp
    }

    useToc(scope, $route)
    useDrawers(scope, $q, $route)
    useScroll(scope, $route)

    function handleScroll (scrollDetails) {
      if (!headerScrollData.value) {
        headerScrollData.value = scrollDetails
      }
      else if (Math.abs(scrollDetails.position - headerScrollData.value.position) > HEADER_SCROLL_OFFSET) {
        // only initiate a possible scroll direction change every HEADER_SCROLL_OFFSETpx scroll
        headerScrollData.value = scrollDetails
      }
      scope.onScroll(scrollDetails)
    }

    return { ...scope, headerScrollData, handleScroll }
  }
}
</script>

<style lang="sass">
@supports (backdrop-filter: none)
  .header
    background-color: rgba(0,0,0,.1)
    backdrop-filter: blur(7px)

@supports not (backdrop-filter: none)
  .header
    background-color: $grey-4

.doc-layout__main-btn
  width: 200px

.q-drawer--mobile
  .doc-toc
    .q-item
      margin-left: 3px
    .q-item--active
      font-weight: 600

.doc-toc .q-item
  border-radius: 10px 0 0 10px
  margin-top: 1px
  margin-bottom: 1px
  font-size: 12px

  .q-item__section--side
    padding-right: 8px

  &.q-item--active
    background: scale-color($primary, $lightness: 90%)

.doc-left-drawer
  overflow: inherit !important

.q-page-container :target
  scroll-margin-top: ($toolbar-min-height + 16px)

// keep the button on top of sticky in examples
.q-page-scroller > .q-page-sticky
  z-index: 1

.doc-layout
  .countdown
    .heading
      font-size: 18px
    .time
      font-size: 38px

.app-search-input,
.app-search-input .q-field__control
  height: 50px

.app-search-input
  .q-field__control
    padding: 0 18px 0 16px !important
  input
    line-height: 38px
  .q-field__prepend,
  .q-field__append
    height: 100%
    cursor: text !important
  kbd
    font-size: .6em !important
    min-width: 1.6em
    min-height: 1.5em
    font-weight: bold

body.mobile .app-search-input kbd
  display: none

.layout-countdown
  background: linear-gradient(45deg, #e6f1fc 25%, #c3e0ff 25%, #c3e0ff 50%, #e6f1fc 50%, #e6f1fc 75%, #c3e0ff 75%, #c3e0ff)
  background-size: 40px 40px
</style>
