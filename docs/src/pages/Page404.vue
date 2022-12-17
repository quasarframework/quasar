<template>
  <div class="page404 flex flex-center text-center">
    <div>
      <div class="page404__hero flex flex-center no-wrap q-gutter-sm text-brand-primary">
        <div>4</div>
        <img class="page404__logo-light" src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
        <img class="page404__logo-dark" src="https://cdn.quasar.dev/logo-v2/svg/logo-dark.svg" />
        <div>4</div>
      </div>
      <div>
        You're not intentionally heading for a black hole, are you?
      </div>
      <q-btn class="q-mt-md" no-caps color="brand-primary" push to="/" label="Take me home" />
    </div>
  </div>
</template>

<script setup>
import { useMeta } from 'quasar'
useMeta({ title: 'Page not found' })
</script>

<style lang="sass">
.page404
  padding: 100px 16px

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
