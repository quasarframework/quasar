<template>
  <q-card class="team-member column" flat bordered>
    <q-card-section>
      <div class="text-bold">{{ props.name }}</div>
      <div v-if="props.github">@{{ props.github }}</div>
    </q-card-section>

    <q-img v-if="props.avatar" alt="avatar" :src="url.avatar" :ratio="1" />

    <q-card-section class="team-member__front col">
      <div class="text-grey text-italic q-mt-xs team-member__role">{{ props.role }}</div>
      <div class="q-mt-xs">{{ props.desc }}</div>
    </q-card-section>

    <q-separator style="height: 1px" />

    <q-card-actions align="around">
      <div v-if="props.twitter">
        <q-btn :href="url.twitter" target="_blank" rel="noopener" round flat :icon="fabTwitter" />
      </div>
      <div v-if="props.github">
        <q-btn :href="url.github" target="_blank" rel="noopener" round flat :icon="fabGithub" />
      </div>
      <div v-if="props.email">
        <q-btn :href="url.email" target="_blank" rel="noopener" round flat icon="mail" />
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { fabGithub, fabTwitter } from '@quasar/extras/fontawesome-v6'

const props = defineProps({
  name: String,
  avatar: String,
  role: String,
  twitter: String,
  github: String,
  email: String,
  desc: String
})

const url = computed(() => ({
  avatar: 'https://cdn.quasar.dev/team/' + props.avatar,
  twitter: 'https://twitter.com/' + props.twitter,
  github: 'https://github.com/' + props.github,
  email: 'mailto:' + props.email
}))
</script>

<style lang="sass">
.team-member
  width: 12.2rem

  &__role
    height: 42px

  .q-img__image
    filter: grayscale(100%)

  &__front
    min-height: 300px

  @media (max-width: $breakpoint-xs-max)
    width: 100%
    min-height: 640px
</style>
