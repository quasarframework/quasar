<template lang="pug">
.introduction-video.rounded-borders.overflow-hidden(style="max-width: 530px")
  .introduction-video__thumbnail.relative-position(@click="showVideo")
    q-img(v-if="!video" src="https://cdn.quasar.dev/img/quasar-app-in-30-min.jpg" :ratio="1.78")
      q-icon.play-button.absolute-center(color="white" name="play_circle_outline" size="150px")
  .introduction-video__container(v-if="video")
    iframe(src="https://www.youtube.com/embed/GV-D85D9KJQ?autoplay=1" frameborder="0" allowfullscreen)
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'IntroductionVideo',

  setup () {
    const video = ref(false)

    return {
      video,
      showVideo () {
        video.value = true
      }
    }
  }
}
</script>

<style lang="sass">
.introduction-video

  &__thumbnail
    cursor: pointer

    &:after
      content: ''
      display: block
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: 1
      background-color: rgba(0, 0, 0, 0.3)
      opacity: 0
      transition: opacity 0.3s

    .play-button
      z-index: 2
      opacity: 0.5
      transition: opacity 0.3s

    &:hover
      &:after
        opacity: 1

      .play-button
        opacity: 0.8

        &:hover
          opacity: 1

  &__container
    position: relative
    padding-bottom: 56.25%
    height: 0
    overflow: hidden
    max-width: 100%

    iframe, object, embed
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
</style>
