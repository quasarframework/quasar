<template lang="pug">
section.q-my-xs.q-mr-md.cursor-pointer.text-subtitle1(:id="id", @click="onClick")
  div.doc-card-title {{ title }}
</template>

<script>
import { computed } from 'vue'
import { copyHeading, slugify } from 'assets/page-utils'

export default {
  name: 'DocHeading',

  props: {
    title: String,
    slugifiedTitle: String,
    prefix: String
  },

  setup (props) {
    const id = computed(() =>
      (props.prefix || '') +
      (props.slugifiedTitle !== void 0 ? props.slugifiedTitle : slugify(props.title))
    )

    return {
      id,
      onClick () {
        copyHeading(id.value)
      }
    }
  }
}
</script>

<style lang="sass">
$title-color: $grey-4

.doc-card-title
  margin-left: -24px
  padding: 2px 10px 2px 24px
  background: $title-color
  color: $grey-8
  position: relative
  border-radius: 3px 5px 5px 0

  &:after
    content: ''
    position: absolute
    top: 100%
    left: 0
    width: 0
    height: 0
    border: 0 solid transparent
    border-top-color: scale-color($title-color, $lightness: -15%)
    border-width: 9px 0 0 11px
</style>
