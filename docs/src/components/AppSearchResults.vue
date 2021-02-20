<template lang="pug">
.app-search
  .app-search__instructions.flex.flex-center
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

  .app-search__section(
    v-for="categ in results.categories"
    :key="`categ_${categ}`"
  )
    .app-search__section-title.text-subtitle1 {{ categ }}

    q-item.app-search__result(
      v-for="entry in results.data[categ]"
      :key="`entry_${entry.id}`"
      clickable
      @click="entry.onClick"
    )
      q-item-section
        .app-search__result-title {{ entry.title }}
        .app-search__result-content
          span(
            v-for="(item, index) in entry.content"
            :key="index"
            :class="item.class"
          ) {{ item.str }}

</template>

<script>
import { mdiArrowUpBold, mdiArrowDownBold, mdiKeyboardReturn, mdiKeyboardEsc } from '@quasar/extras/mdi-v5'

export default {
  name: 'AppSearchResults',
  props: { results: Object },
  setup () {
    return {
      up: mdiArrowUpBold,
      down: mdiArrowDownBold,
      select: mdiKeyboardReturn,
      close: mdiKeyboardEsc
    }
  }
}
</script>

<style lang="sass">
// $search-color: scale-color($positive, $lightness: -35%)
// $search-color: scale-color($negative, $lightness: -25%)
$search-color: $primary

.app-search-input,
.app-search-input .q-field__control
  height: 50px

.app-search-input
  .q-field__control
    padding: 0 18px 0 16px !important
  input
    line-height: 38px
  .q-field__prepend,
  .q-field__append
    height: 100%
    cursor: text !important
  kbd
    font-size: .6em !important

.app-search

  &__instructions
    padding: 8px
    span
      font-size: .8em
      color: $grey
    kbd
      font-size: 1em
      color: #000

  &__section
    margin: 16px 12px 16px 0

  &__section-title
    padding: 4px 0 8px 16px
    font-weight: 500
    color: $search-color

  &__result
    margin: 4px 0 4px 0
    padding: 8px 8px 8px 16px
    border-radius: 0 4px 4px 0
    border: 1px solid rgba(0, 0, 0, 0.12)

  &__result-title
    padding-bottom: 4px
    color: $grey
    font-size: .8em

  &__result-content
    font-size: .9em
    font-weight: 400
    line-height: 1.2em

    &--token
      background-color: scale-color($positive, $lightness: 60%)
      border-radius: 4px
      padding: 0 2px
      color: #000

body.mobile .app-search__instructions
  display: none
</style>
