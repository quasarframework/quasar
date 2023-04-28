<template>
  <div
    class="doc-card-title q-my-xs q-mr-sm cursor-pointer"
    :id="id"
    @click="onClick"
  >{{ props.title }}</div>
</template>

<script setup>
import { computed } from 'vue'
import { copyHeading, slugify } from 'assets/page-utils'

const props = defineProps({
  title: String,
  prefix: String
})

const id = computed(() => (props.prefix || '') + slugify(props.title))

function onClick () {
  copyHeading(id.value)
}
</script>

<style lang="sass">
.doc-card-title
  margin-left: -12px
  padding: 4px 8px 4px 28px
  position: relative
  border-radius: 3px 5px 5px 0
  background: $void-suit
  color: $header-btn-color--light
  font-size: ($font-size + 2px)
  letter-spacing: $letter-spacing-brand

  &:after
    content: ''
    position: absolute
    top: 100%
    left: 0
    width: 0
    height: 0
    border: 0 solid transparent
    border-width: 9px 0 0 11px
    border-top-color: scale-color($void-suit, $lightness: -15%)

body.body--dark .doc-card-title
  background: $floating-rock
  color: $dark-text
  &:after
    border-top-color: scale-color($floating-rock, $lightness: -30%)
</style>
