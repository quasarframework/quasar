<template>
  <section class="q-my-xs q-mr-sm cursor-pointer text-subtitle1" :id="id" @click="onClick">
    <div class="doc-card-title">{{ props.title }}</div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { copyHeading, slugify } from 'assets/page-utils'

const props = defineProps({
  title: String,
  slugifiedTitle: String,
  prefix: String
})

const id = computed(() =>
  (props.prefix || '') +
  (props.slugifiedTitle !== void 0 ? props.slugifiedTitle : slugify(props.title))
)

function onClick () {
  copyHeading(id.value)
}
</script>

<style lang="sass">
.doc-card-title
  margin-left: -20px
  padding: 2px 10px 2px 24px
  position: relative
  border-radius: 3px 5px 5px 0
  background: $grey-4
  color: $grey-8

  &:after
    content: ''
    position: absolute
    top: 100%
    left: 0
    width: 0
    height: 0
    border: 0 solid transparent
    border-width: 9px 0 0 11px
    border-top-color: scale-color($grey-4, $lightness: -15%)

body.body--dark .doc-card-title
  background: $grey-9
  color: $dark-text
  &:after
    border-top-color: scale-color($grey-9, $lightness: -30%)
</style>
