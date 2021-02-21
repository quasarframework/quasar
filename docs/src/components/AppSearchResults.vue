<template lang="pug">
.app-search
  .app-search__instructions.flex.flex-center(v-if="searchHasFocus" key="instr-focused")
    span Navigate
    kbd.q-ml-sm
      q-icon(:name="down")
    kbd.q-mr-sm
      q-icon(:name="up")
    span Select
    kbd.q-mx-sm
      q-icon(:name="select")
    span Close
    kbd.q-ml-sm
      q-icon(:name="close")
  .app-search__instructions.flex.flex-center(v-else key="instr-unfocused")
    span Type
    kbd.q-mx-sm.q-px-sm /
    span to focus on searchbox

  .app-search__section(
    v-for="categ in results.categories"
    :key="`categ_${categ}`"
  )
    .app-search__section-title.text-subtitle1 {{ categ }}

    component(
      v-for="entry in results.data[categ]"
      :key="entry.id"
      :is="entry.component"
      :entry="entry"
      :active="entry.id === searchActiveId"
    )
      .app-search__result-overlay.flex.flex-center.absolute-right(v-if="entry.id === searchActiveId")
        kbd
          q-icon(:name="select")

</template>

<script>
import { computed } from 'vue'
import { mdiArrowUpBold, mdiArrowDownBold, mdiKeyboardReturn, mdiKeyboardEsc } from '@quasar/extras/mdi-v5'

import ResultPageContent from 'components/search-results/ResultPageContent'
import ResultPageLink from 'components/search-results/ResultPageLink'

export const apiTypeToComponentMap = {
  'page-content': ResultPageContent,
  'page-link': ResultPageLink
}

export default {
  name: 'AppSearchResults',

  components: {
    ResultPageContent,
    ResultPageLink
  },

  props: {
    results: Object,
    searchHasFocus: Boolean,
    searchActiveId: String
  },

  setup (props) {
    const instructionsClass = computed(() =>
      `app-search__instructions--${props.searchHasFocus === true ? 'visible' : 'hidden'}`
    )

    return {
      instructionsClass,

      up: mdiArrowUpBold,
      down: mdiArrowDownBold,
      select: mdiKeyboardReturn,
      close: mdiKeyboardEsc
    }
  }
}
</script>

<style lang="sass">
.app-search

  &__instructions
    padding: 8px
    transition: opacity .28s
    min-height: 38px

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
    padding: 4px 0 4px 16px
    font-weight: 500
    color: $primary

  &__result
    margin: 4px 16px 4px 0
    padding: 8px 8px 8px 16px
    border: 1px solid rgba(0, 0, 0, 0.12)
    border-right: 4px solid $primary
    border-radius: 0 4px 4px 0
    position: relative
    cursor: pointer

    &-overlay
      color: #fff
      right: 4px
      font-size: 22px
      div
        width: 1.2em
        height: 1.2em
        background: #fff
        color: $primary
        border-radius: 4px

    &-title
      padding-bottom: 4px
      font-size: .8em
    &-title, &-fade
      color: $grey

    &-content
      font-size: .9em
      font-weight: 400
      line-height: 1.2em

      &--token
        background-color: scale-color($positive, $lightness: 60%)
        border-radius: 4px
        padding: 0 2px
        color: #000

  &__result.q-item--active
    background: $primary
    color: #fff

    .app-search__result-title, .app-search__result-fade
      color: #ddd

body.mobile .app-search__instructions
  display: none
</style>
