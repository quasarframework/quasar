<template lang="pug">
q-btn.upgrade-video-link(type="a" href="https://www.youtube.com/playlist?list=PLFZAa7EupbB6atAt_liopEDvk44wRa00B" target="_blank" padding="0")
  img(src="http://img.youtube.com/vi/TBBzdFqtehA/maxresdefault.jpg")
  .upgrade-video-link__overlay.absolute-full.no-pointer-events
  q-icon.absolute-center(name="launch" size="150px")
</template>

<script>
export default {
  name: 'UpgradeVideoLink'
}
</script>

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
    transition: opacity .28s

  .q-icon
    z-index: 2
    opacity: 0.5
    color: $grey-9
    transition: opacity 0.3s

  &:hover
    .upgrade-video-link__overlay
      opacity: .3

    .q-icon
      color: #fff
      opacity: 0.8
</style>
