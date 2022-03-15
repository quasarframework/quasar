<template>
  <a v-if="isExternalLink" :href="to" target="_blank">
    <slot />
  </a>
  <router-link
    v-else
    custom
    v-slot="{ href, navigate }"
  >
    <a
      :href="href"
      @click="navigate"
    >
      <slot />
    </a>
  </router-link>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'CardLink',
  props: {
    to: String,
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
