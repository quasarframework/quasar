<template>
  <q-layout class="doc-layout" view="hHh LpR fff" @scroll="docStore.onPageScroll">
    <doc-header />

    <q-page-container>
      <q-page :class="pageClass" key="q-page">
        <router-view v-if="isFullscreen" key="page-fullscreen" />
        <div v-else :class="pageContentClass" key="page-standard">
          <q-scroll-area class="doc-layout__menu q-ml-md">
            <doc-page-menu />
          </q-scroll-area>
          <router-view />
        </div>

        <doc-page-footer />
      </q-page>
    </q-page-container>

    <q-page-scroller>
      <q-btn class="shadow-bottom-small" fab-mini color="brand-accent" :icon="mdiArrowUp" />
    </q-page-scroller>

    <q-no-ssr>
      <doc-drawer-menu />
      <doc-drawer-toc />
    </q-no-ssr>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { mdiArrowUp } from '@quasar/extras/mdi-v6'

import { provideDocStore } from './store'

import DocHeader from './DocHeader.vue'
import DocDrawerMenu from './DocDrawerMenu.vue'
import DocDrawerToc from './DocDrawerToc.vue'
import DocPageMenu from './DocPageMenu.js'
import DocPageFooter from './DocPageFooter.vue'

const docStore = provideDocStore()

const isFullscreen = computed(() => docStore.$route.meta.fullscreen === true)
const pageClass = computed(() => `doc-layout__page-el--${ isFullscreen.value === true ? 'fullscreen' : 'standard' }`)
const pageContentClass = computed(() =>
  'doc-layout__page row no-wrap ' +
  `doc-layout__page--${ docStore.$route.meta.fullwidth === true ? 'fullwidth' : 'standard' }`
)
</script>

<style lang="sass">
.doc-layout
  font-family: $font-family

  .q-page-container :target
    scroll-margin-top: $headerHeight

  // keep the button on top of sticky in examples
  .q-page-scroller > .q-page-sticky
    z-index: 1

  &__page

    &--standard
      /**
          16px  - left menu margin
        + 300px - left menu
        + 900px - page content
        + 300px - toc menu
       */
      max-width: min(100%, 1516px)

      .doc-page__content
        width: auto
        min-width: 0
        flex: 10000 1 0%
        max-width: 900px

        > div, > pre
          margin-bottom: 22px

    &--fullwidth

      .doc-page__content
        width: 100%

      .doc-page__toc
        display: none

  &__page-el--standard
    @media (min-width: 914px)
      display: flex
      flex-direction: column
      align-items: center

  &__menu
    position: sticky
    top: $headerHeight
    height: calc(100vh - #{$headerHeight})
    width: 300px
    min-width: 300px
    border-right: 1px solid $separator-color

    .doc-page-menu
      padding: 32px 16px 32px 0 // page top padding

  &__item.q-item,
  &__item .q-item
    font-size: $font-size
    letter-spacing: $letter-spacing
    letter-spacing: .7px
    border-radius: 10px
    margin-top: 2px
    min-height: 30px
    padding: 0 4px 0 6px
    color: $light-text
    .q-item__section
      padding-top: 2px
      padding-bottom: 2px
    &.q-item--dark
      color: $dark-text

  &__item .q-expansion-item > .q-expansion-item__container > .q-item .q-item__label
    padding-left: 8.5px

  &__item--active
    color: $brand-primary !important
    background: scale-color($primary, $lightness: 90%)
    &.q-item--dark
      background: scale-color($primary, $lightness: -50%)

@media (min-width: 1301px)
  .doc-layout__page
    width: 100%

@media (max-width: 1300px)
  .doc-layout__menu,
  .doc-page__toc-container--flowing
    // let's position them off-screen
    // instead of "display: none"
    // so that QScrollArea won't compute the size uselessly
    position: fixed
    left: -1000px
    top: 0

.doc-drawer
  // only show the shadow when the drawer is open
  .q-drawer:not(.q-layout--prevent-focus) &
    box-shadow: $shadow--primary

  &__header
    position: sticky
    top: 0
    z-index: 1
    background: linear-gradient(to bottom, #fff 0%, #fff 75%, transparent)

  &__title
    font-size: $font-size
    letter-spacing: $letter-spacing
    padding-left: 22px

body.body--dark
  .doc-layout__menu
    border-right-color: $brand-primary
  .doc-drawer__header
    background: linear-gradient(to bottom, $dark 0%, $dark 75%, transparent)
</style>
