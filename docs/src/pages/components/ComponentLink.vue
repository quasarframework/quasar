<template>
  <router-link
    :key="props.entry.key"
    :to="props.entry.to"
    class="component-link"
  >
    <q-card class="text-size-12 column cursor-pointer" flat>
      <div class="q-pa-md component-link__title letter-spacing-100">
        <div class="text-size-10 text-uppercase">
          {{ props.entry.tag }}
        </div>
        <div class="text-size-16 text-brand-primary text-weight-bold">
          {{ props.entry.name }}
        </div>
      </div>

      <div class="col q-pa-md row items-center no-wrap">
        <q-icon
          :name="tagIcon[props.entry.tag]"
          size="32px"
          color="brand-primary"
          aria-hidden="true"
        />

        <div class="q-pl-md">
          {{ props.entry.description }}
        </div>
      </div>
    </q-card>
  </router-link>
</template>

<script setup>
import { tagIcon } from '@/assets/links.components.js'

const props = defineProps({
  entry: Object
})
</script>

<style lang="sass">
.component-link
  text-decoration: none
  outline: none
  color: $cold-black

  .q-card
    width: 300px
    min-height: 120px
    border: solid 1px rgba($brand-secondary, 0.54)
    transition: box-shadow $header-quick-transition

  &:hover .q-card,
  &:focus-visible .q-card
    box-shadow: 0 8px 8px 0 rgba($dark, 0.2) !important

  &__title
    background: rgba($brand-primary, .1)

body.body--dark .component-link
  &:focus-visible .q-card,
  &:hover .q-card
    box-shadow: 0 0 8px 6px rgba($brand-primary, 0.8) !important
  &__title
    background: rgba($brand-primary, .2)
</style>
