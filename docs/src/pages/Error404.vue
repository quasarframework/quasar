<template lang="pug">
q-layout
  q-page-container
    q-page.err404.column.flex-center.text-center.text-white
      .err404__hero.row.no-wrap.q-gutter-sm
        div 4
        img(src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg", style="width:30vw;max-width:150px;" size="sm" push)
        div 4
      .err404__punch-line You're not intentionally heading for a black hole, are you?
      q-btn.q-mt-md(no-caps color="white" text-color="primary" to="/" label="Take me home" push)

      landing-top-bar.err404__topbar
</template>

<script>
import LandingTopBar from 'components/page-parts/landing/LandingTopBar'

export default {
  name: 'Error404',

  meta: {
    title: 'Oops..'
  },

  components: {
    LandingTopBar
  }
}
</script>

<style lang="sass">
.err404
  background: #000 url('https://cdn.quasar.dev/img/quasar-cover.jpg') no-repeat center center fixed
  background-size: cover

  &__topbar
    display: flex;
    justify-content: center

    > div
      position: relative
      max-width: 1040px
      width: 100%

  &__hero
    font-size: 150px

    img
      animation: err-logo-rotate 240s linear infinite

@keyframes err-logo-rotate
  100%
    transform: rotate(-360deg)

body.mobile .err404
  background: unset

  &:before
    content: ''
    position: fixed /* stretch a fixed position to the whole screen */
    top: 0
    height: 100vh /* fix for mobile browser address bar appearing disappearing */
    left: 0
    right: 0
    bottom: 0
    z-index: -1 /* needed to keep in the background */
    background: #000 url('https://cdn.quasar.dev/img/quasar-cover.jpg') center center
    background-size: cover
</style>
