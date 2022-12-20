<template>
  <div class="app-search relative-position">
    <div class="app-search__instructions flex flex-center">
      <span>Navigate</span>
      <kbd class="q-ml-sm"><q-icon :name="mdiArrowDownBold" /></kbd>
      <kbd class="q-mr-sm"><q-icon :name="mdiArrowUpBold" /></kbd>

      <span>Select</span>
      <kbd class="q-mx-sm"><q-icon :name="mdiKeyboardReturn" /></kbd>

      <span>Reset</span>
      <kbd class="q-ml-sm"><q-icon :name="mdiKeyboardEsc" /></kbd>
    </div>

    <q-list v-for="group in props.results.groupList" :key="`group_${group}`">
      <q-item-label class="app-search__section-title" header>{{ group }}</q-item-label>
      <result-entry
        v-for="entry in props.results.entries[ group ]"
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

// const instructionsClass = computed(() =>
//   `app-search__instructions--${props.searchHasFocus === true ? 'visible' : 'hidden'}`
// )
</script>

<style lang="sass">
.app-search
  padding: 0 12px 38px

  &__instructions
    padding: 12px 8px
    transition: opacity .28s
    min-height: 38px
    background: #fff
    border-bottom: 1px solid $separator-color
    position: sticky
    top: 0
    z-index: 1

    span
      font-size: .8em
      color: $grey
    kbd
      font-size: 1em
      color: #000

    &--hidden
      opacity: 0

  &__section
    margin: 4px 0

  &__section-title
    color: $brand-primary !important
    padding-left: 8px

  &__result
    padding: 4px 8px
    border: 1px solid $separator-color
    border-radius: $generic-border-radius
    font-size: 12px

    & + &
      margin-top: 6px !important

    &-icon
      padding: 0 8px 0 0
      width: 32px

    kbd
      margin: 0 0 0 3px
      font-size: 12px

    &-overlay
      padding-bottom: 4px
      font-size: .8em
      font-weight: bold
      opacity: .7

    &-main
      font-weight: 400
      line-height: 1.2em

    &-token
      color: $brand-accent

body.mobile .app-search__instructions
  display: none

body.body--light .app-search
  &__result
    background: $grey-1
body.body--dark .app-search
  &__instructions
    background: $dark-bg
  &__instructions,
  &__result
    border-color: $separator-dark-color
</style>
