<template>
  <div class="doc-page__content">
    <div v-if="props.overline" class="doc-page__overline text-brand-primary">{{
      props.overline
    }}</div>

    <div class="doc-page__title" v-if="props.heading">
      <h1 class="doc-heading doc-h1" id="introduction">
        {{ props.title }}
        <q-badge v-if="props.badge" :label="props.badge" />
      </h1>

      <q-btn
        v-if="props.editLink"
        class="doc-page__title-edit"
        :href="editHref"
        target="_blank"
        rel="noopener noreferrer"
        flat
        round
        color="brand-primary"
        :icon="mdiPencil"
        aria-label="Edit this page in browser"
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
          <div
            class="doc-page__nav-name text-weight-bold row items-center no-wrap"
          >
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
        <DocLink class="q-ml-xs" :to="editHref"
          >Edit this page in browser</DocLink
        >
      </div>
    </div>
  </div>

  <nav
    class="doc-page__toc-container col-grow row justify-center gt-sm"
    :class="tocClass"
    aria-label="Table of contents"
  >
    <q-scroll-area class="doc-page__toc-area">
      <DocPageToc />
    </q-scroll-area>
  </nav>
</template>

<script setup>
import { Notify, useMeta } from 'quasar'
import { computed, onMounted, onUnmounted } from 'vue'

import { mdiFlash, mdiLaunch, mdiPencil } from '@quasar/extras/mdi-v7'

import DocLink from '@/components/DocLink.vue'
import DocPageToc from './DocPageToc.vue'

import getMeta from '@/assets/get-meta.js'
import { useDocStore } from './store/index.js'

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

  // dev only, from the markdown pipeline - see the reporting below
  idIssues: Array
})

/**
 * The ids this page renders twice. Nothing is drawn into the page for them:
 * the article has to stay the one production serves, or every sweep reading
 * it in dev - axe, the SSR hydration run, a screenshot - is reading markup no
 * reader will ever get. So the list goes to the console, and one toast points
 * at the console, from outside the article.
 *
 * The prop only exists in a dev build, and this whole block goes with it.
 */
if (import.meta.env.QUASAR_DEV) {
  let dismiss = null

  onMounted(() => {
    if (props.idIssues === void 0) return

    // same tag and same shape as the dev server's terminal lines, with the
    // route standing in for the file, so one grep finds either
    for (const issue of props.idIssues) {
      console.error(`[page-ids] ${location.pathname} - ${issue}`)
    }

    const count = props.idIssues.length

    dismiss = Notify.create({
      message: `${count} colliding DOM id${count === 1 ? '' : 's'} on this page`,
      caption:
        'Anchors, search results and the browser hash for the second one all' +
        ' land on the first. The list is in the console.',
      multiline: true,
      color: 'negative',
      position: 'bottom-right',
      timeout: 0,
      // this component owns the toast for as long as the page is on screen,
      // so grouping is not what keeps it to one - unmounting is
      group: false,
      actions: [{ label: 'Dismiss', color: 'white' }]
    })
  })

  // leaving the page, or saving it and having it reload, takes the toast with
  // it: the next mount is what puts up the next one
  onUnmounted(() => {
    dismiss?.()
    dismiss = null
  })
}

useMeta(
  props.desc !== void 0
    ? {
        title: props.title,
        meta: getMeta(props.title + ' | Quasar Framework', props.desc)
      }
    : { title: props.title }
)

const docStore = useDocStore()
docStore.setToc(props.toc)

const editHref = computed(
  () =>
    `https://github.com/quasarframework/quasar/edit/${import.meta.env.DOCS_BRANCH}/docs/src/pages/${props.editLink}.md`
)

const tocClass = computed(
  () => `doc-page__toc-container--${props.toc !== void 0 ? 'fixed' : 'flowing'}`
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

  // The page title and the link to edit the page share one line. The link
  // has to stay outside the <h1>, because a heading is named by what it
  // contains and its label was ending up in every page's title. Sizing the
  // title here rather than on the heading keeps the two facts that follow
  // from each other together: the space below the title is 1em of it, and
  // the heading is free of margins that would otherwise make it the
  // tallest thing on the line and knock it off centre.
  &__title
    display: flex
    align-items: center
    flex-wrap: nowrap
    font-size: $doc-title-font-size
    // beats the 22px every other div of page content gets: this block is
    // the title, and its spacing scales with the title
    margin-bottom: 1em !important

    @media (max-width: 850px)
      font-size: $doc-title-font-size--narrow

  &__title-edit
    align-self: flex-start
    margin-left: auto

  &__overline
    letter-spacing: $letter-spacing-brand
    margin-bottom: 0 !important

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
