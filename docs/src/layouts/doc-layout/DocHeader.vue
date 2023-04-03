<template>
  <q-header class="doc-header header-toolbar doc-brand" bordered :height-hint="128">
    <q-toolbar class="doc-header__primary q-pl-lg q-pr-md no-wrap items-stretch">
      <router-link to="/" class="doc-header__logo row items-center no-wrap cursor-pointer">
        <img
          class="doc-header__logo-img"
          :src="logo.img"
          alt="Quasar Logo"
          width="48"
          height="48"
        >
        <img
          class="doc-header__logo-text q-ml-md"
          :src="logo.text"
          alt="Quasar Logo"
          width="150"
          height="20"
        >
      </router-link>

      <div class="doc-header__primary-left-spacer gt-lg" />

      <doc-header-text-links
        class="doc-header__links col text-size-16 gt-700"
        :menu="primaryToolbarLinks"
        mq-prefix="gt"
        nav-class="text-uppercase text-size-16 letter-spacing-300"
      />

      <doc-search />

      <div v-if="showThemeChanger" class="doc-header-icon-links q-ml-sm row no-wrap items-center">
        <q-btn
          class="header-btn"
          type="a"
          flat
          round
          :icon="mdiCompare"
          @click="docStore.toggleDark"
        />
      </div>
    </q-toolbar>

    <q-toolbar class="doc-header__secondary q-pl-lg q-pr-md no-wrap">
      <q-btn
        class="header-btn doc-header__leftmost q-mr-xs lt-1300"
        flat round
        icon="menu"
        @click="docStore.toggleMenuDrawer"
      />

      <div class="doc-header__secondary-left-spacer gt-lg" />

      <div class="doc-header__links col row items-center no-wrap">
        <doc-header-text-links
          :menu="secondaryToolbarLinks"
          nav-class="text-size-14 letter-spacing-100"
          mq-prefix="gt"
        />
        <doc-header-text-links
          :menu="moreLinks"
          nav-class="text-size-14 letter-spacing-100 lt-1400"
          mq-prefix="lt"
        />
      </div>

      <doc-header-icon-links
        class="gt-1310"
        :menu="socialLinks.children"
      />

      <doc-header-text-links
        :menu="versionLinks"
        nav-class="text-size-14 letter-spacing-100 doc-header__version q-ml-sm"
      />

      <div v-if="hasToc" class="doc-header-icon-links q-ml-sm lt-md row no-wrap items-center">
        <q-btn
          class="header-btn"
          flat
          round
          :icon="mdiFolderPound"
          @click="docStore.toggleTocDrawer"
        />
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { computed } from 'vue'
import { mdiCompare, mdiFolderPound } from '@quasar/extras/mdi-v6'

import { versionLinks, primaryToolbarLinks, secondaryToolbarLinks, moreLinks } from 'src/assets/links.header'
import { socialLinks } from 'src/assets/links.social'

import DocSearch from './DocSearch.vue'
import DocHeaderTextLinks from './DocHeaderTextLinks.vue'
import DocHeaderIconLinks from './DocHeaderIconLinks.vue'

import { useDocStore } from './store'
const docStore = useDocStore()

const logo = computed(() => {
  const opt = docStore.$q.dark.isActive === true ? '-dark' : ''
  return {
    img: `https://cdn.quasar.dev/logo-v2/svg/logo${opt}.svg`,
    text: `https://cdn.quasar.dev/logo-v2/svg/logotype${opt}.svg`
  }
})

const showThemeChanger = computed(() => docStore.$route.meta.dark !== true)
const hasToc = computed(() => docStore.$route.meta.fullwidth !== true && docStore.$route.meta.fullscreen !== true && docStore.state.value.toc.length !== 0)
</script>

<style lang="sass">
.doc-header
  transition: none

  &__primary
    height: 72px
    border-bottom: 1px solid $separator-color

  &__secondary
    height: 55px

  &__logo-img
    transform: rotate(0deg)
    transition: transform .8s ease-in-out

  &__logo
    padding-right: 24px

    &:hover .doc-header__logo-img
      transform: rotate(-360deg)

  &__version
    color: #000
    border: 1px solid $brand-primary
    transition: none
    .q-focus-helper
      color: $brand-primary

  &__leftmost
    margin-left: -8px

  /**
    Spacers are used to align the links dead center
   */
  &__primary-left-spacer
    width: 198px
  &__secondary-left-spacer
    width: 296px

  @media (max-width: 320px)
    .q-btn
      font-size: 12px
    .q-btn--rectangle
      padding: 8px 2px 8px 10px !important

  @media (max-width: 1059px)
    &__logo-text
      display: none

  @media (max-width: 699px)
    .q-toolbar
      padding-left: 16px
      padding-right: 8px
    &__logo
      padding-right: 16px
    .doc-search
      width: 100%
  @media (min-width: 700px)
    .doc-search
      margin-left: 8px
      .doc-search__logo
        display: none

  &__links
    justify-content: end
    @media (min-width: 1921px)
      justify-content: center

.doc-header-menu
  letter-spacing: $letter-spacing-brand
  border: 1px solid $separator-color
  font-size: ($font-size - 2px)
  box-shadow: none !important
  background-color: #fff

  .q-item
    height: 36px

  .q-item__label--header
    color: $brand-accent
    padding: 16px
    &:first-child
      padding-top: 8px
  .q-item__section--side .q-icon
    color: $brand-primary

  &__arrow
    margin-right: -8px

.doc-header-text-links__item
  .q-icon
    margin-left: 0

body.body--dark
  .doc-header__primary
    border-bottom-color: $separator-dark-color
  .doc-header-menu
    background: $dark-bg
    border-color: $separator-dark-color

  .doc-header
    &__version
      color: #fff

  .doc-header-icon-links
    color: $brand-primary

$mq-list: 510, 600, 750, 860, 910, 1000, 1060, 1130, 1190, 1300 /* drawer */, 1310, 1400
@each $query in $mq-list
  @media (min-width: #{$query}px)
    .lt-#{$query}
      display: none

  @media (max-width: #{$query - 1}px)
    .gt-#{$query}
      display: none
</style>
