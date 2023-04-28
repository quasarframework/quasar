<template>
  <div class="app-search relative-position">
    <div class="app-search__instructions flex flex-center">
      <span>Navigate</span>
      <kbd class="q-ml-sm"><q-icon :name="mdiArrowDownBold" /></kbd>
      <kbd class="q-mr-sm"><q-icon :name="mdiArrowUpBold" /></kbd>

      <span>Select</span>
      <kbd class="q-mx-sm"><q-icon :name="mdiKeyboardReturn" /></kbd>

      <span>Close/Reset</span>
      <kbd class="q-ml-sm"><q-icon :name="mdiKeyboardEsc" /></kbd>
    </div>

    <q-list padding>
      <result-entry
        v-for="entry in props.results.entries"
        :key="entry.id"
        :entry="entry"
        :active="entry.id === props.searchActiveId"
      />
    </q-list>
  </div>
</template>

<script setup>
import { mdiArrowUpBold, mdiArrowDownBold, mdiKeyboardReturn, mdiKeyboardEsc } from '@quasar/extras/mdi-v6'

import ResultEntry from './ResultEntry.vue'

const props = defineProps({
  results: Object,
  searchActiveId: String
})
</script>

<style lang="sass">
.app-search
  padding: 0 12px 4px

  &__instructions
    margin: 0 -12px // reset container padding
    padding: 12px 8px
    transition: opacity $header-quick-transition
    min-height: 38px
    background: #fff
    border-bottom: 1px solid $separator-color
    position: sticky
    top: 0
    z-index: 1

    span
      font-size: ($font-size - 2px)
    kbd
      color: #000

    &--hidden
      opacity: 0

  &__result
    padding: 8px
    border: 1px solid $separator-color
    border-radius: $generic-border-radius
    font-size: ($font-size - 2px)

    & + &
      margin-top: 6px !important

    kbd
      margin: 0 0 0 3px
      font-size: $font-size

    &-title
      color: $brand-primary
      word-break: break-word
      .doc-token
        font-size: ($font-size - 2px)
        font-weight: 700
        letter-spacing: $letter-spacing-brand
        border-radius: $generic-border-radius

    &-content
      padding-top: 8px
      line-height: 1.3em

    &-token
      color: $brand-accent
      font-weight: 700

    &--active
      background: $brand-primary !important

      &,
      .app-search__result-title,
      .app-search__result-token,
      .doc-token
        color: #fff !important

      .doc-token
        border-color: #fff !important

body.mobile .app-search__instructions
  display: none

body.body--dark .app-search
  &__instructions
    background: $dark-bg
  &__instructions,
  &__result
    border-color: $separator-dark-color

  &__result--active
    border-color: $brand-accent !important
    background: rgba($brand-accent, .2) !important

    .app-search__result-token
      color: $brand-accent !important
</style>
