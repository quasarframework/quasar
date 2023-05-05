<template>
  <div class="app-header column items-center justify-end no-wrap text-center relative-position">
    <img class="app-header__logo q-mb-lg" src="https://cdn.quasar.dev/logo-v2/svg/logo-dark.svg" />
    <div class="app-header__500 q-mb-lg row items-center justify-center">
      <q-icon class="q-mr-sm" name="warning" size="1.3em" />
      <div>Uh, oh! Our spaceship reported error 500.</div>
    </div>
    <div class="app-header__error-name text-weight-bold">{{ data.error.name }}</div>
    <div class="app-header__error-message q-mb-md">{{ data.error.message }}</div>
  </div>
</template>

<script setup>
import data from 'src/assets/data.js'
</script>

<style lang="sass">
.app-header
  color: #fff
  background-image: url('https://cdn.quasar.dev/img/landing-page/planet.png')
  background-size: cover
  background-position: 50% 50%
  padding: 300px 16px 50px

  &:after
    content: ''
    position: absolute
    left: 0
    right: 0
    bottom: 0
    height: 50px
    background: linear-gradient(to bottom, transparent, $dark 80%)

  &__logo
    width: 150px
    height: 150px
    animation: err-logo-rotate 80s linear infinite

  &__500
    font-size: 32px
    color: $ice-dust

  &__error-name
    font-size: 16px
    color: $mars-sand

  &__error-message
    font-size: 28px
    margin-top: 4px

  @media (max-width: $breakpoint-sm)
    &__logo
      width: 100px
      height: 100px
    &__500
      font-size: 16px
    &__errror-name
      font-size: 12px
    &__error-message
      font-size: 18px

@keyframes err-logo-rotate
  100%
    transform: rotate(-360deg)
</style>
