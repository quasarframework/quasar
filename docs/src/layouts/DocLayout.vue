<template lang="pug">
q-layout.doc-layout(view="lHh LpR lff", @scroll="onScroll")
  q-header.header.text-dark(bordered)
    q-toolbar.q-px-none
      q-btn.q-mx-sm.lt-md(flat, dense, round, @click="toggleLeftDrawer", aria-label="Menu", :icon="mdiMenu")

      q-btn.quasar-logo.text-bold(key="logo", flat, no-caps, no-wrap, stretch, to="/")
        q-avatar.doc-layout-avatar
          img(src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg")
        q-toolbar-title.text-weight-bold(shrink) Quasar

      q-space

      header-menu.self-stretch.row.no-wrap(v-if="$q.screen.gt.xs")

      q-btn.q-mx-xs(
        v-show="showRightDrawerToggler"
        flat
        dense
        round
        @click="toggleRightDrawer"
        aria-label="Menu"
        :icon="mdiClipboardText"
      )

  q-drawer.doc-left-drawer(
    side="left"
    v-model="leftDrawerState"
    show-if-above
    bordered
  )
    q-scroll-area(style="height: calc(100% - 51px); margin-top: 51px")
      app-search-results(
        v-if="searchResults !== null"
        :results="searchResults"
        :search-has-focus="searchHasFocus"
        :search-active-id="searchActiveId"
      )

      template(v-else)
        .row.justify-center.q-my-md
          q-btn.doc-layout__main-btn(
            type="a"
            href="https://donate.quasar.dev"
            target="_blank"
            rel="noopener"
            color="teal"
            outline
            :icon="mdiHeart"
            label="Donate to Quasar"
            padding="12px lg"
            no-wrap
          )

        .row.justify-center.q-my-md
          q-btn.doc-layout__main-btn(
            type="a"
            href="https://bit.ly/3cTLXsO"
            target="_blank"
            color="primary"
            outline
            :icon="mdiFileDocumentEditOutline"
            label="Survey results are out!"
            no-caps
            padding="12px lg"
            no-wrap
          )

        app-menu.q-mb-lg

    .absolute-top.header
      form(
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
      )
        q-input.full-width.app-search-input(
          ref="searchInputRef"
          v-model="searchTerms"
          dense
          square
          borderless
          debounce="300"
          @keydown="onSearchKeydown"
          @focus="onSearchFocus"
          @blur="onSearchBlur"
        )
          template(v-slot:prepend)
            q-icon(name="search")
          template(v-slot:append)
            q-icon.cursor-pointer(v-if="searchTerms" name="cancel" @click="onSearchClear")
            .row.items-center.no-wrap.no-pointer-events(v-else-if="!searchHasFocus")
              kbd.flex.flex-center /

      q-separator

  q-drawer(
    v-if="hasRightDrawer"
    side="right"
    v-model="rightDrawerState"
    show-if-above
    :width="220"
    @on-layout="updateRightDrawerOnLayout"
  )
    q-scroll-area.fit
      header-menu.q-mt-sm.text-primary.column(v-if="$q.screen.lt.sm", align="right")

      q-list.doc-toc.q-my-sm.text-grey-8
        q-item-label.text-uppercase.q-pl-md.q-pb-sm.text-grey-9(header v-if="tocList.length > 0").q-mb-xs Table of contents
        q-item(
          v-for="tocItem in tocList"
          :key="tocItem.id"
          clickable
          v-ripple
          dense
          @click="scrollTo(tocItem.id)",
          :active="activeToc === tocItem.id"
        )
          q-item-section(v-if="tocItem.sub === true", side) •
          q-item-section {{ tocItem.title }}

  q-page-container
    router-view

  q-page-scroller
    q-btn(fab-mini, color="primary", glossy, :icon="mdiChevronUp")
</template>

<script>
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'

import {
  mdiMenu, mdiClipboardText, mdiHeart, mdiMagnify, mdiChevronUp,
  mdiFileDocumentEditOutline
} from '@quasar/extras/mdi-v5'

import AppMenu from 'components/AppMenu.js'
import AppSearchResults from 'components/AppSearchResults.vue'
import HeaderMenu from 'components/HeaderMenu.vue'

import useToc from './doc-layout/use-toc'
import useDrawers from './doc-layout/use-drawers'
import useScroll from './doc-layout/use-scroll'
import useSearch from './doc-layout/use-search'

export default {
  name: 'DocLayout',

  components: {
    AppMenu,
    AppSearchResults,
    HeaderMenu
  },

  setup () {
    const $q = useQuasar()
    const $route = useRoute()

    const scope = {
      mdiMenu,
      mdiClipboardText,
      mdiHeart,
      mdiMagnify,
      mdiChevronUp,
      mdiFileDocumentEditOutline
    }

    useToc(scope, $route)
    useDrawers(scope, $q, $route)
    useScroll(scope, $route)
    useSearch(scope, $q, $route)

    return scope
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

.header-logo
  width: 25px
  height: 25px

.doc-layout__main-btn
  width: 268px

.doc-layout-avatar > div
  border-radius: 0

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

// keep the button on top of sticky in examples
.q-page-scroller > .q-page-sticky
  z-index: 1

.doc-layout
  .countdown
    .heading
      font-size: 18px
    .time
      font-size: 38px
</style>
