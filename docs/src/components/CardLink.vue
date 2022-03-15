<template>
  <a v-if="isExternalLink" :href="to" target="_blank">
    <slot />
  </a>
  <router-link v-else :to="to">
    <slot />
  </router-link>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'CardLink',
  props: {
    to: {
      type: String,
      required: true
    },
    isExternalLink: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
