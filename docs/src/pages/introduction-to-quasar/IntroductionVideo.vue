<template>
  <a href="https://youtu.be/PjCqsf87Z1Y?si=D1OXvGozN__Y0E8K" class="introduction-video rounded-borders overflow-hidden" style="max-width: 530px" target="_blank">
    <div class="introduction-video__thumbnail relative-position">
      <q-img src="https://i.ibb.co/k4jkggH/thumbnail-quasar-docs.jpg" :ratio="1.78">
        <q-icon class="play-button absolute-center" color="white" name="play_circle_outline" size="150px" />
      </q-img>
    </div>
  </a>
</template>

<style lang="sass">
.introduction-video

  display: block
  margin-bottom: 16px

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
      transition: opacity $header-quick-transition

    .play-button
      z-index: 2
      opacity: 0.5
      transition: opacity $header-quick-transition

    &:hover
      &:after
        opacity: 1

      .play-button
        opacity: 0.8

        &:hover
          opacity: 1
</style>
