<template>
  <h2 class="doc-card-title q-my-xs q-mr-sm" :id="id"
    ><a
      class="doc-card-title__anchor"
      :href="`#${id}`"
      title="Copy anchor to clipboard"
      @click.prevent="onClick"
      >{{ props.title }}</a
    ></h2
  >
</template>

<script setup>
import { computed } from 'vue'
import { copyHeading, slugify } from '@/assets/page-utils.js'

const props = defineProps({
  title: String,
  prefix: String
})

const id = computed(() => (props.prefix || '') + slugify(props.title))

function onClick() {
  copyHeading(id.value)
}
</script>
