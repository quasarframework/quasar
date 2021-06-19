<template lang="pug">
.relative-position
  img.transition-list-box__ensure-img-loaded.no-pointer-events.absolute-bottom-left(
    src="https://cdn.quasar.dev/img/parallax1.jpg"
  )

  q-btn.q-mb-lg(push, color="teal", label="Trigger", @click="trigger")

  .q-gutter-md.row.items-start

    .transition-list-box.relative-position.overflow-hidden.rounded-borders.shadow-2(
      v-for="transition in transitions"
      :key="transition"
    )
      transition(:name="'q-transition--' + transition")
        img.transition-list-box__img.absolute-full(
          :key="globalIndex + transition"
          :src="url"
        )

      .transition-list-box__label.absolute-bottom.q-pa-sm.text-center.text-body2
        | {{ transition }}
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'TransitionList',

  setup () {
    let index = 0

    const url = ref('https://cdn.quasar.dev/img/parallax2.jpg')
    const globalIndex = ref('q_0_')

    return {
      url,
      globalIndex,

      transitions: [
        'slide-right',
        'slide-left',
        'slide-up',
        'slide-down',
        'fade',
        'scale',
        'rotate',
        'flip-right',
        'flip-left',
        'flip-up',
        'flip-down',
        'jump-right',
        'jump-left',
        'jump-up',
        'jump-down'
      ],

      trigger () {
        globalIndex.value = 'q_' + (++index) + '_'
        url.value = url.value === 'https://cdn.quasar.dev/img/parallax2.jpg'
          ? 'https://cdn.quasar.dev/img/parallax1.jpg'
          : 'https://cdn.quasar.dev/img/parallax2.jpg'
      }
    }
  }
}
</script>

<style lang="sass">
.transition-list-box

  width: 150px
  height: 150px

  &__img
    height: inherit
    width: inherit
    object-fit: cover
    object-position: 50% 50%

  &__label
    color: #fff
    background-color: rgba(0,0,0,.2)

  &__ensure-img-loaded
    opacity: 0
    width: 10px
    height: 10px
</style>
