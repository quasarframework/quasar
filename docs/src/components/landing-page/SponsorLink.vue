<template>
  <a
    :href="href"
    target='_blank'
  >
    <q-img
      :src="`sponsor-logos/${src}`"
      class="q-my-md"
      width="200px"
    />
  </a>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'sponsor-link',
  props: {
    src: {
      type: String,
      required: true
    },
    href: {
      type: String,
      required: true
    }
  }
})
</script>
