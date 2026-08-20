<template>
  <div class="q-pa-md q-gutter-sm">
    <q-carousel animated v-model="slide" infinite>
      <q-carousel-slide name="big-buck-bunny">
        <q-video
          class="absolute-full"
          src="https://www.youtube.com/embed/aqz-KE-bpKQ"
        />
      </q-carousel-slide>

      <q-carousel-slide name="sintel">
        <q-video
          class="absolute-full"
          src="https://www.youtube.com/embed/eRsGyueVLvQ"
        />
      </q-carousel-slide>

      <q-carousel-slide name="tears-of-steel">
        <q-video
          class="absolute-full"
          src="https://www.youtube.com/embed/R6MlUcmOul8"
        />
      </q-carousel-slide>
    </q-carousel>

    <div class="row justify-center">
      <q-btn-toggle
        glossy
        v-model="slide"
        :options="[
          { label: 'Big Buck Bunny', value: 'big-buck-bunny' },
          { label: 'Sintel', value: 'sintel' },
          { label: 'Tears of Steel', value: 'tears-of-steel' }
        ]"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slide = ref('big-buck-bunny')
</script>
