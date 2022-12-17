<template>
  <q-card
    class="full-width column tutorial-link cursor-pointer"
    flat
    bordered
    @click="openWebsite"
  >
    <q-card-section class="col tutorial-link__title">
      <div class="text-subtitle2 text-weight-bold">{{ name }}</div>
      <div class="q-mt-sm">{{ desc }}</div>
    </q-card-section>

    <q-img alt="Tutorial logo" :src="imgUrl" />

    <q-card-section>
      <div>Created by: {{ author }}</div>
      <div>
        Language:
        <span class="q-ml-xs text-weight-bold">{{ lang }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { openURL } from 'quasar'

const props = defineProps({
  name: String,
  desc: String,
  author: String,
  lang: String,
  link: String,
  imgUrl: String
})

function openWebsite () {
  openURL(props.link)
}
</script>

<style lang="sass">
.tutorial-link
  &__title
    background: rgba(0,0,0,.05)

body.desktop .tutorial-link
  transition: background-color .28s
  &:hover
    background-color: rgba(0,0,0,.02)
</style>
