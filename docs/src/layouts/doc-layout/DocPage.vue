<template>
  <div class="doc-page__content">
    <div v-if="props.overline" class="doc-page__overline text-brand-primary">{{ props.overline }}</div>

    <div class="doc-h1 row items-center no-wrap" v-if="props.heading">
      <div class="doc-heading q-mr-xs" id="introduction">
        <span>{{ props.title }}</span>
        <q-badge class="q-ml-sm doc-page__badge" v-if="props.badge" :label="props.badge" />
      </div>
      <q-space />
      <q-btn
        v-if="props.editLink"
        class="self-start"
        :href="editHref" target="_blank" rel="noopener noreferrer"
        flat
        round
        color="brand-primary"
        :icon="mdiPencil"
      >
        <q-tooltip class="row no-wrap items-center">
          <span>Caught a mistake? Edit page in browser</span>
          <q-icon class="q-ml-xs" :name="mdiFlash" size="2em" />
        </q-tooltip>
      </q-btn>
    </div>

    <div class="doc-page__nav" v-if="props.related">
      <div class="q-gutter-sm flex">
        <router-link
          class="q-link doc-page__related rounded-borders q-px-md q-py-md cursor-pointer column justify-center"
          v-for="link in props.related"
          :key="link.category + link.path"
          :to="link.path"
        >
          <div class="row no-wrap items-center">
            <div class="col">
              <div class="doc-page__nav-categ text-uppercase">{{ link.category || 'Docs' }}</div>
              <div class="doc-page__nav-name text-weight-bold">{{ link.name }}</div>
            </div>

            <q-icon class="q-ml-md" :name="mdiLaunch" />
          </div>
        </router-link>
      </div>
    </div>

    <slot />

    <div class="doc-page__nav doc-page__nav--footer" v-if="props.nav">
      <div class="text-h6 q-pb-md">Ready for more?</div>
      <div class="q-gutter-sm flex">
        <router-link
          class="q-link doc-page__related rounded-borders q-px-md q-py-md cursor-pointer column justify-center"
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

    <div class="doc-page__content-footer" v-if="props.editLink">
      <q-separator class="q-mb-sm" />

      <div class="q-mb-md">
        <span>Caught a mistake?</span>
        <doc-link class="q-ml-xs" :to="editHref">Edit this page in browser</doc-link>
      </div>
    </div>
  </div>

  <q-scroll-area class="doc-page__toc-container gt-sm" :class="tocClass">
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

import DocLink from 'src/components/DocLink.vue'
import DocPageToc from './DocPageToc.vue'

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
  `https://github.com/quasarframework/quasar/edit/${ process.env.DOCS_BRANCH }/docs/src/pages/${ props.editLink }.md`
)

const tocClass = computed(() =>
  `doc-page__toc-container--${ props.toc !== void 0 ? 'fixed' : 'flowing' }`
)
</script>

<style lang="sass">
.doc-page
  &__content
    padding: 80px 42px

    @media (max-width: 1300px)
      padding: 32px
    @media (max-width: 850px)
      padding: 32px 16px

    > p
      line-height: 28px

    > .q-btn
      background: $brand-accent
      color: #fff
      font-weight: bold
      font-size: $font-size
      letter-spacing: $letter-spacing-brand
      padding: 8px 16px
      text-transform: none
      .on-right
        margin-left: 8px
      .on-left
        margin-right: 8px

  &__toc-container
    position: sticky
    top: $header-height
    height: calc(100vh - #{$header-height})
    font-size: ($font-size - 2px)

    .doc-page-toc
      padding: 32px 16px 32px 0 // page top padding

    &--fixed
      min-width: 300px
      width: 300px
    &--flowing
      // just leave it as-is

  &__content-footer
    margin-top: 64px

  &__overline
    letter-spacing: $letter-spacing-brand
    margin-bottom: 0 !important
    & + .doc-h1
      margin-top: 0 !important
      padding-top: 0 !important

  &__related
    transition: color $header-transition
    word-break: break-word
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
      letter-spacing: $letter-spacing-brand

body.body--light .doc-page
  &__nav
    color: $brand-primary
  &__related
    color: $dark
    background: $void-suit
    border: 1px solid $separator-color
  &__toc-container .q-item
    color: $header-btn-color--light
    &:hover
      color: $header-btn-hover-color--light

body.body--dark .doc-page
  &__nav
    color: $brand-primary
  &__related
    color: $dark-text
    background: $dark-pill
    border: 1px solid $brand-primary
  &__toc-container .q-item
    color: $header-btn-color--dark
    &:not(.disabled):hover
      color: $header-btn-hover-color--dark
</style>
