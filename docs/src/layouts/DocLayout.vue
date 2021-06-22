<template lang="pug">
q-layout.doc-layout(view="lHh LpR lff", @scroll="onScroll")
  q-header.header.text-dark(bordered)
    q-toolbar.q-px-none
      q-btn.q-mx-sm.lt-md(flat, dense, round, @click="toggleLeftDrawer", aria-label="Menu", :icon="mdiMenu")

      q-btn.quasar-logo.text-bold(key="logo", flat, no-caps, no-wrap, stretch, to="/")
        img.quasar-logo__img(src="https://cdn.quasar.dev/logo-v2/svg/logo.svg")
        img.quasar-logo__logotype(src="https://cdn.quasar.dev/logo-v2/svg/logotype.svg")

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
      template(v-if="searchResults !== null")
        component(
          v-if="searchResults.masterComponent !== void 0"
          :is="searchResults.masterComponent"
        )
        app-search-results(
          v-else
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
            color="brand-primary"
            outline
            :icon="mdiHeart"
            label="Donate to Quasar"
            no-wrap
            no-caps
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
          placeholder="Search Quasar v2..."
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

  q-page-scroller
    q-btn(fab-mini, color="brand-primary", glossy, :icon="mdiChevronUp")
</template>

<script>
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'

import {
  mdiMenu, mdiClipboardText, mdiHeart, mdiMagnify, mdiChevronUp
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
      mdiChevronUp
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

.quasar-logo
  &__img
    transform: rotate(0deg)
    transition: transform .8s ease-in-out
    width: 38px
    height: 38px
    margin-right: 8px
    border-radius: 50%

  &:hover &__img
    transform: rotate(-360deg)

  &__logotype
    height: 19px
    vertical-align: middle

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
</style>
