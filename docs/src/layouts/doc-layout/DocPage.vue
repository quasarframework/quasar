<template>
  <div class="doc-page__content">
    <div v-if="props.overline" class="doc-page__overline text-brand-primary">{{ props.overline }}</div>

    <div class="doc-h1 row items-center no-wrap" v-if="props.heading">
      <div class="doc-heading" id="introduction">
        <span>{{ props.title }}</span>
        <q-badge class="doc-page__badge" v-if="props.badge" :label="props.badge" />
      </div>
      <q-space />
      <q-btn
        v-if="props.editLink"
        class="self-start q-ml-sm"
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
          class="q-link doc-page__related rounded-borders cursor-pointer column justify-center"
          v-for="link in props.related"
          :key="link.category + link.path"
          :to="link.path"
        >
          <div class="doc-page__nav-categ">{{ link.category || 'Docs' }}</div>
          <div class="doc-page__nav-name text-weight-bold row items-center no-wrap">
            <div class="q-mr-xs">{{ link.name }}</div>
            <q-icon :name="mdiLaunch" />
          </div>
        </router-link>
      </div>
    </div>

    <slot />

    <div class="doc-page__nav doc-page__nav--footer" v-if="props.nav">
      <div class="text-h6 q-pb-md">Ready for more?</div>
      <div class="q-gutter-sm flex">
        <router-link
          v-for="link in props.nav"
          :key="link.category + link.path"
          :to="link.path"
          class="q-link doc-page__related rounded-borders cursor-pointer column justify-center"
          :class="link.classes"
        >
          <div class="doc-page__nav-categ">{{ link.category || 'Docs' }}</div>
          <div class="doc-page__nav-name text-weight-bold">{{ link.name }}</div>
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

  <div class="doc-page__toc-container col-grow row justify-center gt-sm" :class="tocClass">
    <q-scroll-area class="doc-page__toc-area">
      <doc-page-toc />
    </q-scroll-area>
  </div>
</template>

<script setup>
import { useMeta } from 'quasar'
import { computed } from 'vue'

import {
  mdiPencil,
  mdiFlash,
  mdiLaunch
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
    line-height: 1.5em

    @media (max-width: 1300px)
      padding: 32px
    @media (max-width: 850px)
      padding: 32px 16px

    > .q-btn
      background: $brand-accent
      color: #fff
      font-weight: 700
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

    &--fixed
      .doc-page__toc
        padding: 32px 16px 32px 0 // page top padding

  &__toc-container
    min-width: 300px !important
  &__toc-area
    width: 300px

  &__toc
    font-size: ($font-size - 2px)

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
    line-height: 1.4em
    padding: 16px 20px

    &:hover
      color: $brand-primary !important

    &--left
      justify-content: flex-start
      text-align: left
      .doc-page__nav-name:before
        content: '« '
        font-size: 1.2em

    &--right
      justify-content: flex-end
      text-align: right
      .doc-page__nav-name:after
        content: ' »'
        font-size: 1.2em

  &__nav
    color: $brand-primary

    &--footer
      margin: 68px 0 0
      margin-bottom: 0 !important

    & + &
      margin-top: 0

    &-categ
      font-size: .9em

    &-name
      letter-spacing: $letter-spacing-brand

body.body--light .doc-page
  &__related
    color: $light-text
    background: $void-suit
    border: 1px solid $void-suit // match dark to avoid page reflow

  &__toc-container .q-item
    color: $header-btn-color--light

body.body--dark .doc-page
  &__related
    color: $dark-text
    background: $dark-pill
    border: 1px solid $brand-primary

  &__nav-name
    color: $brand-primary

  &__toc-container .q-item
    color: $header-btn-color--dark
</style>
