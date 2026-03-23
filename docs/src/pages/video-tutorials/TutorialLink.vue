<template>
  <q-card
    class="full-width column tutorial-link cursor-pointer"
    flat
    bordered
    @click="openWebsite"
  >
    <q-card-section class="col tutorial-link__title">
      <div class="text-subtitle1 text-weight-bold">{{ props.t }}</div>
      <div class="q-mt-xs">{{ props.d }}</div>
    </q-card-section>

    <q-separator />

    <q-img alt="Tutorial logo" :src="props.i" class="bg-white" />
  </q-card>
</template>

<script setup>
import { openURL } from 'quasar'

const props = defineProps(['t', 'd', 'u', 'i'])

function openWebsite() {
  openURL(props.u)
}
</script>

<style lang="sass">
.tutorial-link
  &__title
    background: rgba(0,0,0,.05)

body.desktop .tutorial-link
  transition: background-color $header-quick-transition
  &:hover
    background-color: rgba(0,0,0,.02)
</style>
