<template>
  <div class="sponsor">
    <a v-if="props.href" :href="props.href" target="_blank" class="cursor-pointer block full-height">
      <q-img :src="logoUrl" :alt="props.name" height="100%" fit="contain" />
    </a>
    <q-img v-else :src="logoUrl" :alt="props.name" height="100%" fit="contain" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Dark } from 'quasar'

const props = defineProps({
  src: String,
  name: String,
  href: String
})

const logoUrl = computed(() => `https://cdn.quasar.dev/logo-sponsors-v2/${ Dark.isActive ? 'dark' : 'light' }/${ props.src }`)
</script>

<style lang="sass">
.sponsor
  box-sizing: content-box
  max-height: 80px
  max-width: 200px
  padding: map-get($space-md, 'x')
  width: 100%

  @media (min-width: $breakpoint-sm-min)
    max-height: 120px
</style>
