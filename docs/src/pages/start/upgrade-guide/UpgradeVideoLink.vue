<template>
  <q-btn
    class="upgrade-video-link"
    href="https://www.youtube.com/playlist?list=PLFZAa7EupbB6atAt_liopEDvk44wRa00B"
    target="_blank"
    padding="0"
  >
    <img src="http://img.youtube.com/vi/TBBzdFqtehA/maxresdefault.jpg" />
    <div class="upgrade-video-link__overlay absolute-full no-pointer-events" />
    <q-icon class="absolute-center" name="launch" size="150px" />
  </q-btn>
</template>

<style lang="sass">
.upgrade-video-link
  max-width: 530px

  img
    border-radius: $generic-border-radius
    object-fit: cover
    width: 100%

  &__overlay
    border-radius: $generic-border-radius
    background: $brand-primary
    opacity: 0
    transition: opacity $header-quick-transition

  .q-icon
    z-index: 2
    opacity: 0.5
    color: $grey-9
    transition: opacity $header-quick-transition

  &:hover
    .upgrade-video-link__overlay
      opacity: .3

    .q-icon
      color: #fff
      opacity: 0.8
</style>
