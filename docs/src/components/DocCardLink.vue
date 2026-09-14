<template>
  <router-link v-if="internal" :to="props.to" class="doc-card-link">
    <q-card class="column justify-center items-center cursor-pointer" flat>
      <q-icon :name="props.icon" class="q-mb-sm" :color="props.iconColor" />
      <div
        class="doc-card-link__label text-center text-size-12 letter-spacing-100"
      >
        {{ props.label }}
      </div>
    </q-card>
  </router-link>
  <a v-else :href="props.to" target="_blank" class="doc-card-link">
    <q-card class="column justify-center items-center cursor-pointer" flat>
      <q-icon :name="props.icon" class="q-mb-sm" :color="props.iconColor" />
      <div
        class="doc-card-link__label text-center text-size-12 letter-spacing-100"
      >
        {{ props.label }}
      </div>
    </q-card>
  </a>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  to: String,
  label: String,
  icon: String,
  iconColor: { type: String, default: 'brand-primary' }
})

const internal = computed(() => props.to[0] === '/' || props.to[0] === '#')
</script>

<style lang="sass">
.doc-card-link
  text-decoration: none
  outline: none

  .q-card
    width: 110px
    height: 110px
    border: solid 1px rgba($brand-secondary, 0.54)
    border-radius: 8px
    transition: box-shadow $header-quick-transition

    .q-icon
      font-size: 36px

  &__label
    color: $cold-black

  &:focus-visible .q-card,
  &:hover .q-card
    box-shadow: 0 8px 8px 0 rgba($dark, 0.2) !important

body.body--dark .doc-card-link
  &:focus-visible .q-card,
  &:hover .q-card
    box-shadow: 0 0 8px 6px rgba($brand-primary, 0.8) !important
  &__label
    color: #fff
</style>
