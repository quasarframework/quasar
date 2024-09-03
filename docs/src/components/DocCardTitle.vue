<template>
  <div
    class="doc-card-title q-my-xs q-mr-sm cursor-pointer"
    :id="id"
    @click="onClick"
  >{{ props.title }}</div>
</template>

<script setup>
import { computed } from 'vue'
import { copyHeading, slugify } from 'assets/page-utils.js'

const props = defineProps({
  title: String,
  prefix: String
})

const id = computed(() => (props.prefix || '') + slugify(props.title))

function onClick () {
  copyHeading(id.value)
}
</script>
