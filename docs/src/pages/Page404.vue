<template>
  <div class="page404 flex flex-center text-center">
    <div>
      <div class="page404__hero flex flex-center no-wrap q-gutter-sm text-brand-primary">
        <div>4</div>
        <img class="page404__logo-light" src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
        <img class="page404__logo-dark" src="https://cdn.quasar.dev/logo-v2/svg/logo-dark.svg" />
        <div>4</div>
      </div>
      <div class="letter-spacing-225 q-mb-lg">
        You're not intentionally heading to a black hole, are you?
      </div>
      <q-btn class="call-to-action-btn shadow-bottom-small" color="brand-accent" to="/" label="Take me home" />
    </div>
  </div>
</template>

<script setup>
import { useMeta } from 'quasar'
useMeta({ title: 'Page not found' })
</script>

<style lang="sass">
.page404
  padding: 120px 16px

  &__hero
    font-size: 150px

    img
      width: 1em
      height: 1em
      animation: err-logo-rotate 80s linear infinite

body.body--light .page404__logo-dark
  display: none
body.body--dark .page404__logo-light
  display: none

@keyframes err-logo-rotate
  100%
    transform: rotate(-360deg)
</style>
