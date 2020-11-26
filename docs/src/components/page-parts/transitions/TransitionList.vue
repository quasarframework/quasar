<template lang="pug">
div
  q-btn.q-mb-lg(push, color="teal", label="Trigger", @click="trigger")

  .q-gutter-md.row.items-start

    q-img(
      v-for="transition in transitions"
      :key="transition"
      :transition="transition"
      :src="url"
      class="rounded-borders shadow-2"
      style="width: 150px"
      ratio="1"
      spinner-color="white"
    )
      .absolute-bottom.text-center.text-body2
        | {{ transition }}

</template>

<script>
import { ref } from 'vue'

export default {
  name: 'TransitionList',

  setup () {
    const url = ref('https://placeimg.com/500/300/nature')

    return {
      url,
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
        url.value = 'https://placeimg.com/500/300/nature?t=' + Math.random()
      }
    }
  }
}
</script>
