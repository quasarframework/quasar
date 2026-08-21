<template>
  <div class="page-all fit column doc-brand">
    <DocStars />

    <div
      class="page-all__search q-py-md q-px-xl q-pa-md row no-wrap items-center justify-center"
    >
      <div
        class="page-all__search-field rounded-borders row items-center no-wrap q-pl-sm q-pr-xs"
        @click.prevent="onSearchFieldClick"
      >
        <input
          ref="inputRef"
          type="search"
          name="listing-search"
          class="page-all__search-input text-white letter-spacing-225"
          v-model="searchTerms"
          placeholder="Search item"
          aria-label="Search components, directives and plugins"
        />
        <q-icon
          v-if="!searchTerms"
          name="search"
          size="24px"
          color="brand-primary"
        />
        <q-btn
          v-else
          flat
          dense
          round
          icon="clear"
          size="sm"
          color="brand-primary"
          aria-label="Clear search"
          @click.stop="clearSearchTerms"
        />
      </div>

      <div class="row justify-start q-ml-xl gt-sm">
        <q-chip
          v-for="(chip, chipIndex) in filterChips"
          :key="chipIndex"
          :label="chip.label"
          :color="chipColor[chipIndex]"
          clickable
          text-color="white"
          @click="chip.onClick"
        />
      </div>
    </div>

    <div
      v-if="noResultsLabel"
      class="col flex flex-center text-size-20 letter-spacing-225 q-pa-xl"
      >{{ noResultsLabel }}</div
    >

    <div
      v-else
      class="q-py-xl text-size-14 row items-center justify-center q-gutter-lg relative-position"
    >
      <transition-group name="page-all-transition">
        <DocCardLink
          v-for="entry in searchResults"
          :key="entry.key"
          :to="entry.to"
        >
          <q-card
            class="page-all__card bg-white shadow-bottom-large cursor-pointer overflow-hidden letter-spacing-300"
          >
            <div class="page-all__card-img">
              <q-img v-if="entry.img" :src="entry.img" />
            </div>
            <q-card-section
              class="text-size-14 text-brand-primary text-weight-bold"
            >
              {{ entry.name }}
            </q-card-section>
            <q-card-section
              class="text-size-12 page-all__card-description text-dark q-pt-none"
            >
              {{ entry.description }}
            </q-card-section>
          </q-card>
        </DocCardLink>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, useTemplateRef, watch } from 'vue'
import { useRoute } from 'vue-router'

import { quasarElements } from '@/assets/links.components.js'

import DocStars from '@/components/DocStars.vue'
import DocCardLink from '@/components/DocCardLink.vue'

const filterChips = [
  { label: 'Buttons', value: 'button' },
  { label: 'Inputs', value: 'input' },
  { label: 'Loading', value: 'loading' },
  { label: 'Media', value: 'media' },
  { label: 'Navigation', value: 'navigation' },
  { label: 'Panels & Popups', value: 'panel' },
  { label: 'Scroll', value: 'scroll' },
  { label: 'Tables', value: 'table' },
  { label: 'Other Components', value: 'other' },
  {
    label: 'All Components',
    value: 'vue-components',
    category: 'vue-components'
  },
  { label: 'Directives', value: 'directive', category: 'vue-directives' },
  { label: 'Plugins', value: 'plugin', category: 'quasar-plugins' },
  { label: 'Composables', value: 'composable', category: 'vue-composables' },
  { label: 'Utils', value: 'util', category: 'quasar-utils' }
].map((entry, index) => ({
  ...entry,
  onClick: () => {
    setFilterTag(entry.value, index)
  }
}))

const chipColor = ref(filterChips.map(_ => 'brand-primary'))

const inputRef = useTemplateRef('inputRef')
const filterTag = ref(null)

const searchTerms = ref('')
const searchResults = ref(quasarElements)
const noResultsLabel = ref(false)

let lastIndex = null

function setFilterTag(filterChipValue, index) {
  const tag = filterTag.value

  if (tag !== null && tag !== filterChipValue && lastIndex !== null) {
    chipColor.value[lastIndex] = 'brand-primary'
  }

  lastIndex = index

  // if the filter tag is the same as the one we are trying to set, then we reset the filter tag
  if (tag === filterChipValue) {
    filterTag.value = null
    chipColor.value[index] = 'brand-primary'
  } else {
    filterTag.value = filterChipValue
    chipColor.value[index] = 'brand-accent'
  }
}

const route = useRoute()
const initialCategory = route.query.initial || null
if (
  initialCategory &&
  filterChips.some(entry => entry.category === initialCategory)
) {
  const chipIndex = filterChips.findIndex(
    entry => entry.category === initialCategory
  )
  if (chipIndex !== -1) {
    setFilterTag(filterChips[chipIndex].value, chipIndex)
    filterResults()
  }
}

function filterResults() {
  const terms = searchTerms.value.trim().toLowerCase()
  const tag = filterTag.value

  if (terms === '' && tag === null) {
    searchResults.value = quasarElements
    return
  }

  // allow to search for direct components name (example: qbtn)
  const needle =
    terms.length !== 1 && terms.startsWith('q') ? terms.slice(1) : terms

  const results = quasarElements.filter(
    entry =>
      (tag === null || entry.tag === tag || entry.category === tag) &&
      (needle === '' || entry.haystack.includes(needle))
  )

  if (results.length === 0) {
    const tagLabel =
      tag !== null ? filterChips.find(entry => entry.value === tag).label : null

    noResultsLabel.value = `Nothing matches ${tagLabel !== null ? `the "${tagLabel}" tag and ` : ''}"${terms}" search terms.`
  } else {
    noResultsLabel.value = false
  }

  searchResults.value = results
}

let searchTimer
watch([searchTerms, filterTag], () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(filterResults, 300)
})

function clearSearchTerms() {
  searchTerms.value = ''
}

function onSearchFieldClick() {
  inputRef.value.focus()
}
</script>

<style lang="sass">
.page-all
  &__search
    position: sticky
    top: $header-height
    z-index: 1
    background: rgba($dark-bg, .7)
    backdrop-filter: blur(5px)
    -webkit-backdrop-filter: blur(5px)

  &__search-field
    border: 1px solid $brand-primary
    border-radius: $generic-border-radius
    height: 40px
    cursor: text
    transition: box-shadow $header-quick-transition

    &:focus-within
      box-shadow: 0 3px 6px 3px rgba($brand-primary, 0.38)

  &__search-input
    font-size: 14px
    border: 0
    outline: 0
    background: none

  &__card
    width: 300px
    height: 289px
    transition: transform $header-quick-transition, box-shadow $header-quick-transition

    &:hover
      box-shadow: 0 24px 24px 0 rgba(0, 180, 255, 0.4)
      transform: scale(1.03)

  &__card-img
    height: 170px
    background-color: $floating-rock

.page-all-transition
  &-move,
  &-enter-active,
  &-leave-active
    transition: all .5s cubic-bezier(0.55, 0, 0.1, 1)

  &-enter-from,
  &-leave-to
    opacity: 0
    transform: scaleY(0.01) translate(30px, 0)

  &-leave-active
    position: absolute
</style>
