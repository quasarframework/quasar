<template>
  <div class="q-layout-padding">
    <q-btn push color="teal" label="Trigger" @click="trigger" class="q-my-lg" />

    <div class="q-gutter-lg row items-start">
      <div
        v-for="transition in transitions"
        :key="transition"
        style="width: 150px; height: 150px"
        class="relative-position overflow-hidden"
      >
        <transition :name="'q-transition--' + transition" appear>
          <img
            :key="gIndex + transition"
            :src="url"
            class="absolute-full"
            style="width: 150px; height: 150px"
          >
        </transition>
        <div class="bg-black text-center text-white absolute-top">{{ transition }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    let index = 0

    const url = ref('https://cdn.quasar.dev/img/parallax2.jpg')
    const gIndex = ref('q_0_')

    return {
      trigger () {
        gIndex.value = 'q_' + (++index) + '_'
        url.value = url.value === 'https://cdn.quasar.dev/img/parallax2.jpg'
          ? 'https://cdn.quasar.dev/img/parallax1.jpg'
          : 'https://cdn.quasar.dev/img/parallax2.jpg'
      },
      url,
      gIndex,
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
      ]
    }
  }
}
</script>
