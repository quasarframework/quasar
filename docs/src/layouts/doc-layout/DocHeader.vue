<template>
  <q-header class="doc-header" :height-hint="128">
    <q-toolbar class="doc-header__primary q-pl-lg q-pr-md no-wrap items-stretch">
      <router-link to="/" class="doc-header__logo flex flex-center cursor-pointer">
        <img
          class="doc-header__logo--full"
          :src="logo.full"
          alt="Quasar Logo"
          height="48"
          width="236"
        >
        <img
          class="doc-header__logo--small"
          :src="logo.small"
          alt="Quasar Logo"
          height="48"
          width="48"
        >
      </router-link>

      <doc-header-text-links
        class="doc-header__links col text-size-16 gt-700"
        :menu="primaryToolbarLinks"
        mq-prefix="gt"
        nav-class="text-uppercase text-size-16 letter-spacing-300"
      />

      <doc-search :logo="logo.small" />

      <div class="doc-header-icon-links q-ml-sm row no-wrap items-center">
        <q-btn
          type="a"
          flat
          round
          :icon="mdiCompare"
          :disable="cannotChangeTheme"
          @click="docStore.toggleDark"
        >
          <q-tooltip v-if="cannotChangeTheme">Changing Light/Dark mode will be available on other pages</q-tooltip>
        </q-btn>
      </div>
    </q-toolbar>

    <q-toolbar class="doc-header__secondary q-pl-lg q-pr-md no-wrap">
      <q-btn
        v-if="docStore.hasDrawer.value"
        class="doc-header__drawer-btn q-mr-sm"
        flat round
        icon="menu"
        @click="docStore.toggleDrawer"
      />

      <doc-header-text-links
        :menu="versionLinks"
        nav-class="text-size-12 letter-spacing-225 doc-header__version"
      />

      <div class="doc-header__links col row items-center q-ml-sm">
        <doc-header-text-links
          :menu="secondaryToolbarLinks"
          nav-class="text-size-12 letter-spacing-225"
          mq-prefix="gt"
        />
        <doc-header-text-links
          class="q-ml-sm"
          :menu="moreLinks"
          nav-class="text-size-12 letter-spacing-225 lt-1400"
          mq-prefix="lt"
        />
      </div>
      <doc-header-icon-links
        class="q-ml-sm gt-1400"
        :menu="socialLinks.children"
      />
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { computed } from 'vue'
import { mdiCompare } from '@quasar/extras/mdi-v6'

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
    full: `https://cdn.quasar.dev/logo-v2/svg/logo-horizontal${opt}.svg`,
    small: `https://cdn.quasar.dev/logo-v2/svg/logo${opt}.svg`
  }
})

const cannotChangeTheme = computed(() => docStore.$route.meta?.dark === true)
</script>

<style lang="sass">
.doc-header
  transition: color .28s, background-color .28s

  &__primary
    height: 72px

  &__secondary
    height: 56px

  .q-toolbar
    border-top: 1px solid
    &:last-child
      border-bottom: 1px solid

  &__logo
    border-right: 1px solid
    padding-right: 24px

  .q-btn:not(.disabled):hover
    color: $grey-9

  &__version
    color: #000
    border: 1px solid $brand-primary

  &__drawer-btn
    margin-left: -8px

  @media (max-width: 1059px)
    &__logo--full
      display: none

  @media (min-width: 1060px)
    &__logo--small
      display: none

  @media (max-width: 699px)
    .q-toolbar
      padding-left: 16px
      padding-right: 8px
    &__logo
      display: none
    .doc-search
      width: 100%
  @media (min-width: 700px)
    .doc-search
      margin-left: 8px
      .doc-search__logo
        display: none

  &__links
    justify-content: end
    @media (min-width: 1600px)
      justify-content: center

.doc-header-menu
  font-family: $font-family

  .q-item__label--header
    color: $brand-accent
    padding: 16px
    &:first-child
      padding-top: 8px
  .q-item__section--side .q-icon
    color: $brand-primary

.doc-header-text-links__item
  .q-icon
    margin-left: 0

body.body--light .doc-header
  color: #757575 !important
  background: #fff

  .q-toolbar,
  &__logo
    border-color: $separator-color

body.body--dark
  .doc-header
    color: #929397 !important
    background: #050a14
    box-shadow: $shadow--medium

    .q-toolbar,
    &__logo
      border-color: $brand-primary

    &__version,
    .q-btn:not(.disabled):hover
      color: #fff

  .doc-header-menu
    box-shadow: $spreaded-shadow

  .doc-header-icon-links
    color: $brand-primary

$mq-list: 475, 560, 700, 860, 970, 1060, 1130, 1190, 1290, 1400
@each $query in $mq-list
  @media (min-width: #{$query}px)
    .lt-#{$query}
      display: none

  @media (max-width: #{$query - 1}px)
    .gt-#{$query}
      display: none
</style>
