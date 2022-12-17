<template>
  <div key="content" class="doc-page__content">
    <q-badge
      key="overline"
      v-if="overline"
      class="doc-page__overline"
      :label="overline"
    />

    <div key="heading" class="doc-h1 row items-start no-wrap" v-if="props.heading">
      <div class="col doc-heading" id="introduction" @click="copyIntroductionHeading">
        <span>{{ title }}</span>
        <q-badge class="q-ml-sm doc-page__badge" v-if="props.badge" :label="props.badge" />
      </div>
      <a class="doc-page__top-link text-brand-primary flex flex-center" v-if="props.editLink" :href="editHref" target="_blank" rel="noopener noreferrer">
        <q-icon :name="mdiPencil" />
        <q-tooltip
          class="row no-wrap items-center"
          anchor="center left"
          self="center right"
          transition-show="jump-left"
          transition-hide="jump-right"
        >
          <span>Caught a mistake? Edit page in browser</span>
          <q-icon class="q-ml-xs" :name="mdiFlash" size="2em" />
        </q-tooltip>
      </a>
    </div>

    <div key="related" class="doc-page__nav" v-if="props.related">
      <div class="q-gutter-md flex">
        <router-link
          class="q-link doc-page__related rounded-borders q-pa-md cursor-pointer column justify-center"
          v-for="link in props.related"
          :key="link.category + link.path"
          :to="link.path"
        >
          <div class="row no-wrap items-center">
            <div class="col">
              <div class="doc-page__nav-categ text-uppercase">{{ link.category || 'Docs' }}</div>
              <div class="doc-page__nav-name text-weight-bold">{{ link.name }}</div>
            </div>

            <q-icon class="q-ml-lg" :name="mdiLaunch" />
          </div>
        </router-link>
      </div>
    </div>

    <slot />

    <div key="nav" class="doc-page__nav doc-page__nav--footer" v-if="props.nav">
      <div class="text-h6 q-pb-md">Ready for more?</div>
      <div class="q-gutter-md flex">
        <router-link
          class="q-link doc-page__related rounded-borders q-pa-md cursor-pointer column justify-center"
          v-for="link in props.nav"
          :key="link.category + link.path"
          :to="link.path"
        >
          <div class="row no-wrap items-center">
            <q-icon
              :name="link.dir === 'left' ? mdiChevronLeft : mdiChevronRight"
              v-if="link.dir !== void 0"
              :class="link.dir === 'right' ? 'order-last q-ml-md' : 'order-first q-mr-md'"
            />

            <div class="col">
              <div class="doc-page__nav-categ text-uppercase">{{ link.category || 'Docs' }}</div>
              <div class="doc-page__nav-name text-weight-bold">{{ link.name }}</div>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <div key="footer" class="doc-page__content-footer" v-if="props.editLink">
      <q-separator class="q-mb-sm" />

      <div class="q-mb-md">
        <span>Caught a mistake?</span>
        <doc-link class="q-ml-xs" :to="editHref">Edit this page in browser</doc-link>
      </div>
    </div>
  </div>

  <q-scroll-area key="toc" class="doc-page__toc-container gt-sm" :class="tocClass">
    <doc-page-toc />
  </q-scroll-area>
</template>

<script setup>
import { useMeta } from 'quasar'
import { computed } from 'vue'

import {
  mdiPencil, mdiLaunch,
  mdiChevronLeft, mdiChevronRight,
  mdiFlash
} from '@quasar/extras/mdi-v6'

import DocPageToc from './DocPageToc.vue'

import { copyHeading } from 'assets/page-utils'
import getMeta from 'assets/get-meta'
import { useDocStore } from './store'

const props = defineProps({
  title: String,
  desc: String,
  overline: String,
  badge: String,

  heading: Boolean,
  editLink: String,

  toc: Array,
  related: Array,
  nav: Array,

  scope: Object
})

useMeta(
  props.desc !== void 0
    ? { title: props.title, meta: getMeta(props.title + ' | Quasar Framework', props.desc) }
    : { title: props.title }
)

const docStore = useDocStore()

docStore.setToc(props.toc)

const editHref = computed(() =>
  `https://github.com/quasarframework/quasar/edit/dev/docs/src/pages/${props.editLink}.md`
)

const tocClass = computed(() =>
  `doc-page__toc-container--${ props.toc !== void 0 ? 'fixed' : 'flowing' }`
)

function copyIntroductionHeading () {
  copyHeading('introduction')
}
</script>

<style lang="sass">
.doc-page
  &__toc-container
    position: sticky
    top: $headerHeight
    height: calc(100vh - #{$headerHeight})

    &--fixed
      min-width: 300px
      width: 300px
    &--flowing
      // just leave it as-is

  &-toc
    padding: 32px 16px 32px 0 // page top padding

  &__content-footer
    margin-top: 64px

  &__overline
    margin-bottom: 0 !important
    & + .doc-h1
      padding-top: .4rem !important

  &__top-link
    color: inherit
    text-decoration: none
    outline: 0

  &__badge
    vertical-align: super

  &__related
    transition: color .28s
    &:hover
      color: $brand-primary !important

  &__nav
    &--footer
      margin: 68px 0 0
      margin-bottom: 0 !important

    & + &
      margin-top: 0

    .q-icon
      font-size: 1.75em

    &-categ
      font-size: .8em
    &-name
      font-size: 1em

body.body--light .doc-page
  &__overline
    color: $grey-10
    background: $grey-3
    border: 1px solid $separator-color
  &__badge
    color: #fff
    background: $brand-primary
    border-color: none
  &__nav
    color: $brand-primary
  &__related
    color: $grey-9
    background: $grey-3
    border: 1px solid $separator-color

body.body--dark .doc-page
  &__overline
    color: $brand-primary
    background: $dark-pill
    border: 1px solid $brand-primary
  &__badge
    color: $light-text
    background: $brand-primary
  &__nav
    color: $brand-primary
  &__related
    color: $dark-text
    background: $dark-pill
    border: 1px solid $brand-primary
</style>
