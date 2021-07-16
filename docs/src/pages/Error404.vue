<template lang="pug">
q-page.err404.flex.flex-center.text-center
  div
    .err404__hero.flex.flex-center.no-wrap.q-gutter-sm.text-brand-primary
      div 4
      img(src="https://cdn.quasar.dev/logo-v2/svg/logo.svg")
      div 4
    .err404__punch-line.text-grey-8 You're not intentionally heading for a black hole, are you?
    q-btn.q-mt-md(no-caps color="white" text-color="brand-primary" to="/" label="Take me home" push)
</template>

<script>
import { useMeta } from 'quasar'

export default {
  name: 'Error404',

  setup () {
    useMeta({ title: 'Oops..' })
  }
}
</script>

<style lang="sass">
.err404

  &__hero
    font-size: 150px

    img
      width: 1em
      height: 1em
      animation: err-logo-rotate 80s linear infinite

@keyframes err-logo-rotate
  100%
    transform: rotate(-360deg)
</style>
